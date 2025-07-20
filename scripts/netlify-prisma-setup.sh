#!/bin/bash

echo "🔧 Configurando Prisma para Netlify..."

# Limpiar caché anterior
if [ -d ".next" ]; then
  echo "🧹 Limpiando caché..."
  rm -rf .next
fi

if [ -d "node_modules/.prisma" ]; then
  echo "🧹 Limpiando Prisma cache..."
  rm -rf node_modules/.prisma
fi

# Generar Prisma Client con configuración específica
echo "⚙️ Generando Prisma Client..."
export PRISMA_GENERATE_DATAPROXY=false
export PRISMA_CLI_QUERY_ENGINE_TYPE=binary

npx prisma generate

# Verificar generación
if [ ! -d "node_modules/.prisma" ]; then
  echo "❌ Error: Prisma Client no se generó"
  exit 1
fi

echo "✅ Prisma Client generado correctamente"

# Continuar con el build normal
echo "🚀 Continuando con build de Next.js..."
npm run build 