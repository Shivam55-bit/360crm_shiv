# 📱 360CRM Enterprise — Employee Mobile / PWA App Specification & Complete API Guide

> **Document Version:** 2.0.0  
> **Target Audience:** Frontend/Mobile Developers (React Native, Flutter, Kotlin, Swift, React PWA), Backend Engineers & Product Team.  
> **Base API URL:** `http://<SERVER_IP>:5000/api` (or `/api` via reverse proxy)  
> **Auth Scheme:** Standard JWT Bearer Token (`Authorization: Bearer <JWT_TOKEN>`)

---

## 📑 Table of Contents
1. [App Overview & Architecture](#1-app-overview--architecture)
2. [Complete Employee Feature Matrix](#2-complete-employee-feature-matrix)
3. [End-to-End User Journeys & Workflow Diagrams](#3-end-to-end-user-journeys--workflow-diagrams)
4. [Mobile App Permissions Required](#4-mobile-app-permissions-required)
5. [Complete REST API Reference (15 Modules)](#5-complete-rest-api-reference)
   - [Module 1: Authentication & Session](#module-1-authentication--session)
   - [Module 2: Employee Dashboard & Summary Stats](#module-2-employee-dashboard--summary-stats)
   - [Module 3: Geo-Fenced Attendance & Time Clock](#module-3-geo-fenced-attendance--time-clock)
   - [Module 4: Live GPS Tracking & Telemetry Ingestion](#module-4-live-gps-tracking--telemetry-ingestion)
   - [Module 5: My Leads & Field Sales Pipeline](#module-5-my-leads--field-sales-pipeline)
   - [Module 6: SIM Calls & Voice Recording Upload](#module-6-sim-calls--voice-recording-upload)
   - [Module 7: Follow-ups, Visits & Reminders](#module-7-follow-ups-visits--reminders)
   - [Module 8: Field Tasks & Site Visit Verification](#module-8-field-tasks--site-visit-verification)
   - [Module 9: Instant Messaging (WhatsApp & SMS)](#module-9-instant-messaging-whatsapp--sms)
   - [Module 10: Customer Directory & 360 Dossier](#module-10-customer-directory--360-dossier)
   - [Module 11: Field Quotations & Orders Generator](#module-11-field-quotations--orders-generator)
   - [Module 12: Performance, KPIs & Incentives](#module-12-performance-kpis--incentives)
   - [Module 13: Leave Requests & Balance](#module-13-leave-requests--balance)
   - [Module 14: Monthly Salary & Payslip PDF](#module-14-monthly-salary--payslip-pdf)
   - [Module 15: Push Notifications & Alerts](#module-15-push-notifications--alerts)
6. [TypeScript Interfaces & Data Models](#6-typescript-interfaces--data-models)
7. [Recommended Mobile App Folder Structure](#7-recommended-mobile-app-folder-structure)

---

## 1. App Overview & Architecture

The 360CRM Employee App is an enterprise-grade mobile application designed for **On-Field Sales Representatives, Telecallers, Service Technicians, and Operations Staff**.

```
+-------------------------------------------------------------------------+
|                        EMPLOYEE MOBILE APP                             |
|  (React Native / Flutter / Kotlin / Swift / Progressive Web App)       |
+--------------------+-------------------+-------------------+------------+
|  Time Clock & GPS  |  Lead & Customer  |  Dialer & Calls   | Field Task |
|  Selfie Punch-in   |  Sales Pipeline   |  Audio Recording  | Geo-Proof  |
+--------------------+-------------------+-------------------+------------+
                                      |
                     [ HTTPS / JSON + Bearer JWT Token ]
                                      |
                                      v
+-------------------------------------------------------------------------+
|                  EXPRESS.JS REST API BACKEND SERVER                     |
|                 (Port 5000: /api/employee/* & /api/*)                   |
+-------------------------------------------------------------------------+
| Auth & RBAC | Lead Engine | GPS Geodesic | Invoicing & GST | Telemetry  |
+-------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------+
|               JSON DISK PERSISTENT DATABASE ENGINE                      |
| (db.employees, db.leads, db.attendance, db.tracking, db.quotations...)  |
+-------------------------------------------------------------------------+
```

---

## 2. Complete Employee Feature Matrix

| Module | Features Included |
|---|---|
| **1. Auth & Profile** | Login via Email/Password or Phone OTP, biometric login (Fingerprint/FaceID), view/edit personal profile & emergency contact. |
| **2. Dashboard** | Today's shift status, daily call target counter, active assigned leads, upcoming follow-ups, pending field visits, conversion rate. |
| **3. Attendance Clock** | Geo-fenced Punch-In & Punch-Out with live selfie camera capture, break manager (Tea/Lunch), shift duration live stopwatch. |
| **4. Live GPS Tracking** | Automatic background location pings every 30-60s during work hours, battery & speed tracking, offline SQLite queue with auto-sync. |
| **5. Lead Pipeline** | View assigned leads, instant call button, WhatsApp catalog send, stage changer (New ➔ Qualified ➔ Proposal ➔ Won/Lost), manual on-field lead creation. |
| **6. Call Logs & Audio** | Native dialer hook / in-app audio recorder, automatic duration tracking, outcome tagging (Interested, Call Back, Not Reachable, Deal Closed). |
| **7. Follow-ups** | Calendar schedule for client discovery calls, site visits, alarm notifications before scheduled meeting time. |
| **8. Field Tasks** | Site visit assignments with client address, Google Maps direct navigation, selfie/photo check-in proof, task completion notes. |
| **9. WhatsApp/SMS** | 1-click template messages to client on WhatsApp or SMS with quotation links and company brochures. |
| **10. Quotation Maker** | On-the-spot GST quote generation from mobile with multi-item selection, discount application, and PDF share. |
| **11. Customer 360** | Complete client directory with past order history, outstanding payment balance, and ledger timeline. |
| **12. Leaves & Holidays** | Leave balance (Casual, Sick, Earned), apply leave with reason & dates, live status tracker (Pending, Approved, Rejected). |
| **13. Salary & Payslip** | View monthly gross salary, PF/ESI deductions, net pay, and download official monthly Payslip PDF. |
| **14. Performance KPIs** | Leaderboard rank, won deals vs monthly target, incentive calculation, call activity heatmaps. |

---

## 3. End-to-End User Journeys & Workflow Diagrams

### Flow 1: Shift Start (Clock-In with Selfie & Geofence)
```mermaid
sequenceDiagram
    autonumber
    actor Employee as Field Employee
    participant App as Mobile App
    participant GPS as Device GPS & Camera
    participant API as Backend API (/api/employee)

    Employee->>App: Opens App & Taps "Clock-In"
    App->>GPS: Request High-Accuracy GPS (Lat, Lng)
    GPS-->>App: Latitude: 23.0225, Longitude: 72.5714
    App->>GPS: Open Camera for Selfie
    GPS-->>App: Base64 / Image URI
    App->>API: POST /api/employee/attendance/clock-in {lat, lng, selfie, battery, address}
    API->>API: Check Geofence radius & Work Policy
    API-->>App: 200 OK (Clock-in Verified, Shift timer starts)
    App-->>Employee: Shows Shift Timer (00:00:01) & Starts Background GPS Service
```

---

### Flow 2: Field Lead Lifecycle & Quotation Creation
```mermaid
sequenceDiagram
    autonumber
    actor Rep as Sales Representative
    participant App as Mobile App
    participant API as Backend API
    actor Client as Business Client

    API-->>App: Push Notification: "New TradeIndia Lead Assigned: Shree Cement"
    Rep->>App: Opens Lead Details
    Rep->>Client: Taps "Call Client" (Phone Dialer opens)
    Rep->>App: Call Ends -> Log Call Duration, Outcome: "Interested", Audio Note
    App->>API: POST /api/employee/calls {leadId, duration: 180, outcome: 'INTERESTED'}
    Rep->>App: Schedules Follow-up for Tomorrow 11:00 AM
    App->>API: POST /api/employee/follow-ups {scheduledAt, title: 'Catalog Discussion'}
    Rep->>App: Creates Quotation on Field (Adds 50x SS Valves @ Rs. 2,500 + 18% GST)
    App->>API: POST /api/employee/quotations {items, customerId, leadId}
    API-->>App: 201 Created (Quotation QT-2026-0042 Generated)
    Rep->>Client: Shares PDF Quotation directly via WhatsApp
```

---

### Flow 3: Client Site Visit & Task Geo-Verification
```mermaid
sequenceDiagram
    autonumber
    actor Tech as Field Technician / Rep
    participant App as Mobile App
    participant API as Backend API

    Tech->>App: Views "Today's Tasks" -> Selects "Site Survey @ Adani Port"
    Tech->>App: Taps "Navigate" (Opens Google Maps)
    Tech->>Tech: Arrives at Location
    Tech->>App: Taps "Geo Check-In" + Takes Site Photo
    App->>API: PATCH /api/employee/tasks/:id {status: 'IN_PROGRESS', checkInLocation, photo}
    Tech->>Tech: Completes Survey / Meeting
    Tech->>App: Enters Visit Notes & Taps "Mark Completed"
    App->>API: PATCH /api/employee/tasks/:id {status: 'COMPLETED', remarks}
    API-->>App: Task Marked Completed & Timeline Logged
```

---

## 4. Mobile App Permissions Required

```json
{
  "permissions": [
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_BACKGROUND_LOCATION",
    "android.permission.CAMERA",
    "android.permission.READ_CALL_LOG",
    "android.permission.RECORD_AUDIO",
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_PHONE_STATE",
    "android.permission.ACTIVITY_RECOGNITION"
  ]
}
```

---

## 5. Complete REST API Reference

### Headers Required for All Authenticated Endpoints:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

### Module 1: Authentication & Session

#### 1.1 Employee Login
- **Endpoint:** `POST /api/auth/login`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "employee@360crm.com",
  "password": "password123",
  "deviceInfo": {
    "platform": "Android 14",
    "deviceId": "samsung_sm_g998b",
    "appVersion": "2.0.0"
  }
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "usr_emp_01",
    "name": "Arjun Singh",
    "email": "employee@360crm.com",
    "role": "SALES_EMPLOYEE",
    "phone": "+91 98765 00112",
    "employeeId": "EMP-007",
    "department": "Sales",
    "designation": "Senior Sales & Field Representative",
    "permissions": ["leads.view", "leads.create", "quotations.create", "attendance.create"]
  }
}
```

#### 1.2 Get Current Profile
- **Endpoint:** `GET /api/employee/profile`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "emp_007",
    "employeeId": "EMP-007",
    "name": "Arjun Singh",
    "email": "employee@360crm.com",
    "phone": "+91 98765 00112",
    "department": "Sales",
    "designation": "Senior Sales & Field Representative",
    "joiningDate": "2025-04-01",
    "salary": 38000,
    "status": "ACTIVE"
  }
}
```

---

### Module 2: Employee Dashboard & Summary Stats

#### 2.1 Get Dashboard Metrics
- **Endpoint:** `GET /api/employee/dashboard`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "attendance": {
        "clockedIn": true,
        "clockedOut": false,
        "checkInTime": "09:30 AM",
        "checkOutTime": null,
        "status": "PRESENT",
        "workHours": 4.5,
        "breaks": []
      },
      "assignedLeadsCount": 12,
      "todayFollowUpsCount": 4,
      "pendingFollowUpsCount": 6,
      "callsTodayCount": 8,
      "messagesTodayCount": 5,
      "convertedLeadsCount": 3,
      "pendingTasksCount": 2,
      "unreadNotificationsCount": 3,
      "monthlyTarget": 500000,
      "achievedSales": 340000,
      "targetProgressPercent": 68
    },
    "recentLeads": [
      {
        "_id": "lead_101",
        "leadCode": "LD-2026-0045",
        "name": "Reliance Petrochemicals",
        "companyName": "Reliance Industries Ltd",
        "phone": "+91 98220 11223",
        "status": "QUALIFIED",
        "priority": "HIGH",
        "estimatedValue": 250000
      }
    ],
    "todayFollowUps": [
      {
        "_id": "fup_01",
        "title": "Quotation Review Call",
        "scheduledAt": "2026-09-01T15:30:00.000Z",
        "leadName": "Reliance Petrochemicals",
        "phone": "+91 98220 11223"
      }
    ]
  }
}
```

---

### Module 3: Geo-Fenced Attendance & Time Clock

#### 3.1 Punch-In (Clock-In)
- **Endpoint:** `POST /api/employee/attendance/clock-in`
- **Request Body:**
```json
{
  "latitude": 23.0225,
  "longitude": 72.5714,
  "address": "SG Highway, Ahmedabad, Gujarat",
  "selfieImageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "batteryLevel": 85,
  "deviceInfo": "Samsung Galaxy S23"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Clocked in successfully at 09:30 AM",
  "data": {
    "date": "2026-09-01",
    "checkIn": "09:30 AM",
    "status": "PRESENT",
    "locationCheckIn": "23.0225, 72.5714 (SG Highway, Ahmedabad)"
  }
}
```

#### 3.2 Punch-Out (Clock-Out)
- **Endpoint:** `POST /api/employee/attendance/clock-out`
- **Request Body:**
```json
{
  "latitude": 23.0228,
  "longitude": 72.5710,
  "address": "Office Headquarters, Ahmedabad",
  "selfieImageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "dailySummaryNotes": "Completed 8 calls, visited 2 clients, generated 1 quotation."
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Clocked out successfully at 06:30 PM. Total Work Hours: 8.5h",
  "data": {
    "checkIn": "09:30 AM",
    "checkOut": "06:30 PM",
    "workHours": 8.5,
    "status": "PRESENT"
  }
}
```

#### 3.3 Toggle Break (Tea / Lunch)
- **Endpoint:** `POST /api/employee/attendance/break`
- **Request Body:**
```json
{
  "breakType": "LUNCH",
  "action": "START"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Lunch break started at 01:15 PM"
}
```

#### 3.4 Monthly Attendance Calendar & History
- **Endpoint:** `GET /api/employee/attendance?month=2026-09`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-09-01",
      "checkIn": "09:30 AM",
      "checkOut": "06:30 PM",
      "workHours": 8.5,
      "status": "PRESENT",
      "breaks": [{"type": "LUNCH", "durationMinutes": 45}]
    }
  ]
}
```

---

### Module 4: Live GPS Tracking & Telemetry Ingestion

#### 4.1 Send Background Location Ping
- **Endpoint:** `POST /api/employee-tracking/location`
- **Frequency:** Every 30-60 seconds when employee is Clocked In
- **Request Body:**
```json
{
  "latitude": 23.0256,
  "longitude": 72.5789,
  "accuracy": 8.5,
  "altitude": 55.2,
  "speed": 22.4,
  "heading": 180.5,
  "battery": 82,
  "activity": "IN_VEHICLE",
  "isMockLocation": false,
  "timestamp": "2026-09-01T10:15:30.000Z"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "isMoving": true,
    "insideGeofence": true,
    "activePolicy": "STANDARD_WORKING_HOURS"
  }
}
```

#### 4.2 Sync Offline Stored Location Batch
- **Endpoint:** `POST /api/employee-tracking/location/batch`
- **Request Body:**
```json
{
  "locations": [
    {
      "latitude": 23.0240,
      "longitude": 72.5760,
      "speed": 15.0,
      "battery": 84,
      "timestamp": "2026-09-01T10:10:00.000Z"
    },
    {
      "latitude": 23.0256,
      "longitude": 72.5789,
      "speed": 22.4,
      "battery": 82,
      "timestamp": "2026-09-01T10:15:30.000Z"
    }
  ]
}
```

---

### Module 5: My Leads & Field Sales Pipeline

#### 5.1 Get My Assigned Leads
- **Endpoint:** `GET /api/employee/leads?status=QUALIFIED&search=cement`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "lead_101",
      "leadCode": "LD-2026-0045",
      "name": "Rajesh Sharma",
      "companyName": "Shree Cement Corp",
      "email": "rajesh@shreecement.com",
      "phone": "+91 98220 11223",
      "city": "Ahmedabad",
      "state": "Gujarat",
      "source": "TradeIndia",
      "status": "QUALIFIED",
      "priority": "HIGH",
      "estimatedValue": 250000,
      "tags": ["Hot Lead", "Valves Requirement"],
      "notes": "Requires 40 units of SS-316 gate valves."
    }
  ]
}
```

#### 5.2 Create New On-Field Lead
- **Endpoint:** `POST /api/employee/leads`
- **Request Body:**
```json
{
  "name": "Manoj Trivedi",
  "companyName": "Trivedi Engineering Works",
  "email": "m.trivedi@trivedifab.com",
  "phone": "+91 97129 88440",
  "city": "Vadodara",
  "state": "Gujarat",
  "source": "Field Visit",
  "priority": "HIGH",
  "estimatedValue": 180000,
  "requirement": "Industrial Flanged Ball Valves 2 inch"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "New lead created successfully",
  "data": {
    "_id": "lead_102",
    "leadCode": "LD-2026-0046",
    "status": "NEW"
  }
}
```

#### 5.3 Update Lead Stage / Status
- **Endpoint:** `PUT /api/employee/leads/:id/status`
- **Request Body:**
```json
{
  "status": "PROPOSAL",
  "notes": "Sent catalog and initial pricing estimate. Client requested formal GST quote."
}
```

---

### Module 6: SIM Calls & Voice Recording Upload

#### 6.1 Log Call Activity
- **Endpoint:** `POST /api/employee/calls`
- **Request Body:**
```json
{
  "leadId": "lead_101",
  "leadName": "Rajesh Sharma",
  "phone": "+91 98220 11223",
  "direction": "OUTBOUND",
  "durationSeconds": 145,
  "outcome": "INTERESTED",
  "notes": "Client confirmed requirement of 50 valves. Meeting scheduled tomorrow.",
  "recordingAudioUrl": "https://s3.amazonaws.com/360crm/recordings/call_998877.mp3"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Call log recorded successfully."
}
```

#### 6.2 Get Call History
- **Endpoint:** `GET /api/employee/calls?leadId=lead_101`

---

### Module 7: Follow-ups, Visits & Reminders

#### 7.1 Schedule Next Follow-up / Client Meeting
- **Endpoint:** `POST /api/employee/follow-ups`
- **Request Body:**
```json
{
  "leadId": "lead_101",
  "leadName": "Rajesh Sharma",
  "title": "Commercial Proposal Negotiation",
  "type": "Meeting",
  "priority": "HIGH",
  "scheduledAt": "2026-09-02T11:00:00.000Z",
  "location": "Client Plant Office, Sanand GIDC",
  "description": "Discuss volume discount on 50 units order."
}
```

#### 7.2 Complete / Reschedule Follow-up
- **Endpoint:** `PATCH /api/employee/follow-ups/:id`
- **Request Body:**
```json
{
  "status": "COMPLETED",
  "outcomeNotes": "Client agreed to price. Moving to Quotation stage."
}
```

---

### Module 8: Field Tasks & Site Visit Verification

#### 8.1 Get Assigned Tasks
- **Endpoint:** `GET /api/employee/tasks`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "task_501",
      "title": "Physical Site Survey & Dimension Verification",
      "customerName": "Tata Chemicals Ltd",
      "address": "Plot 12, Mithapur Industrial Estate, Gujarat",
      "dueDate": "2026-09-01",
      "priority": "URGENT",
      "status": "PENDING"
    }
  ]
}
```

#### 8.2 Update Task Status (Check-In & Completion Proof)
- **Endpoint:** `PATCH /api/employee/tasks/:id`
- **Request Body:**
```json
{
  "status": "COMPLETED",
  "checkInCoordinates": "23.0300, 72.5800",
  "completionPhotoUrl": "https://storage.360crm.com/tasks/proof_501.jpg",
  "remarks": "Site inspection completed. Pipeline diameter is 4 inches."
}
```

---

### Module 9: Instant Messaging (WhatsApp & SMS)

#### 9.1 Send WhatsApp Message to Client
- **Endpoint:** `POST /api/employee/messages`
- **Request Body:**
```json
{
  "leadId": "lead_101",
  "recipientPhone": "+919822011223",
  "channel": "WHATSAPP",
  "templateName": "product_catalog_share",
  "messageText": "Dear Rajesh ji, Please find our latest product catalog and technical specifications for SS Valves.",
  "attachmentUrl": "https://cdn.360crm.com/catalogs/valves_2026.pdf"
}
```

---

### Module 10: Customer Directory & 360 Dossier

#### 10.1 Get Customers List
- **Endpoint:** `GET /api/employee/customers?search=Shree`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "cust_201",
      "customerCode": "CUST-2026-0012",
      "name": "Shree Cement Infrastructure Corp",
      "companyName": "Shree Cement Infrastructure Corp",
      "phone": "+91 98220 11223",
      "email": "purchase@shreecement.com",
      "gstNumber": "24AAACS1234F1Z8",
      "outstandingBalance": 78159,
      "totalOrdersCount": 4
    }
  ]
}
```

---

### Module 11: Field Quotations & Orders Generator

#### 11.1 Create Quotation on Mobile
- **Endpoint:** `POST /api/employee/quotations`
- **Request Body:**
```json
{
  "customerId": "cust_201",
  "customerName": "Shree Cement Infrastructure Corp",
  "leadId": "lead_101",
  "items": [
    {
      "productId": "prod_1",
      "name": "SS-316 Flanged Ball Valve 2 Inch",
      "hsn": "84818030",
      "quantity": 50,
      "unit": "PCS",
      "unitPrice": 2500,
      "gstRate": 18,
      "discountPercent": 5
    }
  ],
  "paymentTerms": "30 Days Credit",
  "validUntil": "2026-09-30",
  "notes": "Prices inclusive of standard testing certificates."
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Quotation QT-2026-0042 created successfully.",
  "data": {
    "_id": "qt_2026_0042",
    "quotationNumber": "QT-2026-0042",
    "subTotal": 118750,
    "gstTotal": 21375,
    "grandTotal": 140125,
    "status": "DRAFT"
  }
}
```

---

### Module 12: Performance, KPIs & Incentives

#### 12.1 Get Employee Performance Metrics
- **Endpoint:** `GET /api/employee/performance`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "currentMonth": "September 2026",
    "totalCallsMade": 142,
    "totalLeadsHandled": 28,
    "dealsWon": 6,
    "salesValue": 840000,
    "target": 1000000,
    "targetAchievementPercent": 84,
    "calculatedIncentive": 25200,
    "companyRank": 2
  }
}
```

---

### Module 13: Leave Requests & Balance

#### 13.1 Apply for Leave
- **Endpoint:** `POST /api/employee/leave`
- **Request Body:**
```json
{
  "leaveType": "CASUAL",
  "startDate": "2026-09-10",
  "endDate": "2026-09-11",
  "totalDays": 2,
  "reason": "Family function"
}
```

#### 13.2 View Leave History & Balance
- **Endpoint:** `GET /api/employee/leave`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "balance": {
      "casualLeaveRemaining": 8,
      "sickLeaveRemaining": 6,
      "earnedLeaveRemaining": 12
    },
    "history": [
      {
        "_id": "lev_01",
        "leaveType": "CASUAL",
        "startDate": "2026-09-10",
        "endDate": "2026-09-11",
        "totalDays": 2,
        "reason": "Family function",
        "status": "APPROVED",
        "appliedAt": "2026-09-01T08:00:00.000Z"
      }
    ]
  }
}
```

---

### Module 14: Monthly Salary & Payslip PDF

#### 14.1 Get Salary Slips
- **Endpoint:** `GET /api/employee/salary`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "month": "August 2026",
      "basicSalary": 25000,
      "hra": 10000,
      "conveyance": 3000,
      "incentives": 12500,
      "grossPay": 50500,
      "pfDeduction": 1800,
      "esiDeduction": 350,
      "taxDeduction": 0,
      "netPay": 48350,
      "status": "PAID",
      "paidOn": "2026-09-01",
      "payslipPdfUrl": "/api/employee/salary/payslip-aug-2026.pdf"
    }
  ]
}
```

---

### Module 15: Push Notifications & Alerts

#### 15.1 Get Unread Notifications
- **Endpoint:** `GET /api/employee/notifications`

#### 15.2 Mark Notification as Read
- **Endpoint:** `PATCH /api/employee/notifications/:id/read`

---

## 6. TypeScript Interfaces & Data Models

```typescript
export interface EmployeeUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'SALES_EMPLOYEE' | 'STORE_EMPLOYEE' | 'ACCOUNTANT' | 'HR_EMPLOYEE';
  employeeId: string;
  department: string;
  designation: string;
}

export interface AttendancePunchPayload {
  latitude: number;
  longitude: number;
  address?: string;
  selfieImageBase64?: string;
  batteryLevel?: number;
  deviceInfo?: string;
}

export interface LocationPingPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  battery?: number;
  activity?: 'STILL' | 'WALKING' | 'IN_VEHICLE';
  timestamp: string;
}

export interface LeadItem {
  _id: string;
  leadCode: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  city?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedValue: number;
  source: string;
}

export interface QuotationLineItem {
  productId: string;
  name: string;
  hsn: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  gstRate: number;
  discountPercent?: number;
}
```

---

## 7. Recommended Mobile App Folder Structure (React Native / Flutter)

```
360crm_employee_mobile_app/
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios / Fetch HTTP client with JWT interceptor
│   │   ├── authApi.ts             # Login, profile
│   │   ├── attendanceApi.ts       # Clock-in, clock-out, break
│   │   ├── trackingApi.ts         # GPS pings & offline batch sync
│   │   ├── leadsApi.ts            # Leads CRUD & stage change
│   │   ├── callsApi.ts            # Call logging & audio uploads
│   │   ├── tasksApi.ts            # Field visits & verification
│   │   └── quotationsApi.ts       # Mobile quote generator
│   ├── services/
│   │   ├── backgroundLocation.ts  # Background GPS task worker
│   │   ├── offlineStorage.ts      # SQLite / WatermelonDB offline queue
│   │   ├── audioRecorder.ts       # Call recording service
│   │   └── notificationService.ts # FCM / APNS Push Notifications
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── Dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── Attendance/
│   │   │   ├── ClockInScreen.tsx   # Camera Selfie + GPS radius check
│   │   │   └── AttendanceHistoryScreen.tsx
│   │   ├── Leads/
│   │   │   ├── LeadsListScreen.tsx
│   │   │   ├── LeadDetailScreen.tsx
│   │   │   └── AddLeadScreen.tsx
│   │   ├── FollowUps/
│   │   │   └── FollowUpsCalendarScreen.tsx
│   │   ├── Tasks/
│   │   │   ├── TasksListScreen.tsx
│   │   │   └── TaskGeoCheckInScreen.tsx
│   │   ├── Quotations/
│   │   │   └── CreateQuotationScreen.tsx
│   │   ├── Leave/
│   │   │   └── ApplyLeaveScreen.tsx
│   │   └── Salary/
│   │       └── SalarySlipScreen.tsx
│   ├── components/
│   │   ├── LeadCard.tsx
│   │   ├── ShiftTimerWidget.tsx
│   │   └── CustomButton.tsx
│   └── navigation/
│       ├── RootNavigator.tsx
│       └── BottomTabNavigator.tsx
└── package.json
```

---

✅ **Document Ready**: Yeh file aapke mobile developer ko handover karne ke liye complete reference hai. Isme frontend ke sabhi flows, permission requirements aur backend ke **15 REST modules** ke exact Request/Response payloads documented hain.
