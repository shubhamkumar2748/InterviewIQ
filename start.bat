@echo off
echo ===================================================
echo     InterviewIQ - Prepare Smarter. Interview Better.
echo ===================================================
echo.
start "InterviewIQ Backend" cmd /k "cd /d %~dp0Backend && python main.py"
timeout /t 2 /nobreak > nul
echo Launching Frontend dev server (http://localhost:5173)...
start "InterviewIQ Frontend" cmd /k "cd /d %~dp0Frontend && npm install && npm run dev -- --host 0.0.0.0"
echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo.
