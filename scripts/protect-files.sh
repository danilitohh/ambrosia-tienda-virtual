#!/bin/bash

# 🛡️ Script de Protección - Ambrosia Tienda Virtual
# Este script protege los archivos críticos del proyecto

echo "🛡️ Protegiendo archivos críticos de Ambrosia..."

# Archivos críticos de configuración
CRITICAL_FILES=(
    ".env"
    "prisma/schema.prisma"
    "src/lib/prisma.ts"
    "next.config.ts"
    "vercel.json"
    "package.json"
)

# Proteger archivos críticos
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        chmod 444 "$file"
        echo "✅ Protegido: $file"
    else
        echo "⚠️  No encontrado: $file"
    fi
done

echo ""
echo "🔒 Archivos protegidos exitosamente"
echo "💡 Para desproteger temporalmente: chmod 644 <archivo>"
echo "📚 Ver STABLE_CONFIG.md para más información"
