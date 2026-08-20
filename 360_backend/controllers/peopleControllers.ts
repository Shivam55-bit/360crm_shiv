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

    const updated = db.employees.updateById(id, req.body);
    recordAuditLog(req, 'UPDATE', 'employees', 'Employee', id, existing, req.body);
    return res.json({ success: true, message: 'Employee updated', data: updated });
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
    recordAuditLog(req, 'DELETE', 'employees', 'Employee', id, existing);
    return res.json({ success: true, message: 'Employee deleted' });
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

// EMPLOYEE SELFIE CLOCK-IN
export async function clockIn(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, employeeName, selfie, location, remarks } = req.body;
    const empId = employeeId || (req.user as any)?.employeeId || req.user?.userId;
    const empName = employeeName || req.user?.name || 'Employee';

    if (!empId) {
      return res.status(400).json({ success: false, message: 'Employee identification is required' });
    }
    if (typeof selfie !== 'string' || !selfie.startsWith('data:image/')) {
      return res.status(400).json({ success: false, message: 'A selfie is required to clock in.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
        status: 'PRESENT',
        remarks: remarks || existing.remarks || 'Clocked in via Selfie Mobile Desk',
        selfieCheckIn: selfie || existing.selfieCheckIn,
        locationCheckIn: location || existing.locationCheckIn,
        updatedAt: new Date().toISOString()
      });

      recordAuditLog(req, 'CREATE', 'attendance', 'Attendance ClockIn', existing._id, undefined, {
        employeeName: empName,
        checkIn: checkInTime,
        hasSelfie: !!selfie,
        hasGps: !!location
      });

      return res.json({
        success: true,
        message: `✅ Good morning ${empName}! Clock-In verified with Selfie & GPS stamp at ${checkInTime}.`,
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
      remarks: remarks || 'Clocked in with verified Selfie & GPS',
      selfieCheckIn: selfie || '',
      locationCheckIn: location || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'CREATE', 'attendance', 'Attendance ClockIn', newRecord._id, undefined, {
      employeeName: empName,
      checkIn: checkInTime,
      hasSelfie: !!selfie,
      hasGps: !!location
    });

    return res.status(201).json({
      success: true,
      message: `✅ Good morning ${empName}! Clock-In verified with Selfie & GPS stamp at ${checkInTime}.`,
      data: newRecord
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// EMPLOYEE SELFIE CLOCK-OUT
export async function clockOut(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, selfie, location, remarks } = req.body;
    const empId = employeeId || (req.user as any)?.employeeId || req.user?.userId;
    const empName = req.user?.name || 'Employee';

    if (!empId) {
      return res.status(400).json({ success: false, message: 'Employee identification is required' });
    }
    if (typeof selfie !== 'string' || !selfie.startsWith('data:image/')) {
      return res.status(400).json({ success: false, message: 'A selfie is required to clock out.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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

    const hoursWorked = calculateWorkHours(existing.checkIn, checkOutTime);

    const updated = db.attendance.updateById(existing._id, {
      checkOut: checkOutTime,
      selfieCheckOut: selfie || existing.selfieCheckOut,
      locationCheckOut: location || existing.locationCheckOut,
      workHours: hoursWorked,
      remarks: remarks || existing.remarks || 'Clocked out with selfie verification',
      updatedAt: new Date().toISOString()
    });

    recordAuditLog(req, 'UPDATE', 'attendance', 'Attendance ClockOut', existing._id, undefined, {
      employeeName: empName,
      checkOut: checkOutTime,
      hasSelfie: !!selfie,
      hasGps: !!location
    });

    return res.json({
      success: true,
      message: `👋 Great work today! Clock-Out verified with Selfie & Location stamp at ${checkOutTime}.`,
      data: updated
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
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
