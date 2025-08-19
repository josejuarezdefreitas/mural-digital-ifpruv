@echo off
rem Define o titulo da janela do console
title Atualizador do Painel Digital para o GitHub

echo.
echo =======================================================
echo     ATUALIZADOR DO PAINEL DIGITAL PARA O GITHUB
echo =======================================================
echo.

rem Pede ao usuario para inserir uma mensagem para o commit
set /p commitMessage="Digite uma mensagem para a atualizacao (ex: modificado o layout): "

rem Se a mensagem estiver vazia, usa uma mensagem padrao
if "%commitMessage%"=="" set commitMessage="Atualizacao de rotina"

echo.
echo --- Adicionando todos os arquivos...
git add .

echo.
echo --- Salvando alteracoes (commit) com a mensagem: "%commitMessage%"
git commit -m "%commitMessage%"

echo.
echo --- Enviando arquivos para o GitHub...
git push origin main

echo.
echo =======================================================
echo      PROCESSO CONCLUIDO! O site sera atualizado
echo      em alguns minutos.
echo =======================================================
echo.

rem Mantem a janela aberta para o usuario ver o resultado
pause