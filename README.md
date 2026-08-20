# 360CRM Enterprise Suite

Fullstack CRM and Business Management platform covering Sales, Marketing, Store/Inventory, Accounts, HR, Dedicated Employee Field & Calling Desk, and Super Admin RBAC.

---

## 🚀 Live Running Services

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Portal** | [http://localhost:5173](http://localhost:5173) | Vite + React + Tailwind CRM Application |
| **Backend API Server** | [http://localhost:5000](http://localhost:5000) | Express TypeScript REST API Server |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Real-time database & service health |

---

## 🔑 Demo Login Accounts (1-Click Login available on login screen)

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@360crm.com` | `admin123` | Unrestricted full system access & User/Role management |
| **Full Admin** | `admin@360crm.com` | `admin123` | Full CRM business operations & management |
| **Sales Employee** | `sales@360crm.com` | `admin123` | Leads, quotations, sales orders & follow-ups desk |
| **Store / Inventory** | `inventory@360crm.com` | `admin123` | Products, stock in/out, warehouses & suppliers |
| **Accounts / Finance** | `accounts@360crm.com` | `admin123` | Invoices, payments, expenses, receivables & reports |
| **HR / People** | `hr@360crm.com` | `admin123` | Employees directory, biometric attendance & salaries |
| **Field Employee** | `employee@360crm.com` | `admin123` | Dedicated 15-module mobile & desktop field portal |

---

## 🛠️ How to Start Manually

### Option 1: Double click `run.bat` (Windows)
Runs both Backend and Frontend in separate command windows.

### Option 2: Run via NPM
In root folder (`c:\Users\shiva\React js\360project`):
```bash
# Terminal 1: Backend
cd 360_backend
npm run dev

# Terminal 2: Frontend
npm run dev
```
