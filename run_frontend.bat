@echo off
cd /d "%~dp0\Frontend"
npm install
npm run dev -- --host 0.0.0.0
