# 🚀 Guía para configurar Supabase y migrar datos

## Paso 1: Obtener la URL de conexión de Supabase

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto "ambrosia"
3. Ve a **Settings** → **Database**
4. Busca la sección **Connection string**
5. Copia la **URI** (algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.efnlnipbrbnqgovyzmgz.supabase.co:5432/postgres
   ```

## Paso 2: Actualizar el esquema de Prisma

1. Reemplaza la URL en tu archivo `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.efnlnipbrbnqgovyzmgz.supabase.co:5432/postgres"
   ```

2. Ejecuta las migraciones:
   ```bash
   npx prisma db push
   ```

## Paso 3: Migrar datos existentes

1. Ejecuta el script de migración:
   ```bash
   npx tsx scripts/migrate-to-supabase.ts
   ```

## Paso 4: Verificar la migración

1. Ve a **Table Editor** en Supabase
2. Verifica que todas las tablas tengan datos:
   - Category
   - Product
   - User
   - Settings

## Paso 5: Actualizar variables de entorno en Vercel

1. Ve a tu dashboard de Vercel
2. Settings → Environment Variables
3. Actualiza `DATABASE_URL` con la nueva URL de Supabase

## Paso 6: Redesplegar en Vercel

```bash
npx vercel --prod
```

---

## ✅ Verificación final

- [ ] URL de Supabase copiada
- [ ] Esquema actualizado
- [ ] Datos migrados
- [ ] Variables de entorno actualizadas en Vercel
- [ ] Aplicación redesplegada 