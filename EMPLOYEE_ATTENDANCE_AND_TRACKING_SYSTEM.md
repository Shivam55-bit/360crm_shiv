# ⏱️ 360CRM Enterprise — Employee Attendance, Geofencing & Live Tracking System Specification

> **Document Version:** 2.2.0  
> **Target Audience:** Mobile App Developers (React Native, Flutter, Swift, Kotlin), Backend Engineers, HR Admins  
> **API Endpoints:** `http://127.0.0.1:5055/api` (Local) & `https://three60crm-shiv.onrender.com/api` (Live Cloud)  
> **Authentication:** Standard JWT Bearer Token (`Authorization: Bearer <TOKEN>`)

---

## 📑 Table of Contents
1. [Attendance System Architecture & How It Works](#1-attendance-system-architecture--how-it-works)
2. [Comprehensive Feature Matrix](#2-comprehensive-feature-matrix)
3. [Step-by-Step Operational Workflows & Sequence Diagrams](#3-step-by-step-operational-workflows--sequence-diagrams)
4. [Complete REST API Reference (Request & Response Payloads)](#4-complete-rest-api-reference)
   - [4.1 Employee Clock-In (Punch-In with Selfie & GPS)](#41-employee-clock-in-punch-in-with-selfie--gps)
   - [4.2 Employee Clock-Out (Punch-Out & Daily Work Summary)](#42-employee-clock-out-punch-out--daily-work-summary)
   - [4.3 Tea & Lunch Break Management](#43-tea--lunch-break-management)
   - [4.4 Monthly Attendance Calendar & History](#44-monthly-attendance-calendar--history)
   - [4.5 Continuous Background GPS Tracking Telemetry](#45-continuous-background-gps-tracking-telemetry)
   - [4.6 Offline GPS Location Batch Sync](#46-offline-gps-location-batch-sync)
   - [4.7 HR Attendance Policy Settings](#47-hr-attendance-policy-settings)
5. [Anti-Fraud & Security Validation Rules](#5-anti-fraud--security-validation-rules)
6. [TypeScript Interfaces & Data Models](#6-typescript-interfaces--data-models)
7. [Mobile App Implementation Code Snippets (Flutter & React Native)](#7-mobile-app-implementation-code-snippets)

---

## 1. Attendance System Architecture & How It Works

The 360CRM Attendance Engine ensures **zero-proxy, high-precision, fraud-resistant time tracking** for field and office employees.

```
+---------------------------------------------------------------------------------------------------+
|                                     EMPLOYEE MOBILE / WEB APP                                     |
+---------------------------------+---------------------------------+-------------------------------+
|  1. Live Camera Selfie Capture  |  2. High-Accuracy GPS Provider  |  3. Device Telemetry & Battery|
+---------------------------------+---------------------------------+-------------------------------+
                                                  |
                            [ HTTPS JSON Payload + Bearer JWT ]
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                  360CRM ATTENDANCE ENGINE & API                                   |
+---------------------------------------------------------------------------------------------------+
| 1. Geofence Radius Verification (Haversine Formula <= 100m - 500m of Office Branch)               |
| 2. Anti-Mock / Fake GPS Spoofing Detection (Max Accuracy Tolerance <= 100m)                      |
| 3. Live Facial Selfie Image Base64 Verification                                                  |
| 4. Shift Duration Live Stopwatch & Break Hours Deduction Engine                                   |
| 5. Automated Half-Day / Late-In / Overtime Classification                                         |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                PERSISTENT DATABASE & AUDIT LOGS                                   |
| (db.attendance, db.devices, db.geofences, db.locationHistory, db.dailyTrackingSummaries)          |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Comprehensive Feature Matrix

| Feature | Description | Business Benefit |
|---|---|---|
| **1. Geo-Fenced Punch-In** | Validates employee coordinates against authorized office/plant locations within a defined radius (*e.g., 100m - 500m*). | Prevents punching from home or outside the workplace. |
| **2. Live Selfie Camera Capture** | Mandatory selfie capture through front camera at the exact moment of punch-in/out. | Prevents proxy attendance or password sharing. |
| **3. Anti-Spoofing & Mock GPS Filter** | Rejects mock location apps, GPS spoofers, and coordinates with poor accuracy (`accuracy > 100m`). | Ensures 100% genuine physical presence. |
| **4. Live Shift Stopwatch** | Live `HH:MM:SS` timer on the dashboard that tracks current working time in real time. | Full visibility of daily shift progress. |
| **5. Tea & Lunch Break Tracker** | Dedicated buttons for **Tea Break (15m)** and **Lunch Break (45m)**. Automatically deducts break time from net working hours. | Accurate payroll & overtime calculations. |
| **6. Shift Settlement & Half-Day Rules** | Automatically calculates total work hours: `>= 8.0h` (Present), `4.0h - 7.9h` (Half Day), `< 4.0h` (Absent / Incomplete). | Automated HR payroll calculations without manual errors. |
| **7. Daily Work Summary on Clock-Out** | Employee submits key achievements/remarks before clocking out. | Transparent daily work accountability. |
| **8. Monthly Color-Coded Calendar** | Interactive calendar: 🟢 Present, 🟡 Half Day, 🔴 Absent, 🟣 Approved Leave, ⚪ Weekend / Holiday. | Easy monthly self-audit for salary slips. |
| **9. Continuous Background GPS Tracking** | Periodically pings coordinates (*every 30–60s*) during the shift. Pauses automatically upon Clock-Out. | Real-time map tracking of field sales reps. |
| **10. Offline Batch Sync** | If internet drops in rural areas, saves pings in local SQLite and syncs when back online. | Zero data loss during field visits. |

---

## 3. Step-by-Step Operational Workflows & Sequence Diagrams

### Flow 1: Morning Clock-In (Punch-In) Journey
```mermaid
sequenceDiagram
    autonumber
    actor Employee as Field / Office Employee
    participant App as Mobile App (Camera + GPS)
    participant Engine as Attendance Backend Engine
    participant DB as JSON Database

    Employee->>App: Clicks "Clock-In"
    App->>App: Checks GPS Permission & Requests High-Accuracy Location (Lat, Lng)
    App->>App: Opens Live Front Camera -> Captures Live Selfie
    App->>Engine: POST /api/employee/attendance/clock-in {latitude, longitude, selfieImage, battery, address}
    Engine->>Engine: Step 1: Check if already clocked in today
    Engine->>Engine: Step 2: Validate GPS accuracy (<= 100m)
    Engine->>Engine: Step 3: Run Haversine Formula: distance(Lat1, Lng1, OfficeLat, OfficeLng)
    alt Outside Geofence Radius (> 100m)
        Engine-->>App: 403 Forbidden ("You are 450m away from Office. Allowed radius: 100m")
        App-->>Employee: Shows Error Banner & Map distance
    else Inside Authorized Geofence
        Engine->>DB: Record attendance doc {checkIn: "09:30 AM", status: "PRESENT", selfieUrl, lat, lng}
        Engine-->>App: 200 OK ("Shift Started at 09:30 AM")
        App-->>Employee: Displays Shift Timer (00:00:01) & Starts Background GPS Service
    end
```

---

### Flow 2: Shift End & Clock-Out Journey
```mermaid
sequenceDiagram
    autonumber
    actor Employee as Employee
    participant App as Mobile App
    participant Engine as Attendance Backend Engine
    participant DB as JSON Database

    Employee->>App: Clicks "Clock-Out"
    App->>Employee: Prompts "Daily Work Summary / Key Achievements Notes"
    Employee->>App: Enters Summary Notes & Confirms
    App->>Engine: POST /api/employee/attendance/clock-out {latitude, longitude, dailySummaryNotes}
    Engine->>Engine: Calculate: WorkHours = (CheckOutTime - CheckInTime) - TotalBreakMinutes
    Engine->>Engine: Determine Status: If WorkHours >= 8.0h -> PRESENT, Else -> HALF_DAY
    Engine->>DB: Update attendance doc {checkOut: "06:30 PM", workHours: 8.5, status: "PRESENT"}
    Engine-->>App: 200 OK ("Clocked out successfully. Total hours: 8.5h")
    App->>App: Stop Background GPS Tracking Service
    App-->>Employee: Shows Shift Summary Card
```

---

## 4. Complete REST API Reference

### Module Headers:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

### 4.1 Employee Clock-In (Punch-In with Selfie & GPS)
- **Endpoint:** `POST /api/employee/attendance/clock-in`
- **Method:** `POST`
- **Auth:** Bearer JWT Token
- **Request Body:**
```json
{
  "latitude": 23.0225,
  "longitude": 72.5714,
  "address": "SG Highway, Ahmedabad, Gujarat",
  "selfie": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "batteryLevel": 88,
  "deviceInfo": "Samsung Galaxy S23 (Android 14)"
}
```

- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "✅ Shift Started! Verified at 09:30:15 AM [Headquarters Office]",
  "data": {
    "_id": "att_2026_09_01_arjun",
    "employeeId": "usr_employee_arjun",
    "employeeName": "Arjun Singh",
    "date": "2026-09-01",
    "checkIn": "09:30:15 AM",
    "checkOut": "",
    "status": "PRESENT",
    "workHours": 0,
    "breaks": [],
    "clockInVerification": {
      "selfieVerified": true,
      "locationVerified": true,
      "latitude": 23.0225,
      "longitude": 72.5714,
      "accuracy": 8.5,
      "officeLocationName": "Headquarters Office",
      "distanceFromOffice": 18,
      "verifiedAt": "2026-09-01T04:00:15.000Z"
    }
  }
}
```

- **Error Response — Geofence Violation (`403 Forbidden`):**
```json
{
  "success": false,
  "message": "Clock In is not allowed from your current location. (Nearest: Headquarters Office — approx 850m away, allowed radius: 200m)"
}
```

- **Error Response — Already Clocked In (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Already clocked in at 09:30 AM. Please clock out when your shift ends."
}
```

---

### 4.2 Employee Clock-Out (Punch-Out & Daily Work Summary)
- **Endpoint:** `POST /api/employee/attendance/clock-out`
- **Method:** `POST`
- **Request Body:**
```json
{
  "latitude": 23.0228,
  "longitude": 72.5710,
  "address": "Headquarters Office, Ahmedabad",
  "selfie": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "remarks": "Completed 12 client calls, 2 physical site surveys, generated 1 quotation."
}
```

- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "✅ Clocked Out Successfully! Total Shift Duration: 8.5h",
  "data": {
    "date": "2026-09-01",
    "checkIn": "09:30:15 AM",
    "checkOut": "06:30:20 PM",
    "workHours": 8.5,
    "status": "PRESENT",
    "totalBreakMinutes": 45,
    "remarks": "Completed 12 client calls, 2 physical site surveys, generated 1 quotation."
  }
}
```

---

### 4.3 Tea & Lunch Break Management
- **Endpoint:** `POST /api/employee/attendance/break`
- **Method:** `POST`
- **Request Body (Start Break):**
```json
{
  "breakType": "LUNCH",
  "action": "START"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Lunch break started at 01:15 PM"
}
```

- **Request Body (End Break):**
```json
{
  "breakType": "LUNCH",
  "action": "END"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Lunch break ended. Duration: 42 minutes. Resuming work timer."
}
```

---

### 4.4 Monthly Attendance Calendar & History
- **Endpoint:** `GET /api/employee/attendance?month=2026-09`
- **Method:** `GET`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPresentDays": 21,
      "totalHalfDays": 1,
      "totalAbsentDays": 0,
      "totalLeaveDays": 2,
      "totalWorkHours": 178.5,
      "averageDailyHours": 8.1
    },
    "records": [
      {
        "date": "2026-09-01",
        "checkIn": "09:30 AM",
        "checkOut": "06:30 PM",
        "workHours": 8.5,
        "status": "PRESENT",
        "breaks": [
          { "type": "TEA", "durationMinutes": 15 },
          { "type": "LUNCH", "durationMinutes": 45 }
        ]
      }
    ]
  }
}
```

---

### 4.5 Continuous Background GPS Tracking Telemetry
- **Endpoint:** `POST /api/employee-tracking/location`
- **Method:** `POST`
- **Frequency:** Sent automatically every 30-60 seconds during active shift.
- **Request Body:**
```json
{
  "latitude": 23.0256,
  "longitude": 72.5789,
  "accuracy": 7.8,
  "altitude": 54.0,
  "speed": 18.5,
  "heading": 180.0,
  "battery": 84,
  "activity": "IN_VEHICLE",
  "isMockLocation": false,
  "timestamp": "2026-09-01T10:15:30.000Z"
}
```
- **Response (`200 OK`):**
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

---

### 4.6 Offline GPS Location Batch Sync
- **Endpoint:** `POST /api/employee-tracking/location/batch`
- **Method:** `POST`
- **Request Body:**
```json
{
  "locations": [
    {
      "latitude": 23.0240,
      "longitude": 72.5760,
      "speed": 15.0,
      "battery": 86,
      "timestamp": "2026-09-01T10:10:00.000Z"
    },
    {
      "latitude": 23.0256,
      "longitude": 72.5789,
      "speed": 22.4,
      "battery": 84,
      "timestamp": "2026-09-01T10:15:30.000Z"
    }
  ]
}
```

---

### 4.7 HR Attendance Policy Settings
- **Endpoint:** `GET /api/employee-tracking/settings`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "requireSelfieClockIn": true,
    "requireSelfieClockOut": false,
    "requireLocationClockIn": true,
    "requireLocationClockOut": false,
    "maxGpsAccuracyMeters": 100,
    "allowedLocations": [
      {
        "id": "loc_hq",
        "name": "Headquarters Office Ahmedabad",
        "lat": 23.0225,
        "lng": 72.5714,
        "radiusMeters": 200,
        "enabled": true
      },
      {
        "id": "loc_plant",
        "name": "Sanand GIDC Manufacturing Plant",
        "lat": 22.9867,
        "lng": 72.3789,
        "radiusMeters": 500,
        "enabled": true
      }
    ]
  }
}
```

---

## 5. Anti-Fraud & Security Validation Rules

1. **Haversine Distance Formula Calculation**:
   $$\Delta\text{lat} = \text{lat}_2 - \text{lat}_1, \quad \Delta\text{lon} = \text{lon}_2 - \text{lon}_1$$
   $$a = \sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lon}}{2}\right)$$
   $$d = 2 R \cdot \arctan2\left(\sqrt{a}, \sqrt{1-a}\right) \quad (\text{where } R = 6,371,000\text{ m})$$
   *If $d > \text{radiusMeters}$, punch-in is rejected.*

2. **GPS Accuracy Validation**:
   - Device GPS accuracy (`accuracy` in meters) must be $\le 100\text{m}$. If accuracy is $> 200\text{m}$ (e.g. cellular tower triangulation instead of GPS satellite), system prompts to turn on device Location Accuracy / High Precision GPS.

3. **Live Camera Selfie Check**:
   - Gallery / file picker uploads are blocked in native mobile code. The photo must be captured directly from the active camera hardware.

---

## 6. TypeScript Interfaces & Data Models

```typescript
export interface AttendanceDoc {
  _id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM:SS AM/PM
  checkOut?: string; // HH:MM:SS AM/PM
  status: 'PRESENT' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE' | 'HOLIDAY';
  workHours?: number; // e.g. 8.5
  remarks?: string;
  selfieCheckIn?: string; // Base64 or CDN URL
  selfieCheckOut?: string;
  locationCheckIn?: {
    lat: number;
    lng: number;
    accuracy?: number;
    address?: string;
    matchedLocationName?: string;
    verifiedDistance?: number;
  };
  locationCheckOut?: {
    lat: number;
    lng: number;
    address?: string;
  };
  breaks?: Array<{
    type: 'TEA' | 'LUNCH' | 'PERSONAL';
    startTime: string;
    endTime?: string;
    durationMinutes?: number;
  }>;
  totalBreakMinutes?: number;
}
```

---

## 7. Mobile App Implementation Code Snippets

### 📱 React Native (TypeScript + Geolocation + Camera)

```typescript
import Geolocation from '@react-native-community/geolocation';

export const handleClockIn = async (selfieBase64: string) => {
  Geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      const response = await fetch('https://three60crm-shiv.onrender.com/api/employee/attendance/clock-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userJwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude,
          longitude,
          accuracy,
          selfie: selfieBase64,
          address: 'Current Device Location'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(result.message);
      } else {
        alert(`Clock-in Failed: ${result.message}`);
      }
    },
    (error) => alert('Please enable High Accuracy GPS in device settings.'),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};
```

---

### 📱 Flutter (Dart + Geolocator + Camera)

```dart
import 'dart:convert';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;

Future<void> clockInEmployee(String selfieBase64, String jwtToken) async {
  Position pos = await Geolocator.getCurrentPosition(
    desiredAccuracy: LocationAccuracy.high,
  );

  final url = Uri.parse('https://three60crm-shiv.onrender.com/api/employee/attendance/clock-in');
  final response = await http.post(
    url,
    headers: {
      'Authorization': 'Bearer $jwtToken',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'latitude': pos.latitude,
      'longitude': pos.longitude,
      'accuracy': pos.accuracy,
      'selfie': selfieBase64,
    }),
  );

  final data = jsonDecode(response.body);
  if (response.statusCode == 200) {
    print('Clock-In Successful: ${data['message']}');
  } else {
    print('Error: ${data['message']}');
  }
}
```

---

✅ **Document Complete**: Yeh file attendance system ki working, anti-fraud rules, mathematical algorithms, security policies aur saari REST APIs ko cover karti hai.
