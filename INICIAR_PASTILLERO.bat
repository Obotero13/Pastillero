@echo off
title EL PASTILLERO - Servidor Local
echo.
echo  ==================================================
echo   PASTILLERO - Iniciando servidor...
echo  ==================================================
echo.
echo  Abriendo en: http://localhost:3131
echo  Para detener el servidor: cierra esta ventana
echo.
start "" "http://localhost:3131"
python -m http.server 3131 --directory "C:\DOCUMENTOS\AGENTES IA\ANTIGRAVITY\EL PASTILLERO"
pause
