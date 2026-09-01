# 📱 360CRM Enterprise — Employee Pages, Sections & Features Specification

> **Document Version:** 2.1.0  
> **Target Audience:** UI/UX Designers, Mobile App Developers (Flutter / React Native), Frontend Engineers, Product Managers  
> **Backend Integration:** REST API on `http://127.0.0.1:5055/api` (Local) & `https://three60crm-shiv.onrender.com/api` (Live Cloud)  
> **Auth Scheme:** JWT Bearer Token (`Authorization: Bearer <TOKEN>`)

---

## 📑 Table of Contents
1. [Employee Workspace Overview & Navigation Architecture](#1-employee-workspace-overview--navigation-architecture)
2. [Detailed Page-by-Page Breakdown](#2-detailed-page-by-page-breakdown)
   - [Page 1: Main Employee Portal & Calling Desk (`emp_dashboard`)](#page-1-main-employee-portal--calling-desk-emp_dashboard)
     - [1.1 Live Shift Timer & Geo-Attendance Header](#11-live-shift-timer--geo-attendance-header)
     - [1.2 Tab 1 — My Leads & Calling Desk](#12-tab-1--my-leads--calling-desk)
     - [1.3 Tab 2 — Call Logs & Voice Recordings Player](#13-tab-2--call-logs--voice-recordings-player)
     - [1.4 Tab 3 — Follow-ups & Reminders Calendar](#14-tab-3--follow-ups--reminders-calendar)
     - [1.5 Tab 4 — Smart Attendance & Geo-Telemetry](#15-tab-4--smart-attendance--geo-telemetry)
   - [Page 2: My Customers Portfolio (`emp_customers`)](#page-2-my-customers-portfolio-emp_customers)
   - [Page 3: My Tasks & Field Kanban (`emp_tasks`)](#page-3-my-tasks--field-kanban-emp_tasks)
   - [Page 4: Quotations Generator (`emp_quotations`)](#page-4-quotations-generator-emp_quotations)
   - [Page 5: Sales Orders Tracker (`emp_orders`)](#page-5-sales-orders-tracker-emp_orders)
   - [Page 6: My Performance & Incentives Dashboard (`emp_performance`)](#page-6-my-performance--incentives-dashboard-emp_performance)
   - [Page 7: Leave Requests & Holiday Balance (`emp_leave`)](#page-7-leave-requests--holiday-balance-emp_leave)
   - [Page 8: My Salary & Payslip Slips (`emp_salary`)](#page-8-my-salary--payslip-slips-emp_salary)
   - [Page 9: My Profile & Emergency Contacts (`emp_profile`)](#page-9-my-profile--emergency-contacts-emp_profile)
   - [Page 10: Notifications & System Alerts (`emp_notifications`)](#page-10-notifications--system-alerts-emp_notifications)
3. [Page-to-API Mapping Matrix](#3-page-to-api-mapping-matrix)
4. [UI Component & State Management Guidelines](#4-ui-component--state-management-guidelines)

---

## 1. Employee Workspace Overview & Navigation Architecture

When an employee logs into 360CRM (`role: 'EMPLOYEE'`), their workspace is restricted to their assigned operational scope.

```
+-----------------------------------------------------------------------------------------------+
|                                  EMPLOYEE APP NAVIGATION                                      |
+-------------------+--------------------+--------------------+--------------------+------------+
| 1. Dashboard Desk | 2. My Customers    | 3. My Tasks        | 4. Quotations      | 5. Orders  |
| (Leads, Calls,    | (360 Portfolio,    | (Kanban, Checkin,  | (GST Quote Maker,  | (Sales &   |
|  Attendance)      |  Ledger Balances)  |  Photo Proofs)     |  PDF Generator)    |  Dispatch) |
+-------------------+--------------------+--------------------+--------------------+------------+
| 6. Performance    | 7. Leave Requests  | 8. Salary Slips    | 9. My Profile      | 10. Alerts |
| (Targets, Ranks,  | (CL/SL/EL Balances,| (Gross/Net Pay,    | (ID, Emergency,    | (Push      |
|  Incentives)      |  Apply Leave)      |  PDF Download)     |  Bank Details)     |  Alarms)   |
+-------------------+--------------------+--------------------+--------------------+------------+
```

---

## 2. Detailed Page-by-Page Breakdown

---

### Page 1: Main Employee Portal & Calling Desk (`emp_dashboard`)
- **Component File:** `360crm_admin/pages/EmployeePortalView.tsx`
- **Default View:** Yes (Opens automatically upon login)

#### 1.1 Live Shift Timer & Geo-Attendance Header
- **Widgets & Visual Indicators:**
  - **Live Stopwatch Counter:** Real-time clock showing active shift duration (`HH:MM:SS`).
  - **Status Pill:** `PRESENT` (Green), `CLOCKED_OUT` (Gray), `ON_BREAK` (Amber), `ON_LEAVE` (Purple).
  - **Telemetry Badge:** "Live GPS Tracker Connected" (Flashing Green dot).
- **Interactive Action Buttons:**
  - 🟢 **Clock-In Button:** Opens camera for live selfie verification and captures GPS coordinates (Lat, Lng).
  - 🔴 **Clock-Out Button:** Prompts daily summary notes submission and ends shift.
  - ☕ **Tea Break (15m) Button:** Pauses shift timer and records break duration.
  - 🍱 **Lunch Break (45m) Button:** Records lunch break start/end.

---

#### 1.2 Tab 1 — My Leads & Calling Desk
- **Purpose:** Primary telecalling and sales conversion interface for inbound/assigned inquiries.
- **Top KPI Cards:**
  - `Assigned Leads`: Total count of active inquiries.
  - `Calls Today`: Number of calls dialed today.
  - `Converted`: Number of deals marked `WON`.
  - `Follow-ups`: Scheduled calls remaining for today.
- **Leads Interactive Table / List View:**
  - **Columns / Card Data:**
    - Lead Code (`LD-2026-0045`) & Lead Name.
    - Company Name & City (`Ahmedabad, Gujarat`).
    - Requirement summary (*e.g., "50x SS Valves"*).
    - Source (*TradeIndia, IndiaMART, Website, Field Visit*).
    - Stage Badge (`NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL`, `NEGOTIATION`, `WON`, `LOST`).
  - **Action Buttons per Lead:**
    - 📞 **Dial Call:** Triggers native phone dialer or VoIP caller.
    - 💬 **WhatsApp Quick-Send:** 1-click product catalog or brochure share.
    - 🔄 **Update Status:** Dropdown to advance lead in pipeline.
    - 📝 **Call Logging Modal:**
      - Call Duration timer.
      - Outcome Selector (*Interested, Call Back Later, Wrong Number, Deal Closed, Not Reachable*).
      - Audio Note Mic Recorder (records voice remarks).
      - Next Follow-up Date/Time picker.

---

#### 1.3 Tab 2 — Call Logs & Voice Recordings Player
- **Purpose:** Audit and review historical calling activity.
- **Sections & Elements:**
  - **Filter Controls:** Filter by Date range, Call Direction (*Outbound, Inbound*), and Outcome.
  - **Call History Table:**
    - Timestamp (*e.g., 01 Sep 2026, 11:30 AM*).
    - Client Name & Phone Number.
    - Call Duration (*e.g., 3m 45s*).
    - Outcome Badge.
    - **In-Browser Audio Player:** Play, Pause, Seek bar, Volume slider for recorded call audio.

---

#### 1.4 Tab 3 — Follow-ups & Reminders Calendar
- **Purpose:** Schedule and manage client discovery meetings, site visits, and callbacks.
- **Sections & Elements:**
  - **Today's Agenda:** List of high-priority meetings scheduled for the current date.
  - **Calendar View:** Monthly date picker showing dots on dates with pending meetings.
  - **Follow-up Item Card:**
    - Client Name & Company.
    - Meeting Type (*Call, In-Person Site Visit, Commercial Negotiation*).
    - Scheduled Time & Priority (*Urgent, High, Normal*).
    - Actions: `Mark Done`, `Reschedule`, `Call Now`.

---

#### 1.5 Tab 4 — Smart Attendance & Geo-Telemetry
- **Purpose:** View punch logs and track daily attendance.
- **Sections & Elements:**
  - **Today's Punch Summary:** Punch-in time, punch-out time, total work hours, lunch duration.
  - **Monthly Attendance Grid:** Calendar view showing all days of the month colored by status:
    - 🟢 Green: Present (Full Day >= 8h).
    - 🟡 Yellow: Half Day / Late In.
    - 🔴 Red: Absent.
    - 🟣 Purple: Approved Leave.
  - **Geo-Location Snapshot:** Shows Google Maps pin of where the employee punched in.

---

### Page 2: My Customers Portfolio (`emp_customers`)
- **Component File:** `360crm_admin/pages/EmployeeCustomersView.tsx`

#### Sections & Features:
1. **Portfolio KPI Header:**
   - `Total Customers`: Assigned client accounts.
   - `Active Accounts`: Companies with transactions in last 90 days.
   - `Outstanding Balance`: Total payment due from clients in employee's portfolio.
2. **Search & Filter Bar:**
   - Real-time instant search by Company Name, Contact Person, Phone, or City.
3. **Customers Directory Table:**
   - Customer Code (`CUST-2026-0012`).
   - Company Name & Contact Person.
   - Phone & Email.
   - GSTIN Number.
   - City & State.
   - Current Ledger Balance (₹).
4. **Customer 360 Slide-Out Drawer:**
   - Clicking a customer row opens a complete dossier:
     - Company overview & credit limit.
     - Past orders & Quotation history.
     - Payment receipts & Outstanding ledger statement.
5. **Add Customer Modal (`+ Add Customer`):**
   - Form fields: Full Name, Company Name, Mobile Number, Email, GST Number, Street Address, City, State.

---

### Page 3: My Tasks & Field Kanban (`emp_tasks`)
- **Component File:** `360crm_admin/pages/EmployeeTasksView.tsx`

#### Sections & Features:
1. **Task Metrics Strip:**
   - `Today's Tasks`, `Pending / To Do`, `In Progress`, `Completed`.
2. **Interactive 4-Column Kanban Board:**
   - Columns: `TO DO` | `IN PROGRESS` | `REVIEW` | `COMPLETED`.
   - **Task Card Details:**
     - Title & Description.
     - Priority Tag (*Urgent, High, Medium, Low*).
     - Due Date (*e.g., 01 Sep 2026*).
     - Site Address & Customer link.
     - Status transition action buttons.
3. **Field Visit Geo Check-In Feature:**
   - On-field verification for physical site surveys:
     - GPS Check-in coordinates validation.
     - Camera upload for Site Survey proof photo.
4. **Create Task Modal (`+ Create Task`):**
   - Title, Description, Priority selector, Due Date picker.

---

### Page 4: Quotations Generator (`emp_quotations`)
- **Component File:** `360crm_admin/pages/EmployeeQuotationsView.tsx`

#### Sections & Features:
1. **Quotes KPI Cards:**
   - Total Quotes Created, Pending Client Approval, Accepted / Won, Total Pipeline Value (₹).
2. **Quotations Table:**
   - Quotation Number (`QT-2026-0042`).
   - Customer / Company Name.
   - Quotation Date & Expiry Date.
   - Subtotal, GST Total (18%), Grand Total (₹).
   - Status Badge (`DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`).
3. **On-Field Quotation Builder Modal (`+ New Quotation`):**
   - Customer selector dropdown.
   - Multi-Item Line Table:
     - Product Name / Catalog Search.
     - HSN Code.
     - Quantity & Unit (*PCS, BOX, MTR*).
     - Unit Price (₹) & Discount (%).
     - GST Tax Rate (*5%, 12%, 18%, 28%*).
     - Auto-calculated item total.
   - Payment Terms (*e.g., "30 Days Credit"*).
   - Validity Date.
   - Real-time Subtotal, Tax Breakdown, and Grand Total.
   - Instant PDF Preview & WhatsApp share.

---

### Page 5: Sales Orders Tracker (`emp_orders`)
- **Component File:** `360crm_admin/pages/EmployeeSalesOrdersView.tsx`

#### Sections & Features:
1. **Orders Pipeline Summary:**
   - Total Converted Orders, Revenue Generated (₹), Pending Dispatch, Completed Orders.
2. **Sales Orders List Table:**
   - Order Number (`SO-2026-0089`).
   - Customer Name & Linked Quotation ID.
   - Order Date.
   - Line Items count & Grand Total (₹).
   - Fulfillment Status (`PROCESSING`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
   - Payment Settlement Status (`PAID`, `PARTIAL`, `UNPAID`).

---

### Page 6: My Performance & Incentives Dashboard (`emp_performance`)
- **Component File:** `360crm_admin/pages/EmployeePerformanceView.tsx`

#### Sections & Features:
1. **Monthly Target vs Achievement Card:**
   - Monthly Assigned Target (₹ e.g. ₹10,00,000).
   - Total Revenue Achieved (₹ e.g. ₹8,40,000).
   - Animated Percentage Bar (**84% Achieved**).
2. **Commission & Incentive Calculator:**
   - Calculated Commission (₹ e.g. ₹25,200).
   - Incentive tier status (*Silver, Gold, Platinum Club*).
3. **Calling & Conversion Analytics:**
   - Total Calls Dialed (142 calls).
   - Average Call Duration (2m 15s).
   - Lead Conversion Rate (21.4%).
4. **Leaderboard Rank Widget:**
   - Company sales rank (*Rank #2 in Sales Division*).

---

### Page 7: Leave Requests & Holiday Balance (`emp_leave`)
- **Component File:** `360crm_admin/pages/EmployeeLeaveView.tsx`

#### Sections & Features:
1. **Leave Balances Grid (3 Metric Cards):**
   - 🌴 **Casual Leave (CL):** Remaining balance (e.g. 8 days).
   - 🩺 **Sick Leave (SL):** Remaining balance (e.g. 6 days).
   - 🏖️ **Earned Leave (EL):** Remaining balance (e.g. 12 days).
2. **Apply for Leave Modal (`+ Apply Leave`):**
   - Leave Type selector (*Casual Leave, Sick Leave, Emergency Leave*).
   - Start Date & End Date pickers (Auto-calculates total business days).
   - Reason for Leave textarea.
3. **Leave Applications History Table:**
   - Applied Date.
   - Leave Category.
   - Date Range & Total Days.
   - Approval Status Badge:
     - 🟡 `PENDING` (Under HR Review).
     - 🟢 `APPROVED` (Approved by Manager).
     - 🔴 `REJECTED` (with rejection remarks).
   - Action: Cancel request (if still pending).

---

### Page 8: My Salary & Payslip Slips (`emp_salary`)
- **Component File:** `360crm_admin/pages/EmployeeSalaryView.tsx`

#### Sections & Features:
1. **Latest Month Salary Structure Card:**
   - **Earnings Breakdown:**
     - Basic Salary (₹)
     - House Rent Allowance - HRA (₹)
     - Conveyance & Travel Allowance (₹)
     - Performance Incentive / Bonus (₹)
     - **Gross Salary (₹)**
   - **Deductions Breakdown:**
     - Provident Fund - PF (₹)
     - Employee State Insurance - ESI (₹)
     - Professional Tax - PT (₹)
     - **Total Deductions (₹)**
   - **Net Take-Home Pay (In-Hand) (₹)**
2. **Historical Payslips Table:**
   - Month & Year (*e.g., August 2026*).
   - Gross Amount & Net Payout.
   - Payment Status (`PAID`).
   - Payment Date (*01 Sep 2026*).
   - **Action:** 📄 **"Download PDF Payslip"** button.

---

### Page 9: My Profile & Emergency Contacts (`emp_profile`)
- **Component File:** `360crm_admin/pages/EmployeeProfileView.tsx`

#### Sections & Features:
1. **Profile Identity Card:**
   - Avatar / Initials badge (`AS`).
   - Full Name, Employee ID (`EMP-007`), Role (`Senior Field Representative`).
   - Official Email & Mobile Number.
2. **Employment Details Section:**
   - Department (`Sales & Field Desk`).
   - Date of Joining (`01 April 2025`).
   - Reporting Manager Name.
   - Work Shift Timings (`09:30 AM - 06:30 PM`).
3. **Bank & Payroll Info:**
   - Bank Name, Account Number (Masked `XXXX1234`), IFSC Code, PAN Card Number.
4. **Emergency Contact Card:**
   - Emergency contact person name, relationship, and 24/7 phone number.

---

### Page 10: Notifications & System Alerts (`emp_notifications`)
- **Component File:** `360crm_admin/pages/EmployeeNotificationsView.tsx`

#### Sections & Features:
1. **Notification Feed Stream:**
   - 🎯 **Lead Alerts:** *"New TradeIndia Buy Lead assigned: Shree Cement"*.
   - ⏰ **Follow-up Reminders:** *"Call scheduled with Rajesh Sharma in 15 minutes"*.
   - 🏖️ **HR Alerts:** *"Your leave request for 10-11 Sep has been Approved"*.
   - 💰 **Payroll Alerts:** *"Salary slip for August 2026 is now available for download"*.
2. **Interactive Controls:**
   - Filter by `All`, `Unread`, `System`.
   - 1-Click "Mark as Read" per item.
   - "Mark All as Read" header button.

---

## 3. Page-to-API Mapping Matrix

| Page / Screen | Frontend View ID | Backend REST API Endpoint | HTTP Method |
|---|---|---|---|
| **Dashboard** | `emp_dashboard` | `/api/employee/dashboard` | `GET` |
| **Clock-In** | `emp_attendance` | `/api/employee/attendance/clock-in` | `POST` |
| **Clock-Out** | `emp_attendance` | `/api/employee/attendance/clock-out` | `POST` |
| **Break Toggle** | `emp_attendance` | `/api/employee/attendance/break` | `POST` |
| **Leads List** | `emp_leads` | `/api/employee/leads` | `GET` |
| **Create Lead** | `emp_leads` | `/api/employee/leads` | `POST` |
| **Update Lead Stage** | `emp_leads` | `/api/employee/leads/:id/status` | `PUT` |
| **Log Call** | `emp_calls` | `/api/employee/calls` | `POST` |
| **Call Recordings** | `emp_calls` | `/api/employee/calls` | `GET` |
| **Follow-ups** | `emp_followups` | `/api/employee/follow-ups` | `GET`, `POST` |
| **My Customers** | `emp_customers` | `/api/employee/customers` | `GET`, `POST` |
| **My Tasks** | `emp_tasks` | `/api/employee/tasks` | `GET`, `POST`, `PATCH` |
| **Quotations** | `emp_quotations` | `/api/employee/quotations` | `GET`, `POST` |
| **Sales Orders** | `emp_orders` | `/api/employee/sales-orders` | `GET` |
| **Performance** | `emp_performance` | `/api/employee/performance` | `GET` |
| **Leave Management** | `emp_leave` | `/api/employee/leave` | `GET`, `POST`, `DELETE` |
| **Salary Slips** | `emp_salary` | `/api/employee/salary` | `GET` |
| **Profile** | `emp_profile` | `/api/employee/profile` | `GET`, `PUT` |
| **Notifications** | `emp_notifications` | `/api/employee/notifications` | `GET`, `PATCH` |
| **GPS Telemetry** | Background | `/api/employee-tracking/location` | `POST` |

---

## 4. UI Component & State Management Guidelines

1. **State Persistence**:
   - Save JWT Token in secure storage (`AsyncStorage` on React Native, `flutter_secure_storage` on Flutter, `localStorage` on Web).
   - Cache offline lead drafts and GPS location telemetry in local SQLite queue if device is offline.
2. **Media & Sensor Access**:
   - **Selfie Punch-in**: Prompt camera preview with circle overlay for facial recognition selfie.
   - **GPS Coordinates**: Request High-Accuracy location provider (`accuracy <= 15m`).
3. **Background Location Tasks**:
   - Run a foreground service on Android with a persistent notification while clocked in.
   - Automatically pause GPS telemetry when employee triggers **Clock-Out**.
