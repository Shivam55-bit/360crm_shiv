@echo off
echo ========================================================
echo        Starting 360CRM Enterprise Platform
echo ========================================================
echo.
echo 1. Starting Backend API Server (Port 5000)...
start cmd /k "cd 360_backend && npm run dev"
echo.
echo 2. Starting Frontend Web Application (Port 5173)...
start cmd /k "npm run dev"
echo.
echo ========================================================
echo Backend Server URL:  http://localhost:5000
echo Frontend Portal URL: http://localhost:5173
echo ========================================================
