@echo off
echo Starting ReSeer Development Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the development server
echo Starting Vite development server...
npm run dev

pause
