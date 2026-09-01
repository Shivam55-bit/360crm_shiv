# 🚀 360CRM Enterprise Platform — Click-by-Click Ultimate Testing & Workflow Guide

> **Live System URLs:**
> - 🌐 **Frontend Application**: [http://localhost:5180](http://localhost:5180) *(Browser me kholein)*
> - ⚙️ **Backend REST API**: [http://localhost:5000](http://localhost:5000)
> - 🩺 **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📑 Index / Sections Directory

1. [🔑 1. Login Screen & Role Switcher](#-1-login-screen--role-switcher)
2. [💼 2. Sales & CRM (Lead to Cash Pipeline)](#-2-sales--crm-lead-to-cash-pipeline)
   - [2.1 Leads Pipeline (Add, Assign, Status Update)](#21-leads-pipeline-add-assign-status-update)
   - [2.2 Customer Accounts & 360° Dossier](#22-customer-accounts--360-dossier)
   - [2.3 Quotations (GST + Discount Calculator & Print)](#23-quotations-gst--discount-calculator--print)
   - [2.4 Sales Orders (Conversion & Fulfillment)](#24-sales-orders-conversion--fulfillment)
   - [2.5 Follow-ups & Calling Desk](#25-follow-ups--calling-desk)
3. [📢 3. Marketing & Lead Acquisition Channels](#-3-marketing--lead-acquisition-channels)
   - [3.1 Marketing Campaigns & ROI Tracker](#31-marketing-campaigns--roi-tracker)
   - [3.2 TradeIndia Live Inquiries Sync](#32-tradeindia-live-inquiries-sync)
   - [3.3 WhatsApp Automation & Broadcast Templates](#33-whatsapp-automation--broadcast-templates)
4. [📦 4. Store & Inventory Management](#-4-store--inventory-management)
   - [4.1 Products Master & Barcodes](#41-products-master--barcodes)
   - [4.2 Live Inventory & Warehouse Reorder Alerts](#42-live-inventory--warehouse-reorder-alerts)
   - [4.3 Stock In (GRN Inward Receipts)](#43-stock-in-grn-inward-receipts)
   - [4.4 Stock Out (Outward Issuance & Sales Dispatch)](#44-stock-out-outward-issuance--sales-dispatch)
   - [4.5 Purchase Orders & Supplier Receive](#45-purchase-orders--supplier-receive)
   - [4.6 Suppliers / Vendors Master](#46-suppliers--vendors-master)
5. [💰 5. Accounts & Finance (Billing, Ledger & Taxes)](#-5-accounts--finance-billing-ledger--taxes)
   - [5.1 Tax Invoices & PDF Print Modal](#51-tax-invoices--pdf-print-modal)
   - [5.2 Payments Receipt & Invoices Settlement](#52-payments-receipt--invoices-settlement)
   - [5.3 Accounts Receivables (Debtors Aging)](#53-accounts-receivables-debtors-aging)
   - [5.4 Accounts Payables (Creditors)](#54-accounts-payables-creditors)
   - [5.5 Operational Expenses Logging](#55-operational-expenses-logging)
   - [5.6 Credit Notes Management](#56-credit-notes-management)
6. [👥 6. People & HR (Attendance, Desktop Telemetry & Payroll)](#-6-people--hr-attendance-desktop-telemetry--payroll)
   - [6.1 Employee Master Onboarding](#61-employee-master-onboarding)
   - [6.2 Attendance, Selfie Verification & Screen Time Monitoring](#62-attendance-selfie-verification--screen-time-monitoring)
   - [6.3 Leave Requests & Approval Flow](#63-leave-requests--approval-flow)
   - [6.4 Monthly Salary & Pay Slip Generation](#64-monthly-salary--pay-slip-generation)
7. [🛰️ 7. Live Workforce GPS Tracking & Geofencing](#️-7-live-workforce-gps-tracking--geofencing)
8. [📱 8. Dedicated Employee Field & Calling Desk Portal](#-8-dedicated-employee-field--calling-desk-portal)
9. [🛡️ 9. Super Admin Portal (RBAC Roles, Users & System Logs)](#️-9-super-admin-portal-rbac-roles-users--system-logs)

---

## 🔑 1. Login Screen & Role Switcher

Browser me **[http://localhost:5180](http://localhost:5180)** kholein.

### 🧪 Test Steps:
1. **1-Click Quick Demo Login**: Screen par demo cards dikhenge (`Admin`, `Super Admin`, `Sales Executive`, `Store / Inventory`, `Accounts / Finance`, `HR / People`, `Field Employee`).
2. Kisi bhi card par click karein (e.g. **Admin**), Email aur Password automatic fill ho jayenge (`admin@360crm.com` / `admin123`).
3. **"Sign In to 360CRM"** button par click karein.
4. **Expected Result**: Dashboard open ho jayega aur top-right me active organization *"SHIV SHAKTI ERP / CRM"* dikhega.

---

## 💼 2. Sales & CRM (Lead to Cash Pipeline)

---

### 2.1 Leads Pipeline (Add, Assign, Status Update)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **"Sales"** dropdown par click karein ➔ **"Leads"** par click karein.
2. Top-Right me **"+ Add New Lead"** button par click karein.

#### 📝 Form me Kya Likhna Hai (Test Data):
- **Full Name \***: `Rajesh Agarwal`
- **Company / Entity Name**: `Agarwal Precision Tools Pvt Ltd`
- **Phone Number \***: `9825012345`
- **Email Address**: `rajesh@agarwaltools.com`
- **Lead Source**: Dropdown se select karein `TradeIndia` ya `Website`
- **Pipeline Status**: Dropdown se select karein `NEW`
- **Priority**: Select `HIGH`
- **Estimated Deal Value (₹)**: `350000`
- **City & State**: City: `Ahmedabad`, State: `Gujarat`
- **Tags**: `High Budget, Hot Lead`
- **Lead Notes**: `Requirement for 15 Units CNC Tool Holders and 2 Ultrasonic Cutters.`

#### 🎯 Submit & Verification:
1. **"Save Lead"** button dabayein.
2. Table me top par `Rajesh Agarwal` ka record aa jayega with green `New` arrival tag.
3. Row ke right side me **Assign Icon (User with checkmark)** par click karein:
   - Select Sales Representative: `Vikram Mehta (Sales)`.
   - Handover Notes: `Urgent requirement. Please call today.`
   - Click **"Confirm Assignment"**.
4. Row me **Eye Icon** par click karke 360° Lead Drawer dekhein aur **"Convert to Customer"** par click karein.

---

### 2.2 Customer Accounts & 360° Dossier

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Sales ➔ Customers** par click karein.
2. Top-Right me **"+ Add Customer"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Contact Name \***: `Suresh Patel`
- **Company / Entity Name \***: `Patel Heavy Engineering Works`
- **Phone Number \***: `9879509876`
- **Email Address**: `suresh@patelheavyeng.com`
- **GSTIN Number**: `24ABCDE1234F1Z5`
- **Credit Limit (₹)**: `1000000`
- **Payment Terms**: `Net 30 Days`

#### 🎯 Submit & Verification:
1. **"Save Customer"** button dabayein.
2. Customer table me `Patel Heavy Engineering Works` dikhega.
3. Row me **Eye Icon** dabayein ➔ Customer ka complete financial summary, linked Sales Orders aur Invoices ka historical ledger open hoga.

---

### 2.3 Quotations (GST + Discount Calculator & Print)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Sales ➔ Quotations** par click karein.
2. Top-Right me **"+ Create Quotation"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Customer Dropdown**: Select karein `Patel Heavy Engineering Works` ya `Shiv Shakti Traders`.
- **Line Item 1**:
  - Product Name: `TMT Steel Rebars Fe550D (12mm)`
  - Quantity: `10`
  - Unit Price (₹): `55000`
  - Tax (GST %): `18`
  - Discount %: `5`
- **"+ Add Another Product"** par click karein:
  - Product Name: `Mild Steel Structural Angle (50x50x6mm)`
  - Quantity: `5`
  - Unit Price (₹): `62000`
  - Tax (GST %): `18`
- **Shipping Charges (₹)**: `3500`
- **Terms & Conditions**: `Payment 100% against delivery. Validity: 15 days.`

#### 🎯 Submit & Verification:
1. Click **"Generate Quotation"** ➔ Success alert aayega.
2. Quotations table me new quote `QT-2026-XXXX` create ho jayegi.
3. Row me **"Approve Quotation"** button dabayein ➔ Status `APPROVED` ho jayega.
4. **"Convert to Sales Order"** button dabayein ➔ 1-Click me Sales Order ban jayega!
5. **Print / PDF Icon** dabayein ➔ Professional GST Quotation modal khulega, **"Download PDF"** ya **"Print"** test karein.

---

### 2.4 Sales Orders (Conversion & Fulfillment)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Sales ➔ Sales Orders** par click karein.

#### 🧪 Test Steps:
1. Converted Sales Order row me status dropdown dekhein (`PENDING`, `CONFIRMED`, `PROCESSING`, `DISPATCHED`, `DELIVERED`).
2. Status ko **`CONFIRMED`** karein.
3. Row me **"Create Tax Invoice"** button par click karein ➔ Ye direct Accounts department me official Tax Invoice generate kar dega!

---

### 2.5 Follow-ups & Calling Desk

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Sales ➔ Follow-ups** par click karein.
2. Top-Right me **"+ Schedule Follow-up"** par click karein.

#### 📝 Form me Kya Likhna Hai:
- **Lead / Customer**: Select `Rajesh Agarwal`.
- **Activity Title**: `Catalog Discussion & Final Pricing Call`
- **Interaction Type**: Select `Phone Call` (options: `WhatsApp`, `Meeting`, `Email`).
- **Date & Time**: Tomorrow's date select karein (e.g. `2026-09-01 11:00 AM`).
- **Discussion Agenda**: `Discuss 5% special discount on bulk order.`
- Click **"Confirm Schedule"**.

---

## 📢 3. Marketing & Lead Acquisition Channels

---

### 3.1 Marketing Campaigns & ROI Tracker

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Marketing ➔ Campaigns** par click karein.
2. **"+ Create Campaign"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Campaign Name**: `Industrial Expo Gujarat 2026`
- **Channel**: Select `WhatsApp Broadcast` (options: `Email`, `SMS`, `Social Media`).
- **Target Audience**: `B2B Machinery Buyers`
- **Budget Allocated (₹)**: `45000`
- **Start Date & End Date**: Current month dates select karein.
- Click **"Launch Campaign"**.

---

### 3.2 TradeIndia Live Inquiries Sync

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Marketing ➔ TradeIndia** par click karein.

#### 🧪 Test Steps:
1. Top-Right me **"Sync TradeIndia Inquiries"** button dabayein ➔ Live B2B inquiries fetch hongi.
2. Kisi inquiry row me **"Convert to Lead"** button dabayein.
3. Lead automatic Sales section me transfer ho jayegi aur duplicate inquiry alert dikhayegi.

---

### 3.3 WhatsApp Automation & Broadcast Templates

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Marketing ➔ WhatsApp** par click karein.

#### 🧪 Test Steps:
1. Ready-made templates dekhein:
   - *Quotation Sent Notification*
   - *Payment Reminder Alert*
   - *Order Dispatch & Tracking UTR*
2. **"Send Test WhatsApp"** button dabayein ➔ Recipient number `9825012345` dalein aur message send karein.

---

## 📦 4. Store & Inventory Management

---

### 4.1 Products Master & Barcodes

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Store / Inventory ➔ Products** par click karein.
2. Top-Right me **"+ Add Product"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Product Name \***: `Ultrasonic Plastic Welder 20kHz Digital`
- **SKU Code \***: `UPW-20KHZ-PRO`
- **Category**: `Industrial Automation`
- **Unit of Measure**: `Units` (ya `Pcs`, `Kgs`)
- **GST Tax %**: `18`
- **Purchase / Cost Price (₹)**: `75000`
- **Selling Price (₹)**: `120000`
- **Opening Stock**: `15`
- **Min Stock Alert Threshold**: `5`
- Click **"Save Product"**.

---

### 4.2 Live Inventory & Warehouse Reorder Alerts

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Store / Inventory ➔ Inventory** par click karein.

#### 🧪 Test Steps:
1. Table me har product ka **Available Stock**, **Min Stock Alert**, **Stock Valuation (₹)** aur **Stock Health** badge (`IN_STOCK` vs `LOW_STOCK`) check karein.
2. Top par **"Export CSV"** button dabakar stock sheet download test karein.

---

### 4.3 Stock In (GRN Inward Receipts)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Store / Inventory ➔ Stock In** par click karein.

#### 📝 Form me Kya Likhna Hai:
- **Select Product \***: Choose `Ultrasonic Plastic Welder 20kHz Digital`.
- **Quantity to Inflow \***: `10`
- **Supplier (Optional)**: Select `National Steel & Alloys Corp`.
- **Reason / Reference Notes**: `PO-2026-889 inward shipment received at Main Delhi Warehouse`.
- Click **"Confirm Inward Stock"**.

#### 🎯 Verification:
- Success alert aayega aur right side ke table me `+10 Units` entry add ho jayegi aur total stock badh kar `25 Units` ho jayega!

---

### 4.4 Stock Out (Outward Issuance & Sales Dispatch)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Store / Inventory ➔ Stock Out** par click karein.

#### 📝 Form me Kya Likhna Hai:
- **Select Product \***: Choose `Ultrasonic Plastic Welder 20kHz Digital` *(Available: 25 Units dikhega)*.
- **Quantity to Issue \***: `4` *(Agar 30 daleinge to validation error aayega!)*.
- **Issuance Purpose**: Select `Sales Dispatch` (options: `Production Workshop`, `Manual`, `Damage Write-off`).
- **Reason / Job Order #**: `Dispatch for Sales Order SO-2026-104 via SafeXpress Truck # GJ-01-AB-1234`.
- Click **"Authorize Stock Out"**.

#### 🎯 Verification:
- Stock automatic `-4 Units` deduct hokar remaining stock `21 Units` ho jayega!

---

### 4.5 Purchase Orders & Supplier Receive

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Store / Inventory ➔ Purchase** par click karein.

#### 🧪 Test Steps:
1. Purchase Order row dekhein jiska status `ORDERED` hai.
2. Row me **"Receive into Stock"** button par click karein.
3. Confirm alert me **"OK"** dabayein ➔ Purchase Order status `RECEIVED` ho jayega aur uske saare items ka inventory count auto-increase ho jayega!

---

### 4.6 Suppliers / Vendors Master

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Store / Inventory ➔ Suppliers** par click karein.
2. Vendors ka contact, credit period aur outstanding payables balance verify karein.

---

## 💰 5. Accounts & Finance (Billing, Ledger & Taxes)

---

### 5.1 Tax Invoices & PDF Print Modal

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Accounts & Finance ➔ Invoices** par click karein.
2. **"+ Generate Invoice"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Select Customer \***: Select `Patel Heavy Engineering Works`.
- **Payment Due Date**: Select 30 days from today (e.g. `2026-09-30`).
- Click **"Issue Invoice"**.

#### 🎯 Verification & PDF Print:
1. Invoices table me new invoice `INV-2026-XXXX` create ho jayegi with status `UNPAID`.
2. Row me **"Print / PDF"** button par click karein.
3. **Tax Invoice Modal** open hoga jisme:
   - Company Logo & GSTIN
   - Bill To & Ship To Details
   - Line Items with HSN/SAC Code, CGST (9%), SGST (9%), Grand Total in words
   - Bank Details (ICICI Bank, IFSC, Account Number)
   - Click **"Download PDF"** ya **"Print Invoice"** button.

---

### 5.2 Payments Receipt & Invoices Settlement

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Accounts & Finance ➔ Payments** par click karein.
2. **"+ Record Payment"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Select Outstanding Invoice \***: Choose `INV-2026-XXXX - Patel Heavy Engineering Works (Due: ₹1,50,000)`.
- **Payment Amount (₹) \***: `75000` *(Partial settlement test karne ke liye)*.
- **Payment Method**: Select `Bank Transfer (NEFT/RTGS)` (options: `UPI`, `Cheque`, `Cash`).
- **UTR / Cheque Ref #**: `UTR992837461524`
- **Payment Date**: Today's date.
- Click **"Confirm Receipt"**.

#### 🎯 Verification:
1. Payments table me `₹75,000` entry log ho jayegi.
2. **Invoices** view me jakar check karein: Us invoice ka Paid Amount `₹75,000` aur Balance Due `₹75,000` ho gaya hoga with status `PARTIALLY_PAID`!

---

### 5.3 Accounts Receivables (Debtors Aging)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Accounts & Finance ➔ Receivables** par click karein.
2. **Total Outstanding Invoiced Receivables** card dekhein.
3. Customer-wise pending invoice count aur total overdue amount ledger verify karein.

---

### 5.4 Accounts Payables (Creditors)

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Accounts & Finance ➔ Payables** par click karein.
2. Suppliers ke pending purchase bills, paid amounts aur balance payable aging verify karein.

---

### 5.5 Operational Expenses Logging

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Accounts & Finance ➔ Expenses** par click karein.
2. **"+ Log Expense"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Expense Title / Particulars \***: `Factory High Tension Electricity Bill - Aug 2026`
- **Expense Category**: Select `Rent & Utilities` (options: `Logistics & Transport`, `Operations`, `Marketing`, `Salaries & Perks`).
- **Payment Method**: `Bank Transfer`
- **Amount (₹) \***: `42500`
- **Vendor / Payee**: `Torrent Power Corporation Ltd`
- **Brief Description**: `Monthly industrial meter billing payment`.
- Click **"Approve & Log Expense"**.

---

### 5.6 Credit Notes Management

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **Accounts & Finance ➔ Credit Notes** par click karein.
2. Damaged material return ya price adjustment ke credit notes log karein.

---

## 👥 6. People & HR (Attendance, Desktop Telemetry & Payroll)

---

### 6.1 Employee Master Onboarding

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **People & HR ➔ Employees** par click karein.
2. **"+ Onboard Employee"** button dabayein.

#### 📝 Form me Kya Likhna Hai:
- **Full Name \***: `Ananya Verma`
- **Email Address \***: `ananya.sales@360crm.com`
- **Password \***: `employee123` *(Field portal login ke liye)*
- **Designation \***: `Senior Sales Executive`
- **Phone**: `9811223344`
- **Department**: Select `Sales` (options: `Store / Warehouse`, `Accounts`, `HR & Admin`, `Marketing`)
- **Monthly Base Salary (₹)**: `45000`
- Click **"Save Employee"**.

---

### 6.2 Attendance, Selfie Verification & Screen Time Monitoring

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **People & HR ➔ Attendance** par click karein.

#### 🧪 Test Steps:
1. Top KPI cards dekhein:
   - *Total Clocked In*
   - *On Shift Break*
   - *Total Screen Time Hours*
   - *Avg Active Ratio %*
2. Table me har employee ka:
   - **Real-Time Status**: `WORKING` (green pulse) ya `ON_BREAK` (coffee icon).
   - **In-Time & Selfie**: Camera thumbnail par click karke geo-tagged selfie preview dekhein!
   - **Active Screen Time vs Idle Time**: Desktop tracker telemetry hours verify karein.
3. Row me **"View Activity"** button dabayein:
   - Employee ka **Desktop Application Timeline** modal khulega jisme Chrome, Excel, ERP window usage breakdown dikhega.
4. **"Download Report"** button dabakar PDF/Excel export test karein.

---

### 6.3 Leave Requests & Approval Flow

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **People & HR ➔ Leave Requests** par click karein.

#### 🧪 Test Steps:
1. Employees ki pending leave applications dekhein (Sick Leave, Casual Leave, Paid Leave).
2. Row me **"Approve"** (Green Check) ya **"Reject"** (Red Cross) button dabayein.
3. Status immediate update hoga aur employee ka annual balance deduct ho jayega.

---

### 6.4 Monthly Salary & Pay Slip Generation

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **People & HR ➔ Salary** par click karein.

#### 🧪 Test Steps:
1. Month select karein (e.g. `August 2026`).
2. **"Generate Payroll"** par click karein:
   - Basic + HRA + Allowances auto-calculate hongi.
   - PF + ESI + Unpaid Leaves deduction auto-calculate hoga.
3. Row me **"Download Pay Slip"** button par click karke PDF salary voucher check karein.

---

## 🛰️ 7. Live Workforce GPS Tracking & Geofencing

#### 📍 Kahan Click Karna Hai:
1. Left Sidebar me **People & HR ➔ Live Tracking** par click karein.

#### 🧪 Test Steps:
1. **Interactive Map View**:
   - Field sales team ke real-time GPS markers render honge (green = moving/active, blue = checked-in at client site).
   - Markers par click karke employee ka current speed, battery % aur last pinged address dekhein.
2. **Route Playback**:
   - Kisi employee ko select karke **"Play Route History"** par click karein ➔ Subah se lekar shaam tak ka travel path animate hoga.
3. **Geofence Check**:
   - Client office perimeter geofence validation verify karein.

---

## 📱 8. Dedicated Employee Field & Calling Desk Portal

Field executives aur telecallers ke liye streamlined portal test karein:

#### 📍 Kahan Se Login Karna Hai:
1. Header me profile pill se **Logout** karein.
2. Login karein: **`employee@360crm.com`** / **`admin123`**.

#### 🧪 Step-by-Step Employee Testing:

1. **Selfie Clock-In**:
   - Top right banner me **"Selfie Clock-In"** button dabayein.
   - Web camera snapshot preview aayega ➔ **"Confirm Punch In"** dabayein.
   - Shift Timer start ho jayega: `Work: 00:01:25 | Screen: 00:01:25`.
2. **Break Start/Resume**:
   - **"☕ Start Break"** button dabayein ➔ Status `ON BREAK` ho jayega.
   - **"▶️ Resume Work"** dabayein ➔ Shift active ho jayegi.
3. **Calling Desk & Audio Recorder**:
   - **"My Assigned Leads & Calling"** tab me kisi lead par **"Call & Record"** button dabayein.
   - In-app call dialer modal khulega.
   - Audio record test karein, outcome tag karein (`Interested`, `Follow-up Required`, `Wrong Number`) aur call notes save karein.
4. **Spot Quotation & Order Booking**:
   - Mobile sidebar se **"Quotations"** / **"Sales Orders"** me jakar field se client ke samne direct quotation banayein.
5. **Apply Leave & Download My Payslip**:
   - **"Leave Requests"** me jakar application submit karein aur **"My Salary Slips"** me apna payslip dekhein.

---

## 🛡️ 9. Super Admin Portal (RBAC Roles, Users & System Logs)

System administration aur permissions test karein:

#### 📍 Kahan Se Login Karna Hai:
1. Login karein: **`superadmin@360crm.com`** / **`admin123`**.
2. Sidebar ke bottom me **Shield Icon (🛡️)** ya **Users & Roles** par click karein.

#### 🧪 Test Steps:
1. **RBAC Permission Matrix**:
   - Roles tab me `Sales Executive` ya `Store Manager` select karein.
   - Modules ke permissions checkboxes ON/OFF karein (e.g. `quotations.delete`, `invoices.create`, `live_tracking.view`).
   - Click **"Save Role Permissions"**.
2. **User Accounts Management**:
   - **"Create System User"** button dabayein ➔ Name, Email, Role assign karein aur user activate/suspend karein.
3. **Audit Trail & System Security Logs**:
   - **Audit Logs** tab me jayein ➔ Kis user ne kis time par kya action liya (e.g. `Invoice #104 deleted`, `Payment ₹50,000 received`) ka timestamped log dekhein.
4. **Module Switches**:
   - Puri organization ke liye specific modules enable/disable karein.

---

## 🏁 10. Complete End-to-End Golden Flow Verification Checklist

Jab aap testing complete kar lein, to is checklist ko tick karein:

- [ ] **Step 1**: Lead `Rajesh Agarwal` add kiya aur sales rep assign kiya.
- [ ] **Step 2**: Lead ko Customer `Agarwal Precision Tools` me convert kiya.
- [ ] **Step 3**: Customer ke liye 18% GST wali Quotation generate karke approve ki.
- [ ] **Step 4**: Quotation ko 1-Click me Sales Order me convert kiya.
- [ ] **Step 5**: Sales Order ke against Stock Out (Dispatch) kiya ➔ Inventory 4 units deduct hui.
- [ ] **Step 6**: Sales Order se Tax Invoice generate kiya aur Print PDF check kiya.
- [ ] **Step 7**: Invoice ke against Partial Payment ₹75,000 receive ki ➔ Outstanding balance update hua.
- [ ] **Step 8**: Employee Portal me Selfie Punch In kiya aur Call Log save kiya.
- [ ] **Step 9**: HR Attendance me employee ka live active screen time aur selfie preview check kiya.
- [ ] **Step 10**: Super Admin me Role Permissions modify karke verify kiya.
