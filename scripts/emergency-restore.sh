#!/bin/bash

# 🆘 Script de Restauración de Emergencia - Ambrosia Tienda Virtual
# Este script restaura el estado estable en caso de problemas

echo "🆘 Iniciando restauración de emergencia..."
echo "⚠️  Esto restaurará el estado estable del proyecto"

read -p "¿Estás seguro de continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restauración cancelada"
    exit 1
fi

# Crear rama de emergencia
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EMERGENCY_BRANCH="emergency-restore-$TIMESTAMP"

echo "🔄 Creando rama de emergencia: $EMERGENCY_BRANCH"
git checkout -b "$EMERGENCY_BRANCH"

echo "📥 Restaurando desde stable-production-backup..."
git checkout stable-production-backup -- .

echo "🔧 Restaurando configuración estable..."

# Desproteger archivos temporalmente para restaurar
chmod 644 .env 2>/dev/null
chmod 644 prisma/schema.prisma 2>/dev/null
chmod 644 src/lib/prisma.ts 2>/dev/null
chmod 644 next.config.ts 2>/dev/null
chmod 644 vercel.json 2>/dev/null

# Volver a proteger
chmod 444 .env
chmod 444 prisma/schema.prisma
chmod 444 src/lib/prisma.ts
chmod 444 next.config.ts
chmod 444 vercel.json

echo ""
echo "✅ Restauración completada en rama: $EMERGENCY_BRANCH"
echo "🚀 Para aplicar a main:"
echo "   git checkout main"
echo "   git merge $EMERGENCY_BRANCH"
echo "   git push origin main"
