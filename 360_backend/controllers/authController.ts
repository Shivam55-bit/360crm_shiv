import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/db';
import { generateToken, AuthenticatedRequest } from '../middleware/auth';
import { recordAuditLog } from '../middleware/audit';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User does not exist.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}. Please contact administrator.`
      });
    }

    // Check password
    let isPasswordValid = false;
    if (user.passwordHash) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash).catch(() => false);
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Update last login
    db.users.updateById(user._id, {
      lastLogin: new Date().toISOString()
    });

    // Compute effective permissions
    const roleDoc = db.roles.findById(user.roleId) || db.roles.findOne(r => r.code === user.role);
    const rolePerms = user.permissionMode === 'REPLACE' ? [] : (roleDoc?.permissions || []);
    const customPerms = user.customPermissions || [];
    const permissions = Array.from(new Set([...rolePerms, ...customPerms]));

    const authenticatedUser = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      roleId: user.roleId,
      permissions,
      organization: user.organization,
      avatar: user.avatar
    };

    const token = generateToken(authenticatedUser);

    const authReq = req as AuthenticatedRequest;
    authReq.user = authenticatedUser;
    recordAuditLog(authReq, 'LOGIN', 'Authentication', `User ${user.name} (${user.role}) logged in successfully`);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: authenticatedUser
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export function getDemoUsers(req: Request, res: Response) {
  try {
    const users = db.users.getAll()
      .filter(user => user.status === 'ACTIVE' && user.showOnLogin !== false)
      .map(({ _id, name, email, role, avatar }) => ({ _id, name, email, role, avatar }));

    return res.json({ success: true, data: users });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = db.users.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const roleDoc = db.roles.findById(user.roleId) || db.roles.findOne(r => r.code === user.role);
    const rolePerms = user.permissionMode === 'REPLACE' ? [] : (roleDoc?.permissions || []);
    const customPerms = user.customPermissions || [];
    const permissions = Array.from(new Set([...rolePerms, ...customPerms]));

    return res.json({
      success: true,
      data: {
        userId: user._id,
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        roleId: user.roleId,
        permissions,
        organization: user.organization,
        avatar: user.avatar,
        status: user.status,
        lastLogin: user.lastLogin
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function switchDemoUser(req: Request, res: Response) {
  try {
    const { email, role } = req.body;
    let user = null;

    if (email) {
      user = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    } else if (role) {
      user = db.users.findOne(u => u.role === role);
    }

    if (!user) {
      user = db.users.getAll()[0];
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No users found to switch to.' });
    }

    const roleDoc = db.roles.findById(user.roleId) || db.roles.findOne(r => r.code === user.role);
    const rolePerms = user.permissionMode === 'REPLACE' ? [] : (roleDoc?.permissions || []);
    const customPerms = user.customPermissions || [];
    const permissions = Array.from(new Set([...rolePerms, ...customPerms]));

    const authenticatedUser = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      roleId: user.roleId,
      permissions,
      organization: user.organization,
      avatar: user.avatar
    };

    const token = generateToken(authenticatedUser);

    return res.json({
      success: true,
      message: `Switched session to ${user.name} (${user.role})`,
      data: {
        token,
        user: authenticatedUser
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
