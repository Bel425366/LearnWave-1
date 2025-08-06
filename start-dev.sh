#!/bin/bash

# Script para iniciar servidor e cliente em desenvolvimento

echo "Iniciando servidor backend..."
cd server && npm run dev &

echo "Aguardando servidor inicializar..."
sleep 3

echo "Iniciando cliente frontend..."
cd .. && npm run dev &

echo "Aplicação iniciada!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3001"

wait