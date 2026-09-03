import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';
import { RoleType } from '../database/types';

export const JWT_SECRET = process.env.JWT_SECRET || '360crm_enterprise_secret_key_2026_shiva';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
  role: RoleType;
  roleId: string;
  permissions: string[];
  organization?: string;
  adminId?: string;
  avatar?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      roleId: user.roleId,
      permissions: user.permissions,
      organization: user.organization,
      adminId: user.adminId,
      avatar: user.avatar
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Returns the effective admin/tenant ID for the current request context
 */
export function getTenantAdminId(req: AuthenticatedRequest): string {
  if (!req.user) return 'usr_admin_main';
  if (req.user.role === 'ADMIN') {
    return req.user.adminId || req.user.userId;
  }
  if (req.user.role === 'SUPER_ADMIN') {
    return (req.query?.adminId as string) || req.user.adminId || 'usr_superadmin';
  }
  return req.user.adminId || 'usr_admin_main';
}

/**
 * Predicate to check if a database document belongs to the active user's tenant
 */
export function matchesTenant<T extends { adminId?: string; _id?: string }>(item: T, req: AuthenticatedRequest): boolean {
  if (!req.user) return true;
  
  // Super Admin has master visibility across all tenants unless filtering by a specific adminId
  if (req.user.role === 'SUPER_ADMIN') {
    if (req.query && req.query.adminId) {
      const targetAdmin = String(req.query.adminId);
      const itemAdmin = item.adminId || 'usr_admin_main';
      return itemAdmin === targetAdmin;
    }
    return true;
  }

  const userAdminId = req.user.role === 'ADMIN'
    ? (req.user.adminId || req.user.userId)
    : (req.user.adminId || 'usr_admin_main');

  // Existing/legacy records without adminId belong to the initial demo admin 'usr_admin_main'
  const itemAdminId = item.adminId || 'usr_admin_main';

  return itemAdminId === userAdminId;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token missing or invalid. Please login.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    
    // Verify user still exists in DB and is active
    const userDoc = db.users.findById(decoded.userId);
    if (userDoc) {
      if (userDoc.status === 'INACTIVE' || userDoc.status === 'SUSPENDED') {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Contact Administrator.'
        });
      }

      // Re-fetch role permissions in real-time
      const roleDoc = db.roles.findById(userDoc.roleId) || db.roles.findOne(r => r.code === userDoc.role);
      const rolePerms = userDoc.permissionMode === 'REPLACE' ? [] : (roleDoc?.permissions || []);
      const customPerms = userDoc.customPermissions || [];
      const mergedPerms = Array.from(new Set([...rolePerms, ...customPerms]));

      let effectiveAdminId = userDoc.adminId;
      if (!effectiveAdminId) {
        if (userDoc.role === 'ADMIN') {
          effectiveAdminId = userDoc._id;
        } else if (userDoc.role === 'SUPER_ADMIN') {
          effectiveAdminId = 'usr_superadmin';
        } else {
          effectiveAdminId = 'usr_admin_main';
        }
      }

      req.user = {
        userId: userDoc._id,
        email: userDoc.email,
        name: userDoc.name,
        role: userDoc.role,
        roleId: userDoc.roleId,
        permissions: mergedPerms,
        organization: userDoc.organization,
        adminId: effectiveAdminId,
        avatar: userDoc.avatar
      };
    } else {
      req.user = decoded;
    }

    next();
  } catch (err: any) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.'
    });
  }
}

