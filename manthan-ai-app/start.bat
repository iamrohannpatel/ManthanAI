@echo off
echo Starting ReSeer Development Server...
echo.

REM Try Python server first
python start_server.py
if %errorlevel% neq 0 (
    echo Python not available, trying Node.js...
    node server.js
    if %errorlevel% neq 0 (
        echo Node.js not available, trying npm...
        npm run dev
    )
)

pause
