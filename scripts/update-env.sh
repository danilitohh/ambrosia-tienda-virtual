#!/bin/bash

# Script para actualizar las variables de entorno con Supabase

echo "🚀 Actualizando variables de entorno para Supabase..."

# Crear o actualizar .env.local
cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://postgres:Tr3scorazon!@db.fmdnopkzeisopsohrzrq.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3004"
NEXTAUTH_SECRET="ambrosia-super-secret-key-2024-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Supabase (for migration)
SUPABASE_DATABASE_URL="postgresql://postgres:Tr3scorazon!@db.fmdnopkzeisopsohrzrq.supabase.co:5432/postgres"
EOF

echo "✅ Archivo .env.local actualizado con la URL de Supabase"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta: npx prisma db push"
echo "2. Ejecuta: npx tsx scripts/migrate-to-supabase.ts"
echo "3. Actualiza las variables en Vercel"
echo "4. Redespliega: npx vercel --prod" 