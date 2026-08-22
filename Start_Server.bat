@echo off
title Ou Ta Pruk Learning Games v3 - Local Server
chcp 65001 > nul
echo ========================================================
echo   🌟 ល្បែងសិក្សា៣ (Ou Ta Pruk Learning Games v3)
echo   Local Server កំពុងចាប់ផ្តើមដំណើរការ...
echo ========================================================
echo.
echo កំពុងបិទ Server ចាស់ៗ (បើមាន)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a > nul 2>&1

echo.
echo កំពុងដំណើរការ Local Server សម្រាប់ Folder: %CD%
echo កំពុងបើក Browser ទៅកាន់: http://localhost:8000
echo.

python server.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo កំពុងដំណើរការ Python Built-in Server...
    start http://localhost:8000
    python -m http.server 8000
)
pause
