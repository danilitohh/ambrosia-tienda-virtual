#!/bin/bash

echo "🔧 Configurando Prisma para Netlify..."

# Generar Prisma Client
echo "⚙️ Generando Prisma Client..."
npx prisma generate

# Verificar generación
if [ ! -d "src/generated/prisma" ]; then
  echo "❌ Error: Prisma Client no se generó en src/generated/prisma"
  exit 1
fi

echo "✅ Prisma Client generado correctamente en src/generated/prisma"

# Continuar con el build normal
echo "🚀 Continuando con build de Next.js..."
npm run build 