import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/db';
import { AuthenticatedRequest, matchesTenant } from '../middleware/auth';
import { recordAuditLog } from '../middleware/audit';

export async function getAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const { role, status, search, adminId } = req.query;
    let users = db.users.getAll();

    // Multi-tenant user scoping:
    if (req.user && req.user.role !== 'SUPER_ADMIN') {
      const userAdminId = req.user.role === 'ADMIN' ? (req.user.adminId || req.user.userId) : (req.user.adminId || 'usr_admin_main');
      users = users.filter(u => {
        const uAdmin = u.adminId || (u.role === 'ADMIN' ? u._id : 'usr_admin_main');
        return uAdmin === userAdminId || u._id === req.user?.userId;
      });
    } else if (req.user?.role === 'SUPER_ADMIN' && adminId) {
      const targetAdmin = String(adminId);
      users = users.filter(u => {
        const uAdmin = u.adminId || (u.role === 'ADMIN' ? u._id : 'usr_admin_main');
        return uAdmin === targetAdmin;
      });
    }

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (status) {
      users = users.filter(u => u.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q)) ||
        (u.organization && u.organization.toLowerCase().includes(q))
      );
    }

    // Strip out password hashes for security
    const sanitized = users.map(u => {
      const { passwordHash, ...rest } = u;
      const roleDoc = db.roles.findById(u.roleId) || db.roles.findOne(r => r.code === u.role);
      const rolePerms = u.permissionMode === 'REPLACE' ? [] : (roleDoc?.permissions || []);
      const customPerms = u.customPermissions || [];
      const effectivePermissions = Array.from(new Set([...rolePerms, ...customPerms]));
      const effectiveAdminId = u.adminId || (u.role === 'ADMIN' ? u._id : 'usr_admin_main');
      return { ...rest, adminId: effectiveAdminId, effectivePermissions };
    });

    return res.json({ success: true, data: sanitized });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = db.users.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { passwordHash, ...rest } = user;
    const roleDoc = db.roles.findById(user.roleId) || db.roles.findOne(r => r.code === user.role);
    const rolePerms = user.permissionMode === 'REPLACE' ? [] : (roleDoc?.permissions || []);
    const customPerms = user.customPermissions || [];
    const effectivePermissions = Array.from(new Set([...rolePerms, ...customPerms]));
    const effectiveAdminId = user.adminId || (user.role === 'ADMIN' ? user._id : 'usr_admin_main');

    return res.json({
      success: true,
      data: { ...rest, adminId: effectiveAdminId, effectivePermissions }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, password, phone, role, roleId, organization, customPermissions, showLoginCredentials, showOnLogin } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required.'
      });
    }

    const existing = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `User with email ${email} already exists.`
      });
    }

    // Determine role ID
    let resolvedRoleId = roleId;
    if (!resolvedRoleId) {
      const roleDoc = db.roles.findOne(r => r.code === role);
      resolvedRoleId = roleDoc?._id || 'role_custom';
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // Organization name resolution
    const resolvedOrg = organization || (req.user?.organization) || (role === 'ADMIN' ? `${name}'s Organization` : 'SHIV SHAKTI ENTERPRISES');

    const newUser = db.users.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
      role,
      roleId: resolvedRoleId,
      organization: resolvedOrg,
      status: 'ACTIVE',
      avatar: initials || 'US',
      customPermissions: customPermissions || [],
      permissionMode: Array.isArray(customPermissions) ? 'REPLACE' : 'ROLE',
      showLoginCredentials: showLoginCredentials !== false,
      showOnLogin: showOnLogin !== false,
      createdAt: new Date().toISOString()
    });

    // Set adminId: for ADMIN, they are their own tenant root; for employees, link to current admin
    const finalAdminId = role === 'ADMIN'
      ? newUser._id
      : (req.body.adminId || (req.user?.role === 'ADMIN' ? req.user.userId : req.user?.adminId) || 'usr_admin_main');

    db.users.updateById(newUser._id, {
      adminId: finalAdminId
    });
    newUser.adminId = finalAdminId;

    const { passwordHash: _, ...sanitized } = newUser;
    recordAuditLog(req, 'CREATE', 'Users', `Created user account ${name} (${role})`, newUser._id, undefined, sanitized);

    return res.json({
      success: true,
      message: 'User created successfully',
      data: sanitized
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { name, phone, role, roleId, organization, status, customPermissions, permissionMode, showLoginCredentials, showOnLogin } = req.body;

    const user = db.users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (role) updates.role = role;
    if (roleId) updates.roleId = roleId;
    if (organization) updates.organization = organization;
    if (status) updates.status = status;
    if (customPermissions !== undefined) updates.customPermissions = customPermissions;
    if (permissionMode === 'ROLE' || permissionMode === 'REPLACE') updates.permissionMode = permissionMode;
    if (showLoginCredentials !== undefined) updates.showLoginCredentials = showLoginCredentials === true;
    if (showOnLogin !== undefined) updates.showOnLogin = showOnLogin === true;

    const updated = db.users.updateById(id, updates);
    if (!updated) {
      return res.status(400).json({ success: false, message: 'Update failed' });
    }

    const { passwordHash: _, ...sanitized } = updated;
    recordAuditLog(req, 'UPDATE', 'Users', `Updated user ${updated.name}`, id, user, sanitized);

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: sanitized
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateUserPermissions(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { customPermissions, showLoginCredentials, showOnLogin } = req.body;

    const user = db.users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updates: any = {
      customPermissions: Array.isArray(customPermissions) ? customPermissions : [],
      permissionMode: 'REPLACE'
    };
    if (showLoginCredentials !== undefined) {
      updates.showLoginCredentials = showLoginCredentials === true;
    }
    if (showOnLogin !== undefined) {
      updates.showOnLogin = showOnLogin === true;
    }

    const updated = db.users.updateById(id, updates)!;

    const { passwordHash: _, ...sanitized } = updated;
    recordAuditLog(
      req,
      'UPDATE',
      'Users',
      `Updated permissions and login visibility for ${user.name}`,
      id,
      {
        customPermissions: user.customPermissions,
        showLoginCredentials: user.showLoginCredentials,
        showOnLogin: user.showOnLogin
      },
      { customPermissions, showLoginCredentials, showOnLogin }
    );

    return res.json({
      success: true,
      message: 'User permissions updated successfully',
      data: sanitized
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleUserStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

    const user = db.users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const nextStatus = status || (user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    const updated = db.users.updateById(id, { status: nextStatus })!;

    const { passwordHash: _, ...sanitized } = updated;
    recordAuditLog(req, 'STATUS_CHANGE', 'Users', `Changed status of ${user.name} to ${nextStatus}`, id, { status: user.status }, { status: nextStatus });

    return res.json({
      success: true,
      message: `User status changed to ${nextStatus}`,
      data: sanitized
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function resetUserPassword(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const user = db.users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    db.users.updateById(id, { passwordHash });

    recordAuditLog(req, 'UPDATE', 'Users', `Reset password for user ${user.name}`, id);

    return res.json({
      success: true,
      message: `Password reset successfully for ${user.name}`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
