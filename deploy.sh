#!/bin/bash
# Script de despliegue en WSL

echo "🚀 Iniciando despliegue de Spring-WSL-Mastery..."

# Asegurarse de estar en el directorio correcto
cd "$(dirname "$0")"

# Detener contenedores previos
docker-compose down

# Construir y levantar todo en segundo plano
docker-compose up --build -d

echo "✅ Sistema desplegado con éxito!"
echo "📍 Backend: http://localhost:8080"
echo "📍 Frontend: http://localhost:80"
echo "📊 Base de Datos: localhost:5432"
