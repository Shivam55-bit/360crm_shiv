# 📱 360CRM Enterprise — Employee Mobile App Integration & REST API Handbook

> **Document Version:** 3.0.0  
> **Target Audience:** React Native (TypeScript), Flutter, iOS & Android Mobile Engineers  
> **Status:** Production Ready & Verified Against Backend Test Suite  
> **Local Base URL:** `http://127.0.0.1:5055/api`  
> **Cloud Base URL:** `https://three60crm-shiv.onrender.com/api`  
> **Auth Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 📑 Table of Contents
1. [Architecture & Lifecycle Overview](#1-architecture--lifecycle-overview)
2. [Authentication & Session Initialization](#2-authentication--session-initialization)
3. [Privacy Policy & Consent Agreement](#3-privacy-policy--consent-agreement)
4. [Attendance Engine (Clock-In, Breaks, Clock-Out)](#4-attendance-engine)
5. [GPS Telemetry Ingestion (Realtime & Offline Batch)](#5-gps-telemetry-ingestion)
6. [Dynamic Tasks, Geofences & Visit Proofs](#6-dynamic-tasks-geofences--visit-proofs)
7. [Document Attachments & Voice Notes](#7-document-attachments--voice-notes)
8. [Workday Timeline & Story Summary](#8-workday-timeline--story-summary)
9. [Shift Handover & End-of-Day Closure](#9-shift-handover--end-of-day-closure)
10. [Nearby Assigned Work Discovery](#10-nearby-assigned-work-discovery)
11. [Travel Mileage Expense Auto-Drafts](#11-travel-mileage-expense-auto-drafts)
12. [Employee Safety & SOS Protocol](#12-employee-safety--sos-protocol)
13. [AI-Ready Follow-up Suggestions & Lead Priority](#13-ai-ready-follow-up-suggestions)
14. [Realtime WebSocket / SSE Events](#14-realtime-events)
15. [Error Codes & Troubleshooting Guide](#15-error-codes--troubleshooting-guide)

---

## 1. Architecture & Lifecycle Overview

```
+----------------------------------------------------------------------------------------------------+
|                                    MOBILE APPLICATION WORKDAY CYCLE                                |
+----------------------------------------------------------------------------------------------------+
| 1. Login (JWT) ➔ Check Consent (GET /api/employee-tracking/my-status)                              |
| 2. Morning Punch-In (POST /api/employee/attendance/clock-in with Selfie + GPS)                     |
| 3. Start Background Telemetry Worker (POST /api/employee-tracking/location every 30-60s)           |
| 4. Field Work: Dynamic Geofences ➔ Arrival ➔ Site Photos ➔ Customer Signature ➔ Proof Submission   |
| 5. Offline Resiliency: SQLite Queue ➔ POST /api/employee-tracking/location/batch on Reconnect       |
| 6. Breaks: Tea / Lunch Break Toggle (POST /api/employee/attendance/break)                         |
| 7. Evening Clock-Out: Work Summary + Handover Notes + Mileage Expense Draft Confirmation          |
| 8. Telemetry Worker Shuts Down (Strict Zero Off-Hours Surveillance)                               |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Authentication & Session Initialization

### 2.1 Employee Login
- **Endpoint:** `POST /api/auth/login`
- **Method:** `POST`
- **Request Body:**
```json
{
  "email": "employee@360crm.com",
  "password": "admin123"
}
```

- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_employee_arjun",
      "name": "Arjun Singh",
      "email": "employee@360crm.com",
      "role": "SALES_EMPLOYEE",
      "department": "Sales",
      "designation": "Senior Sales Executive"
    }
  }
}
```

---

## 3. Privacy Policy & Consent Agreement

### 3.1 Get My Tracking Policy & Shift Status
- **Endpoint:** `GET /api/employee-tracking/my-status`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "hasProfile": true,
    "employeeId": "emp_arjun",
    "employeeName": "Arjun Singh",
    "trackingEnabled": true,
    "trackingMode": "ACTIVE_SHIFT",
    "consentStatus": "ACCEPTED",
    "isTrackingActive": true,
    "shiftStart": "09:30",
    "shiftEnd": "18:30",
    "updateFrequencySeconds": 60,
    "latestLocation": {
      "latitude": 23.0225,
      "longitude": 72.5714,
      "accuracy": 8,
      "batteryLevel": 91
    }
  }
}
```

### 3.2 Accept Tracking Privacy Consent
- **Endpoint:** `POST /api/employee-tracking/my-consent`
- **Payload:**
```json
{
  "status": "GRANTED"
}
```

---

## 4. Attendance Engine

### 4.1 Clock-In (Punch-In with Selfie & Geofence Verification)
- **Endpoint:** `POST /api/employee/attendance/clock-in`
- **Payload:**
```json
{
  "latitude": 23.0225,
  "longitude": 72.5714,
  "accuracy": 10,
  "address": "Headquarters Office, Ahmedabad",
  "selfie": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "batteryLevel": 92
}
```
- **Success Response (`200 OK` / `201 Created`):**
```json
{
  "success": true,
  "message": "✅ Shift Started! Verified at 09:30:15 AM [Headquarters Office]",
  "data": {
    "_id": "att_2026_09_02_arjun",
    "date": "2026-09-02",
    "checkIn": "09:30:15 AM",
    "status": "PRESENT",
    "workHours": 0
  }
}
```

### 4.2 Breaks (Tea & Lunch Break Management)
- **Endpoint:** `POST /api/employee/attendance/break`
- **Start Break:** `{"breakType": "LUNCH", "action": "START"}`
- **End Break:** `{"breakType": "LUNCH", "action": "END"}`

### 4.3 Clock-Out (Punch-Out & Settlement)
- **Endpoint:** `POST /api/employee/attendance/clock-out`
- **Payload:**
```json
{
  "latitude": 23.0225,
  "longitude": 72.5714,
  "remarks": "Completed 3 customer visits, 10 follow-up calls, and 1 quote."
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "✅ Clocked Out Successfully! Verified at 06:30:20 PM. Work Hours: 8.5h",
  "data": {
    "date": "2026-09-02",
    "checkIn": "09:30:15 AM",
    "checkOut": "06:30:20 PM",
    "workHours": 8.5,
    "status": "PRESENT"
  }
}
```

---

## 5. GPS Telemetry Ingestion

### 5.1 Realtime Single Coordinate Ping (Every 30–60s)
- **Endpoint:** `POST /api/employee-tracking/location`
- **Payload:**
```json
{
  "latitude": 23.0256,
  "longitude": 72.5789,
  "accuracy": 8.5,
  "speed": 12.0,
  "heading": 180.0,
  "altitude": 54.0,
  "batteryLevel": 88,
  "isCharging": false,
  "isMockLocation": false,
  "recordedAt": "2026-09-02T04:15:30.000Z"
}
```

### 5.2 Offline Batch Sync (Up to 100 Coordinates per Request)
- **Endpoint:** `POST /api/employee-tracking/location/batch`
- **Payload:**
```json
{
  "packets": [
    {
      "latitude": 23.0300,
      "longitude": 72.5800,
      "accuracy": 15,
      "speed": 25.0,
      "battery": 85,
      "timestamp": "2026-09-02T04:30:00.000Z"
    },
    {
      "latitude": 23.0350,
      "longitude": 72.5850,
      "accuracy": 12,
      "speed": 30.0,
      "battery": 84,
      "timestamp": "2026-09-02T04:35:00.000Z"
    }
  ]
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Batch processed: 2 accepted, 0 duplicate, 0 rejected.",
  "data": {
    "received": 2,
    "accepted": 2,
    "duplicate": 0,
    "rejected": 0
  }
}
```

---

## 6. Dynamic Tasks, Geofences & Visit Proofs

### 6.1 Submit Field Visit Proof & Customer Signature
- **Endpoint:** `POST /api/employee/tasks/:taskId/proof`
- **Payload:**
```json
{
  "latitude": 23.0502,
  "longitude": 72.6001,
  "accuracy": 12,
  "sitePhotoUrls": ["https://cdn.example.com/site_photo_1.jpg"],
  "customerSignatureUrl": "data:image/png;base64,iVBORw0KGgo...",
  "signedByName": "Dr. R. Sharma (Facility Manager)",
  "notes": "Generator inspection completed. Voltage calibrated."
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "✅ Field visit proof submitted and task marked completed.",
  "data": {
    "_id": "proof_178829384",
    "verificationStatus": "VERIFIED"
  }
}
```

---

## 7. Document Attachments & Voice Notes

### 7.1 Attach Field Document
- **Endpoint:** `POST /api/employee/attachments`
- **Payload:**
```json
{
  "entityType": "CUSTOMER",
  "entityId": "cust_apollo",
  "documentType": "PURCHASE_ORDER",
  "fileUrl": "https://cdn.example.com/po_98234.pdf",
  "fileName": "Apollo_PO_Sep2026.pdf",
  "notes": "Signed PO for 2 units"
}
```

### 7.2 Upload Field Voice Note
- **Endpoint:** `POST /api/employee/voice-notes`
- **Payload:**
```json
{
  "leadId": "lead_9823",
  "audioUrl": "https://cdn.example.com/audio/voice_note_1.mp3",
  "durationSeconds": 45,
  "notes": "Client requested discount on bulk order."
}
```

---

## 8. Workday Timeline & Story Summary

### 8.1 Chronological Workday Timeline
- **Endpoint:** `GET /api/employee/workday/timeline?date=YYYY-MM-DD`
- **Response:** Array of chronological events (`CLOCK_IN`, `GEOFENCE_ENTER`, `CALL`, `PHOTO_PROOF`, `CLOCK_OUT`).

### 8.2 Daily Activity Story
- **Endpoint:** `GET /api/employee/workday/summary?date=YYYY-MM-DD`
- **Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-09-02",
    "metrics": {
      "clientVisits": 3,
      "calls": 12,
      "followUps": 4,
      "quotations": 2,
      "tasksCompleted": 3,
      "distanceKm": 18.4,
      "workingMinutes": 510
    },
    "draftText": "Completed 3 client visits, made 12 customer calls, completed 4 follow-ups, 3 tasks, and generated 2 quotations with ~18.4 km field travel across 8.5 hours."
  }
}
```

---

## 9. Shift Handover & End-of-Day Closure

- **Endpoint:** `POST /api/employee/shift/handover`
- **Payload:**
```json
{
  "handoverNotes": "All site visits completed. 1 quotation pending client approval tomorrow morning.",
  "pendingLeadIds": ["lead_123"],
  "pendingTaskIds": ["task_456"]
}
```

---

## 10. Nearby Assigned Work Discovery

- **Endpoint:** `GET /api/employee/nearby-work?lat=23.0225&lng=72.5714&radius=25`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_apollo",
      "type": "TASK",
      "title": "Apollo Hospitals Generator Check",
      "priority": "HIGH",
      "latitude": 23.0500,
      "longitude": 72.6000,
      "distanceKm": 4.2,
      "distanceMeters": 4210,
      "contactName": "Dr. R. Sharma",
      "contactPhone": "+91 9876543210"
    }
  ]
}
```

---

## 11. Travel Mileage Expense Auto-Drafts

- **Endpoint:** `POST /api/employee/travel-expenses`
- **Payload:**
```json
{
  "date": "2026-09-02",
  "ratePerKm": 8.5,
  "notes": "Field client meetings across Ahmedabad & Gandhinagar."
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "exp_draft_982",
    "distanceKm": 18.4,
    "ratePerKm": 8.5,
    "calculatedAmount": 156.40,
    "totalClaimAmount": 156.40,
    "status": "DRAFT"
  }
}
```

---

## 12. Employee Safety & SOS Protocol

### 12.1 Emergency SOS Trigger
- **Endpoint:** `POST /api/employee/safety/sos`
- **Payload:**
```json
{
  "latitude": 23.0225,
  "longitude": 72.5714,
  "message": "Vehicle breakdown on SG Highway. Need assistance."
}
```

### 12.2 Safety Check-In
- **Endpoint:** `POST /api/employee/safety/check-in`
- **Payload:**
```json
{
  "message": "Assistance received. Safe and resuming work."
}
```

---

## 13. AI-Ready Follow-up Suggestions

- **Endpoint:** `GET /api/employee/leads/:leadId/ai-suggestions`
- **Response:**
```json
{
  "success": true,
  "data": {
    "aiEnabled": false,
    "suggestedNextAction": "Quotation Follow-Up & Negotiation",
    "suggestedFollowUpDate": "2026-09-03",
    "callAgenda": "Review Quotation #QT-2026-0012 (₹4,50,000) with client.",
    "recommendedChannel": "WHATSAPP",
    "messageDraft": "Hi Arjun, following up on quotation #QT-2026-0012. Please let us know if any adjustments are needed.",
    "reason": "Quotation is awaiting client approval."
  }
}
```

---

## 14. Realtime Events

### WebSocket / SSE Subscriptions
| Event Name | Direction | Payload Description |
|---|---|---|
| `employee:location:update` | Server ➔ Client | Realtime coordinate update of an employee |
| `employee:geofence:entered` | Server ➔ Client | Employee arrived at an authorized geofence site |
| `employee:geofence:exited` | Server ➔ Client | Employee departed from a geofence site with dwell duration |
| `employee:sos` | Server ➔ Client | Urgent SOS alert broadcast to managers |

---

## 15. Error Codes & Troubleshooting Guide

| HTTP Status | Message | Meaning / Remediation |
|---|---|---|
| `400 Bad Request` | `Already clocked in at 09:30 AM` | Employee already started their daily shift. |
| `403 Forbidden` | `Location/GPS verification is required for Clock-In` | GPS coordinates were omitted in payload. |
| `403 Forbidden` | `Clock In is not allowed from your current location` | Employee is outside authorized office geofence radius. |
| `403 Forbidden` | `Tracking inactive per privacy policy` | Attempted location broadcast outside shift hours. |

---

✅ **Handbook Complete**: Use this specification as the single authoritative guide for building the 360CRM Mobile App.
