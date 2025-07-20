#!/bin/bash

echo "🚀 Iniciando build para Netlify..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# Ejecutar migraciones (opcional - solo si tienes acceso a la DB)
# echo "🗄️ Ejecutando migraciones..."
# npx prisma migrate deploy

# Build del proyecto
echo "🏗️ Construyendo el proyecto..."
npm run build

echo "✅ Build completado exitosamente!" 