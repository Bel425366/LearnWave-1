@echo off
echo Iniciando LearnWave...

echo.
echo Iniciando servidor backend...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo Aguardando servidor inicializar...
timeout /t 3 /nobreak > nul

echo.
echo Iniciando cliente frontend...
start "Frontend Client" cmd /k "npm run dev"

echo.
echo Aplicacao iniciada!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8080
echo.
echo Pressione qualquer tecla para fechar...
pause > nul