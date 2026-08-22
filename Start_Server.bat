@echo off
title Ou Ta Pruk Learning Games - Local Server
chcp 65001 > nul
echo ========================================================
echo   ល្បែងសិក្សា អូរតាប្រុក (Ou Ta Pruk Learning Games)
echo   Local Server កំពុងចាប់ផ្តើមដំណើរការ...
echo ========================================================
echo.
echo កំពុងបើក Browser ទៅកាន់: http://localhost:8000
echo.
start http://localhost:8000
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python server.py បរាជ័យ កំពុងដំណើរការ Python Built-in Server...
    python -m http.server 8000
)
pause
