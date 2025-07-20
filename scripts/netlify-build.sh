#!/bin/bash

# Script de build para Netlify
echo "🔧 Iniciando build en Netlify..."

# Limpiar caché de Prisma si existe
if [ -d ".next" ]; then
  echo "🧹 Limpiando caché de Next.js..."
  rm -rf .next
fi

# Generar Prisma Client
echo "⚙️ Generando Prisma Client..."
npx prisma generate

# Verificar que se generó correctamente
if [ ! -d "node_modules/.prisma" ]; then
  echo "❌ Error: Prisma Client no se generó correctamente"
  exit 1
fi

echo "✅ Prisma Client generado correctamente"

# Ejecutar build de Next.js
echo "🚀 Ejecutando build de Next.js..."
npm run build

echo "✅ Build completado exitosamente" 