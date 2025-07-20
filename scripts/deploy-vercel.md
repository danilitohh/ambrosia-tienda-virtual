# 🚀 Guía de Despliegue en Vercel

## Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

## Paso 2: Iniciar sesión en Vercel
```bash
vercel login
```

## Paso 3: Desplegar el proyecto
```bash
vercel
```

## Paso 4: Configurar variables de entorno
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Agrega las siguientes variables:

### Variables requeridas:
- `NEXTAUTH_URL` = https://tu-proyecto.vercel.app
- `NEXTAUTH_SECRET` = ambrosia-super-secret-key-2024-change-in-production
- `DATABASE_URL` = tu-url-de-postgresql
- `GOOGLE_CLIENT_ID` = tu-google-client-id
- `GOOGLE_CLIENT_SECRET` = tu-google-client-secret
- `RESEND_API_KEY` = tu-resend-api-key
- `STRIPE_SECRET_KEY` = tu-stripe-secret-key
- `STRIPE_WEBHOOK_SECRET` = tu-stripe-webhook-secret

## Paso 5: Redesplegar con variables
```bash
vercel --prod
```

## Paso 6: Configurar dominio personalizado (opcional)
1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## Paso 7: Configurar Google Search Console
1. Ve a https://search.google.com/search-console
2. Agrega tu propiedad: https://tu-proyecto.vercel.app
3. Verifica la propiedad
4. Sube el sitemap: https://tu-proyecto.vercel.app/sitemap.xml

## Comandos útiles:
```bash
# Ver logs
vercel logs

# Redesplegar
vercel --prod

# Ver información del proyecto
vercel ls
``` 