import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { recordAuditLog } from '../middleware/audit';

function parseAttendanceTime(value?: string) {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function calculateWorkHours(checkIn?: string, checkOut?: string) {
  const start = parseAttendanceTime(checkIn);
  const end = parseAttendanceTime(checkOut);
  if (!start || !end) return 0;
  const seconds = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
  return Number((seconds / 3600).toFixed(2));
}

// EMPLOYEES
export async function getEmployees(req: AuthenticatedRequest, res: Response) {
  try {
    const { department, status, search } = req.query;
    let employees = db.employees.getAll();
    if (department) employees = employees.filter(e => e.department === department);
    if (status) employees = employees.filter(e => e.status === status);
    if (search) {
      const q = String(search).toLowerCase();
      employees = employees.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }
    return res.json({ success: true, data: employees });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createEmployee(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, phone, department, designation, salary, joiningDate, password } = req.body;
    if (!name || !email || !department) {
      return res.status(400).json({ success: false, message: 'Name, email and department are required' });
    }

    const existingUser = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const count = db.employees.countDocuments() + 1;
    const employeeId = `EMP-${String(count).padStart(4, '0')}`;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || '12345678', salt);

    let role = 'EMPLOYEE';
    if (department === 'Sales') role = 'SALES_EMPLOYEE';
    if (department === 'Store / Warehouse') role = 'STORE_EMPLOYEE';
    if (department === 'Accounts') role = 'ACCOUNTANT';
    if (department === 'HR & Admin') role = 'HR_EMPLOYEE';

    const newUser = db.users.insertOne({
      name,
      email,
      phone: phone || '',
      passwordHash,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const newEmp = db.employees.insertOne({
      employeeId,
      name,
      email,
      phone: phone || '',
      department: department || 'Sales',
      designation: designation || 'Staff',
      joiningDate: joiningDate || new Date().toISOString().split('T')[0],
      salary: Number(salary) || 35000,
      status: 'ACTIVE',
      userId: newUser._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'employees', 'Employee', newEmp._id, undefined, { name, employeeId, department });
    return res.status(201).json({ success: true, message: 'Employee onboarded and account created', data: newEmp });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateEmployee(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.employees.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Employee not found' });

    const { name, email, phone, department, designation, salary, status, joiningDate, password } = req.body || {};

    const updates: any = {
      ...req.body,
      salary: salary !== undefined ? Number(salary) : existing.salary,
      updatedAt: new Date().toISOString()
    };
    delete updates.password; // Do not store plaintext password in employee doc

    const updated = db.employees.updateById(id, updates);

    // Synchronize associated user account
    if (existing.userId) {
      const user = db.users.findById(existing.userId);
      if (user) {
        let newRole = user.role;
        if (department === 'Sales') newRole = 'SALES_EMPLOYEE';
        else if (department === 'Store / Warehouse') newRole = 'STORE_EMPLOYEE';
        else if (department === 'Accounts') newRole = 'ACCOUNTANT';
        else if (department === 'HR & Admin') newRole = 'HR_EMPLOYEE';

        const userUpdates: any = {
          name: name || user.name,
          email: email || user.email,
          phone: phone !== undefined ? phone : user.phone,
          status: status || user.status,
          role: newRole,
          updatedAt: new Date().toISOString()
        };

        if (password && String(password).trim()) {
          const salt = await bcrypt.genSalt(10);
          userUpdates.passwordHash = await bcrypt.hash(String(password).trim(), salt);
        }

        db.users.updateById(user._id, userUpdates);
      }
    }

    recordAuditLog(req, 'UPDATE', 'employees', `Updated employee profile for ${updated.name} (${updated.employeeId})`, id, existing, updates);
    return res.json({ success: true, message: `Employee ${updated.name} updated successfully.`, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteEmployee(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const existing = db.employees.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Employee not found' });

    db.employees.deleteById(id);

    // Delete linked user login if exists
    if (existing.userId) {
      db.users.deleteById(existing.userId);
    }

    recordAuditLog(req, 'DELETE', 'employees', `Deleted employee ${existing.name} (${existing.employeeId})`, id, existing);
    return res.json({ success: true, message: `Employee ${existing.name} (${existing.employeeId}) deleted successfully.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ATTENDANCE
export async function getAttendance(req: AuthenticatedRequest, res: Response) {
  try {
    const { date, employeeId } = req.query;
    let records = db.attendance.getAll();
    if (date) records = records.filter(r => r.date === date);
    if (employeeId) records = records.filter(r => r.employeeId === employeeId);
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return res.json({ success: true, data: records });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function logAttendance(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, employeeName, date, checkIn, checkOut, status, remarks, selfieCheckIn, selfieCheckOut, locationCheckIn, locationCheckOut, workHours } = req.body;
    if (!employeeId) return res.status(400).json({ success: false, message: 'Employee is required' });

    const attDate = date || new Date().toISOString().split('T')[0];
    const existing = db.attendance.findOne(a => a.employeeId === employeeId && a.date === attDate);

    if (existing) {
      const updated = db.attendance.updateById(existing._id, {
        checkIn: checkIn || existing.checkIn,
        checkOut: checkOut || existing.checkOut,
        status: status || existing.status,
        remarks: remarks || existing.remarks,
        selfieCheckIn: selfieCheckIn || existing.selfieCheckIn,
        selfieCheckOut: selfieCheckOut || existing.selfieCheckOut,
        locationCheckIn: locationCheckIn || existing.locationCheckIn,
        locationCheckOut: locationCheckOut || existing.locationCheckOut,
        workHours: workHours !== undefined ? Number(workHours) : existing.workHours,
        updatedAt: new Date().toISOString()
      });
      return res.json({ success: true, message: 'Attendance updated', data: updated });
    }

    const newAtt = db.attendance.insertOne({
      employeeId,
      employeeName: employeeName || 'Employee',
      date: attDate,
      checkIn: checkIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: checkOut || '',
      status: status || 'PRESENT',
      remarks: remarks || '',
      selfieCheckIn: selfieCheckIn || '',
      selfieCheckOut: selfieCheckOut || '',
      locationCheckIn: locationCheckIn || undefined,
      locationCheckOut: locationCheckOut || undefined,
      workHours: workHours !== undefined ? Number(workHours) : undefined,
      createdAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'attendance', 'Attendance', newAtt._id, undefined, { employeeName, status: newAtt.status });
    return res.status(201).json({ success: true, message: 'Attendance logged', data: newAtt });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// GEOLOCATION & SECURITY VALIDATION HELPERS
export function calculateHaversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function validateAttendanceSecurity(selfie?: string, location?: any, mode: 'IN' | 'OUT' = 'IN'): {
  valid: boolean;
  message?: string;
  verifiedLocation?: {
    lat: number;
    lng: number;
    accuracy?: number;
    address?: string;
    matchedLocationName?: string;
    verifiedDistance?: number;
    officeLocationId?: string;
  };
} {
  const settings = db.getAttendanceSecurityConfig();

  const isSelfieRequired = mode === 'IN'
    ? (settings.requireSelfieClockIn ?? settings.requireSelfie)
    : (settings.requireSelfieClockOut ?? false);

  const isLocationRequired = mode === 'IN'
    ? (settings.requireLocationClockIn ?? settings.requireLocation)
    : (settings.requireLocationClockOut ?? false);

  // 1. Selfie Policy Enforcement
  if (isSelfieRequired) {
    if (!selfie || typeof selfie !== 'string' || !selfie.startsWith('data:image/')) {
      return {
        valid: false,
        message: `Selfie verification is required for Clock-${mode === 'IN' ? 'In' : 'Out'} by Super Admin security policy. Please capture a live photo.`
      };
    }
  }

  // 2. Location & Geofencing Policy Enforcement
  if (isLocationRequired) {
    const lat = typeof location?.lat === 'number' ? location.lat : parseFloat(String(location?.lat));
    const lng = typeof location?.lng === 'number' ? location.lng : parseFloat(String(location?.lng));

    if (!location || isNaN(lat) || isNaN(lng)) {
      return {
        valid: false,
        message: `Location/GPS verification is required for Clock-${mode === 'IN' ? 'In' : 'Out'}. Please enable GPS coordinates.`
      };
    }

    const accuracy = typeof location.accuracy === 'number' ? location.accuracy : parseFloat(String(location.accuracy));
    const maxAccuracy = settings.maxGpsAccuracyMeters || 100;
    if (!isNaN(accuracy) && accuracy > maxAccuracy * 2) {
      return {
        valid: false,
        message: `GPS accuracy is too weak (±${Math.round(accuracy)}m). Maximum allowed tolerance is ±${maxAccuracy}m. Please ensure GPS/Location services are enabled.`
      };
    }

    const activeLocations = (settings.allowedLocations || []).filter(l => l.enabled);
    if (activeLocations.length > 0) {
      let nearestDistance = Infinity;
      let nearestOffice: any = null;
      let matchedOffice: any = null;

      for (const office of activeLocations) {
        const dist = calculateHaversineDistanceMeters(lat, lng, office.lat, office.lng);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestOffice = office;
        }
        if (dist <= (office.radiusMeters || 100)) {
          matchedOffice = office;
          break;
        }
      }

      if (!matchedOffice) {
        return {
          valid: false,
          message: `Clock ${mode === 'IN' ? 'In' : 'Out'} is not allowed from your current location. (Nearest: ${nearestOffice?.name || 'Office'} — approx ${nearestDistance}m away, allowed radius: ${nearestOffice?.radiusMeters || 100}m)`
        };
      }

      return {
        valid: true,
        verifiedLocation: {
          lat,
          lng,
          accuracy: !isNaN(accuracy) ? accuracy : undefined,
          address: location.address || matchedOffice.address || matchedOffice.name,
          matchedLocationName: matchedOffice.name,
          officeLocationId: matchedOffice.id,
          verifiedDistance: calculateHaversineDistanceMeters(lat, lng, matchedOffice.lat, matchedOffice.lng)
        }
      };
    }
  }

  return {
    valid: true,
    verifiedLocation: (location && typeof location.lat === 'number' && typeof location.lng === 'number') ? {
      lat: location.lat,
      lng: location.lng,
      accuracy: location.accuracy,
      address: location.address || 'Geo-stamped check-in'
    } : undefined
  };
}

// EMPLOYEE CLOCK-IN
export async function clockIn(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, employeeName, selfie, location, remarks } = req.body;
    const empId = employeeId || (req.user as any)?.employeeId || req.user?.userId;
    const empName = employeeName || req.user?.name || 'Employee';

    if (!empId) {
      return res.status(400).json({ success: false, message: 'Employee identification is required' });
    }

    const settings = db.getAttendanceSecurityConfig();

    // Validate against Super Admin Security Policy
    const securityCheck = validateAttendanceSecurity(selfie, location, 'IN');
    if (!securityCheck.valid) {
      return res.status(403).json({ success: false, message: securityCheck.message });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const finalLocation = securityCheck.verifiedLocation || location || undefined;

    const clockInVerification = {
      selfieRequired: settings.requireSelfieClockIn ?? settings.requireSelfie,
      selfieVerified: !!selfie,
      selfieUrl: selfie || '',
      locationRequired: settings.requireLocationClockIn ?? settings.requireLocation,
      locationVerified: !!finalLocation,
      latitude: finalLocation?.lat,
      longitude: finalLocation?.lng,
      accuracy: finalLocation?.accuracy,
      officeLocationId: finalLocation?.officeLocationId,
      officeLocationName: finalLocation?.matchedLocationName,
      distanceFromOffice: finalLocation?.verifiedDistance,
      verifiedAt: new Date().toISOString()
    };

    let existing = db.attendance.findOne(a =>
      (a.employeeId === empId ||
        a.employeeId === (req.user as any)?.userId ||
        (!!empName && a.employeeName.toLowerCase() === empName.toLowerCase())) &&
      a.date === today
    );

    if (existing) {
      if (existing.checkIn && !existing.checkOut) {
        return res.status(400).json({
          success: false,
          message: `Already clocked in at ${existing.checkIn}. Please clock out when your shift ends.`,
          data: existing
        });
      }

      // If re-clocking or updating today
      const updated = db.attendance.updateById(existing._id, {
        checkIn: checkInTime,
        checkOut: '',
        status: 'PRESENT',
        remarks: remarks || existing.remarks || 'Clocked in via Verified Mobile/Desk Station',
        selfieCheckIn: selfie || existing.selfieCheckIn,
        selfieCheckOut: '',
        locationCheckIn: finalLocation || existing.locationCheckIn,
        locationCheckOut: undefined,
        clockInVerification,
        clockOutVerification: undefined,
        breaks: [],
        workHours: 0,
        totalAttendanceMinutes: 0,
        totalWorkingMinutes: 0,
        totalBreakMinutes: 0,
        totalActiveMinutes: 0,
        totalIdleMinutes: 0,
        activeRatio: 100,
        updatedAt: new Date().toISOString()
      });

      recordAuditLog(req, 'CREATE', 'attendance', 'Attendance ClockIn', existing._id, undefined, {
        employeeName: empName,
        checkIn: checkInTime,
        hasSelfie: !!selfie,
        location: finalLocation
      });

      return res.json({
        success: true,
        message: `✅ Shift Started! Verified at ${checkInTime}${finalLocation?.matchedLocationName ? ` [${finalLocation.matchedLocationName}]` : ''}`,
        data: updated
      });
    }

    const newRecord = db.attendance.insertOne({
      employeeId: empId,
      employeeName: empName,
      date: today,
      checkIn: checkInTime,
      checkOut: '',
      status: 'PRESENT',
      remarks: remarks || 'Clocked in with verified security stamp',
      selfieCheckIn: selfie || '',
      locationCheckIn: finalLocation,
      clockInVerification,
      breaks: [],
      workHours: 0,
      totalAttendanceMinutes: 0,
      totalWorkingMinutes: 0,
      totalBreakMinutes: 0,
      totalActiveMinutes: 0,
      totalIdleMinutes: 0,
      activeRatio: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'attendance', 'Attendance ClockIn', newRecord._id, undefined, {
      employeeName: empName,
      checkIn: checkInTime,
      hasSelfie: !!selfie,
      location: finalLocation
    });

    return res.status(201).json({
      success: true,
      message: `✅ Shift Started! Verified at ${checkInTime}${finalLocation?.matchedLocationName ? ` [${finalLocation.matchedLocationName}]` : ''}`,
      data: newRecord
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// EMPLOYEE CLOCK-OUT
export async function clockOut(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, selfie, location, remarks } = req.body;
    const empId = employeeId || (req.user as any)?.employeeId || req.user?.userId;
    const empName = req.user?.name || 'Employee';

    if (!empId) {
      return res.status(400).json({ success: false, message: 'Employee identification is required' });
    }

    const settings = db.getAttendanceSecurityConfig();

    // Validate against Super Admin Security Policy for Clock-Out
    const securityCheck = validateAttendanceSecurity(selfie, location, 'OUT');
    if (!securityCheck.valid) {
      return res.status(403).json({ success: false, message: securityCheck.message });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const finalLocation = securityCheck.verifiedLocation || location || undefined;

    let existing = db.attendance.findOne(a =>
      (a.employeeId === empId ||
        a.employeeId === (req.user as any)?.userId ||
        (!!empName && a.employeeName.toLowerCase() === empName.toLowerCase())) &&
      a.date === today
    );
    if (!existing || !existing.checkIn) {
      return res.status(400).json({ success: false, message: 'You must clock in before clocking out.' });
    }
    if (existing.checkOut) {
      return res.status(400).json({ success: false, message: `Already clocked out at ${existing.checkOut}.` });
    }

    // If on break when clocking out, close the open break
    let breaks = [...(existing.breaks || [])];
    if (breaks.length > 0 && !breaks[breaks.length - 1].end) {
      const lastBreak = breaks[breaks.length - 1];
      lastBreak.end = checkOutTime;
      const startD = new Date(`${today} ${lastBreak.start}`);
      const endD = new Date(`${today} ${checkOutTime}`);
      const mins = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / 60000));
      lastBreak.durationMinutes = isNaN(mins) ? 15 : mins;
    }

    const totalBreakMinutes = breaks.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);

    // Calculate duration in minutes
    const checkInDate = new Date(`${today} ${existing.checkIn}`);
    const checkOutDate = new Date(`${today} ${checkOutTime}`);
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const totalAttendanceMinutes = isNaN(diffMs) || diffMs < 0 ? 0 : Math.round(diffMs / 60000);
    const totalWorkingMinutes = Math.max(0, totalAttendanceMinutes - totalBreakMinutes);

    // Total active & idle minutes from desktop activity sessions
    const todaySessions = db.activitySessions.find(
      s => (s.employeeId === empId || s.employeeName.toLowerCase() === empName.toLowerCase()) && s.date === today
    );
    const totalActiveSec = todaySessions.reduce((acc, s) => acc + (s.activeSeconds || 0), 0);
    const totalIdleSec = todaySessions.reduce((acc, s) => acc + (s.idleSeconds || 0), 0);
    const totalActiveMinutes = totalActiveSec > 0 ? Math.round(totalActiveSec / 60) : totalWorkingMinutes;
    const totalIdleMinutes = Math.round(totalIdleSec / 60);

    const activeRatio = totalWorkingMinutes > 0
      ? Math.min(100, Math.round((totalActiveMinutes / totalWorkingMinutes) * 1000) / 10)
      : 100;

    const workHours = Number((totalWorkingMinutes / 60).toFixed(2));

    const clockOutVerification = {
      selfieRequired: settings.requireSelfieClockOut ?? false,
      selfieVerified: !!selfie,
      selfieUrl: selfie || '',
      locationRequired: settings.requireLocationClockOut ?? false,
      locationVerified: !!finalLocation,
      latitude: finalLocation?.lat,
      longitude: finalLocation?.lng,
      accuracy: finalLocation?.accuracy,
      officeLocationId: finalLocation?.officeLocationId,
      officeLocationName: finalLocation?.matchedLocationName,
      distanceFromOffice: finalLocation?.verifiedDistance,
      verifiedAt: new Date().toISOString()
    };

    const updated = db.attendance.updateById(existing._id, {
      checkOut: checkOutTime,
      status: 'COMPLETED',
      breaks,
      selfieCheckOut: selfie || existing.selfieCheckOut,
      locationCheckOut: finalLocation || existing.locationCheckOut,
      clockOutVerification,
      workHours,
      totalAttendanceMinutes,
      totalWorkingMinutes,
      totalBreakMinutes,
      totalActiveMinutes,
      totalIdleMinutes,
      activeRatio,
      remarks: remarks || existing.remarks || 'Clocked out with verified shift summary',
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'UPDATE', 'attendance', 'Attendance ClockOut', existing._id, undefined, {
      employeeName: empName,
      checkOut: checkOutTime,
      workHours,
      totalActiveMinutes,
      totalBreakMinutes
    });

    return res.json({
      success: true,
      message: `👋 Great work today! Clock-Out verified at ${checkOutTime}. Shift Completed: ${workHours} hrs.`,
      data: updated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// BREAK CONTROLS
export async function startBreak(req: AuthenticatedRequest, res: Response) {
  try {
    const empId = (req.user as any)?.employeeId || req.user?.userId;
    const empName = req.user?.name || 'Employee';
    const { reason } = req.body;

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const existing = db.attendance.findOne(
      a => (a.employeeId === empId || a.employeeName.toLowerCase() === empName.toLowerCase()) && a.date === today
    );

    if (!existing || !existing.checkIn) {
      return res.status(400).json({ success: false, message: 'You must clock in before starting a break.' });
    }
    if (existing.checkOut) {
      return res.status(400).json({ success: false, message: 'Shift is already completed for today.' });
    }
    if (existing.status === 'ON_BREAK') {
      return res.status(400).json({ success: false, message: 'You are already on an active break.' });
    }

    const breaks = existing.breaks || [];
    const newBreak = {
      _id: `brk_${Date.now()}`,
      start: nowTime,
      reason: reason || 'Shift Break'
    };

    const updated = db.attendance.updateById(existing._id, {
      status: 'ON_BREAK',
      breaks: [...breaks, newBreak],
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `☕ Break started at ${nowTime}`,
      data: updated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function endBreak(req: AuthenticatedRequest, res: Response) {
  try {
    const empId = (req.user as any)?.employeeId || req.user?.userId;
    const empName = req.user?.name || 'Employee';

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const existing = db.attendance.findOne(
      a => (a.employeeId === empId || a.employeeName.toLowerCase() === empName.toLowerCase()) && a.date === today
    );

    if (!existing || existing.status !== 'ON_BREAK') {
      return res.status(400).json({ success: false, message: 'No active break in progress to end.' });
    }

    const breaks = [...(existing.breaks || [])];
    if (breaks.length > 0) {
      const lastBreak = breaks[breaks.length - 1];
      if (!lastBreak.end) {
        lastBreak.end = nowTime;
        const startD = new Date(`${today} ${lastBreak.start}`);
        const endD = new Date(`${today} ${nowTime}`);
        const mins = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / 60000));
        lastBreak.durationMinutes = isNaN(mins) ? 15 : mins;
      }
    }

    const totalBreakMinutes = breaks.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);

    const updated = db.attendance.updateById(existing._id, {
      status: 'PRESENT',
      breaks,
      totalBreakMinutes,
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `▶️ Break ended at ${nowTime}. Welcome back!`,
      data: updated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleBreak(req: AuthenticatedRequest, res: Response) {
  const empId = (req.user as any)?.employeeId || req.user?.userId;
  const today = new Date().toISOString().split('T')[0];
  const existing = db.attendance.findOne(
    a => (a.employeeId === empId || a.employeeName.toLowerCase() === (req.user?.name || '').toLowerCase()) && a.date === today
  );

  if (existing && existing.status === 'ON_BREAK') {
    return endBreak(req, res);
  } else {
    return startBreak(req, res);
  }
}

// GET TODAY ATTENDANCE STATUS
export async function getTodayAttendanceStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId } = req.query;
    const empId = (employeeId as string) || (req.user as any)?.employeeId || req.user?.userId;

    const today = new Date().toISOString().split('T')[0];
    const record = db.attendance.findOne(a => (a.employeeId === empId || (req.user?.name && a.employeeName.toLowerCase().includes(req.user.name.toLowerCase()))) && a.date === today);

    return res.json({
      success: true,
      data: {
        date: today,
        clockedIn: !!(record && record.checkIn && !record.checkOut),
        clockedOut: !!(record && record.checkOut),
        isOnBreak: record?.status === 'ON_BREAK',
        record: record || null
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// SALARY
export async function getSalaries(req: AuthenticatedRequest, res: Response) {
  try {
    const { month, employeeId } = req.query;
    let salaries = db.salaries.getAll();
    if (month) salaries = salaries.filter(s => s.month === month);
    if (employeeId) salaries = salaries.filter(s => s.employeeId === employeeId);
    return res.json({ success: true, data: salaries });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateSalary(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, employeeName, month, basicSalary, allowances, deductions, paymentStatus } = req.body;
    if (!employeeId || !month) return res.status(400).json({ success: false, message: 'Employee and month are required' });

    const basic = Number(basicSalary) || 0;
    const allow = Number(allowances) || 0;
    const ded = Number(deductions) || 0;
    const netSalary = Math.max(0, basic + allow - ded);

    const newSal = db.salaries.insertOne({
      employeeId,
      employeeName: employeeName || 'Employee',
      month,
      basicSalary: basic,
      allowances: allow,
      deductions: ded,
      netSalary,
      paymentStatus: paymentStatus || 'PROCESSED',
      paymentDate: paymentStatus === 'PAID' ? new Date().toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'salary', 'Salary', newSal._id, undefined, { employeeName, month, netSalary });
    return res.status(201).json({ success: true, message: 'Salary record generated', data: newSal });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// PERFORMANCE
export async function getPerformanceReviews(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId } = req.query;
    let reviews = db.performance.getAll();
    if (employeeId) reviews = reviews.filter(r => r.employeeId === employeeId);
    return res.json({ success: true, data: reviews });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createPerformanceReview(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, employeeName, reviewPeriod, rating, comments, goalsAchieved } = req.body;
    if (!employeeId || !rating) return res.status(400).json({ success: false, message: 'Employee and rating are required' });

    const newPerf = db.performance.insertOne({
      employeeId,
      employeeName: employeeName || 'Employee',
      reviewPeriod: reviewPeriod || 'Q1 2026',
      rating: Number(rating),
      comments: comments || '',
      goalsAchieved: goalsAchieved || '',
      reviewerName: req.user?.name || 'Manager',
      reviewDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'performance', 'Performance', newPerf._id, undefined, { employeeName, rating });
    return res.status(201).json({ success: true, message: 'Performance appraisal recorded', data: newPerf });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ==================== LEAVE REQUESTS & HR APPROVALS ====================
export async function getLeaves(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, employeeId, search } = req.query;
    let leaves = db.leaves.getAll();

    if (status && status !== 'ALL') {
      leaves = leaves.filter(l => l.status === status);
    }

    if (employeeId) {
      leaves = leaves.filter(l => l.employeeId === employeeId);
    }

    if (search) {
      const q = String(search).toLowerCase();
      leaves = leaves.filter(l =>
        (l.employeeName && l.employeeName.toLowerCase().includes(q)) ||
        (l.leaveType && l.leaveType.toLowerCase().includes(q)) ||
        (l.reason && l.reason.toLowerCase().includes(q))
      );
    }

    leaves.sort((a, b) => new Date(b.appliedAt || b.createdAt || Date.now()).getTime() - new Date(a.appliedAt || a.createdAt || Date.now()).getTime());

    const total = db.leaves.countDocuments();
    const pending = db.leaves.countDocuments(l => l.status === 'PENDING');
    const approved = db.leaves.countDocuments(l => l.status === 'APPROVED');
    const rejected = db.leaves.countDocuments(l => l.status === 'REJECTED');

    return res.json({
      success: true,
      data: {
        leaves,
        stats: { total, pending, approved, rejected }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateLeaveStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const { status, reviewNotes } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid leave status' });
    }

    const leave = db.leaves.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    const previousStatus = leave.status;
    const updated = db.leaves.updateById(id, {
      status,
      reviewedBy: req.user?.name || 'HR Admin',
      approvedBy: status === 'APPROVED' ? (req.user?.name || 'HR Admin') : undefined,
      reviewedAt: new Date().toISOString(),
      reviewNotes: reviewNotes || '',
      updatedAt: new Date().toISOString()
    });

    // Notify employee of approval/rejection
    if (leave.employeeId) {
      db.notifications.insertOne({
        recipientId: leave.employeeId,
        userId: leave.employeeId,
        title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
        message: `Your ${leave.leaveType} leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()} by ${req.user?.name || 'HR'}.`,
        type: 'LEAVE_STATUS',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    recordAuditLog(req, 'UPDATE', 'leaves', 'Leave Request Status', id, { status: previousStatus }, { status, reviewer: req.user?.name });

    return res.json({
      success: true,
      message: `Leave request ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`,
      data: updated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ==================== SUPER ADMIN ATTENDANCE SECURITY SETTINGS ====================

export async function getAttendanceSettings(req: AuthenticatedRequest, res: Response) {
  try {
    const config = db.getAttendanceSecurityConfig();
    return res.json({
      success: true,
      data: config
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateAttendanceSettings(req: AuthenticatedRequest, res: Response) {
  try {
    const {
      requireSelfie,
      requireLocation,
      requireSelfieClockIn,
      requireLocationClockIn,
      requireSelfieClockOut,
      requireLocationClockOut,
      desktopTrackingEnabled,
      trackActiveApplications,
      trackIdleTime,
      idleThresholdMinutes,
      activityDetectionIntervalSeconds,
      activitySyncIntervalSeconds,
      allowOfflineTracking,
      maxGpsAccuracyMeters,
      allowedLocations
    } = req.body;

    let config = db.attendanceSettings.findById('attendance_security_config');

    const updates: any = {
      requireSelfie: typeof requireSelfie === 'boolean' ? requireSelfie : (config?.requireSelfie ?? true),
      requireLocation: typeof requireLocation === 'boolean' ? requireLocation : (config?.requireLocation ?? true),
      requireSelfieClockIn: typeof requireSelfieClockIn === 'boolean' ? requireSelfieClockIn : (config?.requireSelfieClockIn ?? true),
      requireLocationClockIn: typeof requireLocationClockIn === 'boolean' ? requireLocationClockIn : (config?.requireLocationClockIn ?? true),
      requireSelfieClockOut: typeof requireSelfieClockOut === 'boolean' ? requireSelfieClockOut : (config?.requireSelfieClockOut ?? false),
      requireLocationClockOut: typeof requireLocationClockOut === 'boolean' ? requireLocationClockOut : (config?.requireLocationClockOut ?? false),
      desktopTrackingEnabled: typeof desktopTrackingEnabled === 'boolean' ? desktopTrackingEnabled : (config?.desktopTrackingEnabled ?? true),
      trackActiveApplications: typeof trackActiveApplications === 'boolean' ? trackActiveApplications : (config?.trackActiveApplications ?? true),
      trackIdleTime: typeof trackIdleTime === 'boolean' ? trackIdleTime : (config?.trackIdleTime ?? true),
      idleThresholdMinutes: Number(idleThresholdMinutes) || config?.idleThresholdMinutes || 5,
      activityDetectionIntervalSeconds: Number(activityDetectionIntervalSeconds) || config?.activityDetectionIntervalSeconds || 5,
      activitySyncIntervalSeconds: Number(activitySyncIntervalSeconds) || config?.activitySyncIntervalSeconds || 30,
      allowOfflineTracking: typeof allowOfflineTracking === 'boolean' ? allowOfflineTracking : (config?.allowOfflineTracking ?? true),
      maxGpsAccuracyMeters: Number(maxGpsAccuracyMeters) || config?.maxGpsAccuracyMeters || 100,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.name || 'Super Admin'
    };

    if (Array.isArray(allowedLocations)) {
      updates.allowedLocations = allowedLocations.map((loc: any, index: number) => ({
        id: loc.id || `loc_${Date.now()}_${index}`,
        name: loc.name || `Office Location ${index + 1}`,
        lat: Number(loc.lat) || 28.6139,
        lng: Number(loc.lng) || 77.2090,
        radiusMeters: Number(loc.radiusMeters) || 100,
        maxAccuracyMeters: Number(loc.maxAccuracyMeters) || 50,
        address: loc.address || '',
        enabled: loc.enabled !== false
      }));
    }

    let saved;
    if (config) {
      saved = db.attendanceSettings.updateById('attendance_security_config', updates);
    } else {
      saved = db.attendanceSettings.insertOne({
        _id: 'attendance_security_config',
        ...updates
      });
    }

    recordAuditLog(req, 'UPDATE', 'attendance_settings', 'Attendance Security Settings', 'attendance_security_config', config, updates);

    return res.json({
      success: true,
      message: 'Attendance Security Settings updated successfully',
      data: saved
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addAllowedLocation(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, lat, lng, radiusMeters, address, enabled } = req.body;
    if (!name || isNaN(Number(lat)) || isNaN(Number(lng))) {
      return res.status(400).json({ success: false, message: 'Location name, latitude, and longitude are required' });
    }

    let config = db.getAttendanceSecurityConfig();
    const newLocation = {
      id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      lat: Number(lat),
      lng: Number(lng),
      radiusMeters: Number(radiusMeters) || 100,
      address: address || '',
      enabled: enabled !== false
    };

    const updatedLocations = [...(config.allowedLocations || []), newLocation];
    const saved = db.attendanceSettings.updateById('attendance_security_config', {
      allowedLocations: updatedLocations,
      updatedAt: new Date().toISOString()
    }) || db.attendanceSettings.insertOne({
      _id: 'attendance_security_config',
      ...config,
      allowedLocations: updatedLocations
    });

    recordAuditLog(req, 'CREATE', 'attendance_locations', 'Add Allowed Location', newLocation.id, undefined, newLocation);

    return res.status(201).json({
      success: true,
      message: `Allowed office location "${name}" added successfully`,
      data: saved
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateAllowedLocation(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { name, lat, lng, radiusMeters, address, enabled } = req.body;
    let config = db.getAttendanceSecurityConfig();

    const locationIndex = (config.allowedLocations || []).findIndex(l => l.id === id);
    if (locationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Office location not found' });
    }

    const currentLoc = config.allowedLocations[locationIndex];
    const updatedLoc = {
      ...currentLoc,
      name: name !== undefined ? name : currentLoc.name,
      lat: lat !== undefined ? Number(lat) : currentLoc.lat,
      lng: lng !== undefined ? Number(lng) : currentLoc.lng,
      radiusMeters: radiusMeters !== undefined ? Number(radiusMeters) : currentLoc.radiusMeters,
      address: address !== undefined ? address : currentLoc.address,
      enabled: enabled !== undefined ? enabled : currentLoc.enabled
    };

    config.allowedLocations[locationIndex] = updatedLoc;

    const saved = db.attendanceSettings.updateById('attendance_security_config', {
      allowedLocations: config.allowedLocations,
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'UPDATE', 'attendance_locations', 'Update Allowed Location', id, currentLoc, updatedLoc);

    return res.json({
      success: true,
      message: `Office location "${updatedLoc.name}" updated`,
      data: saved
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteAllowedLocation(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    let config = db.getAttendanceSecurityConfig();

    const filtered = (config.allowedLocations || []).filter(l => l.id !== id);
    if (filtered.length === config.allowedLocations.length) {
      return res.status(404).json({ success: false, message: 'Office location not found' });
    }

    const saved = db.attendanceSettings.updateById('attendance_security_config', {
      allowedLocations: filtered,
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'DELETE', 'attendance_locations', 'Delete Allowed Location', id);

    return res.json({
      success: true,
      message: 'Office location removed successfully',
      data: saved
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
