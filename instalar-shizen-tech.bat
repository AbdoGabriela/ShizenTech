@echo off
setlocal
cd /d "%~dp0"
title Shizen Tech - Instalacao

echo ============================================
echo   Shizen Tech - Termometro do Momento
echo   Instalacao automatica
echo ============================================
echo.

echo [1/5] Verificando o Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: o Python nao foi encontrado. Instale o Python e marque "Add python.exe to PATH".
    goto :fim
)

echo [2/5] Criando o ambiente virtual (.venv)...
if exist ".venv\Scripts\python.exe" (
    echo O ambiente virtual ja existe, vou usar o que esta ai.
) else (
    python -m venv .venv
    if errorlevel 1 (
        echo ERRO ao criar o ambiente virtual.
        goto :fim
    )
)

echo [3/5] Instalando as bibliotecas (requirements.txt)...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERRO ao instalar as bibliotecas. Confira a internet e tente de novo.
    goto :fim
)

echo [4/5] Verificando o arquivo .env...
if exist ".env" (
    echo O arquivo .env ja existe, nao vou mexer nele.
) else (
    copy ".env.example" ".env" >nul
    echo Criei o .env. Vai abrir o Bloco de Notas: coloque a senha do MySQL em DB_PASSWORD
    echo e a senha de administrador em ADMIN_SENHA. Salve Ctrl + S e feche o Bloco de Notas.
    notepad ".env"
)

echo [5/5] Criando o banco de dados...
echo.
echo Antes de continuar, deixe o MySQL ligado.
pause
".venv\Scripts\python.exe" criar_banco.py
if errorlevel 1 goto :fim

echo.
echo ============================================
echo   Tudo pronto!
echo ============================================
echo Para abrir a aplicacao, use o iniciar-shizentech.bat.

:fim
echo.
pause
endlocal
