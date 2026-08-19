@echo off
chcp 65001 >nul
title PomoFoco - Modo Estático

echo ============================================
echo   PomoFoco - Modo Estatico (sem Node.js)
echo ============================================
echo.

REM Verificar se Python esta instalado
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado.
    echo.
    echo Para usar este aplicativo sem Node.js, voce precisa do Python.
    echo.
    echo OPCAO ALTERNATIVA:
    echo   Simplesmente abra o arquivo "dist\index.html" no seu navegador.
    echo   Dê dois cliques nele ou arraste para o Chrome/Edge/Firefox.
    echo.
    pause
    exit /b 1
)

echo Iniciando servidor HTTP simples com Python...
echo.
echo ========================================================
echo   PomoFoco esta rodando!
echo   Navegador abrira em http://localhost:8000
echo.
echo   PARA FECHAR: Pressione Ctrl+C nesta janela
echo   NAO FECHE ESTA JANELA enquanto estiver usando o app
echo ========================================================
echo.

cd dist
start http://localhost:8000
python -m http.server 8000

echo.
echo Servidor parado.
pause
