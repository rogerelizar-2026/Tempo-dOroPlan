@echo off
chcp 65001 >nul
title PomoFoco - Iniciando...

echo ============================================
echo   PomoFoco - Timer Pomodoro e Planner
echo ============================================
echo.

REM Verificar se Node.js esta instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao esta instalado no seu computador.
    echo.
    echo Para usar este aplicativo, voce tem duas opcoes:
    echo.
    echo OPCAO 1 - Instalar Node.js (recomendado):
    echo   1. Acesse https://nodejs.org/pt-br/
    echo   2. Baixe a versao LTS (Recomendada)
    echo   3. Instale com as opcoes padrao
    echo   4. Execute este arquivo novamente
    echo.
    echo OPCAO 2 - Usar versao estatica (funciona sem instalacao):
    echo   Abra o arquivo "dist/index.html" diretamente no seu navegador.
    echo   Nota: Algumas funcionalidades podem ser limitadas.
    echo.
    pause
    exit /b 1
)

echo [1/3] Instalando dependencias (pode demorar na primeira vez)...
call npm install --silent
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao instalar dependencias.
    pause
    exit /b 1
)

echo [2/3] Construindo aplicacao...
call npm run build --silent
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao construir aplicacao.
    pause
    exit /b 1
)

echo [3/3] Iniciando servidor...
echo.
echo ========================================================
echo   PomoFoco esta rodando!
echo   Navegador abrira em http://localhost:4173
echo.
echo   PARA FECHAR: Pressione Ctrl+C nesta janela
echo   NAO FECHE ESTA JANELA enquanto estiver usando o app
echo ========================================================
echo.

REM Iniciar servidor em segundo plano e abrir navegador
start "" cmd /c "npm run preview -- --port 4173 --host 0.0.0.0"
timeout /t 3 /nobreak >nul
start http://localhost:4173

echo.
echo Servidor iniciado! Mantenha esta janela aberta.
echo Pressione Ctrl+C para parar quando terminar de usar.
pause >nul
