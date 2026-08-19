@echo off
title Iniciando PomoFoco...
echo ==========================================
echo   INICIANDO POMOFOCO - AGENDE SEU FOCO
echo ==========================================
echo.
echo [1/3] Instalando dependencias (pode demorar na primeira vez)...
call npm install --silent
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao instalar dependencias. Verifique se o Node.js esta instalado.
    pause
    exit /b 1
)

echo.
echo [2/3] Construindo aplicacao...
call npm run build --silent
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao construir aplicacao.
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando servidor e abrindo no navegador...
echo.
echo ==========================================
echo   O APP VAI ABRIR NO SEU NAVEGADOR!
echo   NAO FECHE ESTA JANELA ENQUANTO USA O APP.
echo ==========================================
echo.

start "" "http://localhost:4173"
call npm run preview --silent

pause
