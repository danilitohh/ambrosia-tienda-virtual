# 🛡️ CONFIGURACIÓN ESTABLE - NO MODIFICAR

> **ADVERTENCIA:** Este archivo documenta la configuración que está funcionando correctamente en producción. 
> NO modifiques estos archivos sin hacer un backup completo primero.

## 📅 Estado Estable - Agosto 3, 2025

### ✅ Funcionalidades Confirmadas:
- ✅ Guest checkout (compras sin registro)
- ✅ Sitio 100% responsive en todos los dispositivos
- ✅ APIs funcionando correctamente
- ✅ Base de datos conectada y estable
- ✅ Deploy automático en Vercel

### 🔒 Archivos Protegidos (NO MODIFICAR):

#### Configuración de Base de Datos:
- `.env` (chmod 444) - DATABASE_URL con Session Pooler de Supabase
- `prisma/schema.prisma` (chmod 444) - Esquema con binary targets para Vercel
- `src/lib/prisma.ts` (chmod 444) - Cliente optimizado para serverless

#### Configuración de Deploy:
- `next.config.ts` (chmod 444) - Configuración de Next.js
- `vercel.json` (chmod 444) - Configuración de Vercel
- `package.json` - Dependencias estables

### 🌐 URLs de Producción:
- **Sitio Principal:** https://ambrosia-eosin.vercel.app
- **Deploy Actual:** https://ambrosia-nf69rse0p-danilos-projects-5ba356bd.vercel.app

### 🔧 Configuración Crítica:

#### Base de Datos (Supabase):
```
DATABASE_URL="postgresql://postgres.fmdnopkzeisopsohrzrq:D1001250120!@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
```
- **Pooler Type:** Session Pooler (puerto 5432)
- **Compatibilidad:** Prisma + Vercel Serverless

#### Prisma Schema:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl", "rhel-openssl-3.0.x"]
}
```

### 🆘 En Caso de Emergencia:

#### Restaurar Estado Estable:
```bash
git checkout stable-production-backup
git checkout -b emergency-restore
# Copiar archivos necesarios
git checkout main
git merge emergency-restore
```

#### Desproteger Archivos (solo si es absolutamente necesario):
```bash
chmod 644 .env
chmod 644 prisma/schema.prisma
chmod 644 src/lib/prisma.ts
chmod 644 next.config.ts
chmod 644 vercel.json
```

### 📋 Checklist Antes de Cambios:
- [ ] ¿Es realmente necesario modificar archivos protegidos?
- [ ] ¿He hecho un backup de la rama actual?
- [ ] ¿He probado en desarrollo antes de producción?
- [ ] ¿Tengo la URL de rollback lista?

### 🔄 Rama de Respaldo:
- **Branch:** `stable-production-backup`
- **Creado:** Agosto 3, 2025
- **Estado:** Funcionando perfectamente en producción

---
**IMPORTANTE:** Si necesitas hacer cambios críticos, usa siempre ramas de desarrollo y prueba exhaustivamente antes de merge a main.
