# Variables de Entorno para Netlify

## 🔧 Configuración Requerida

### **Base de Datos:**
```
DATABASE_URL=tu_url_de_postgresql_en_produccion
```

### **NextAuth:**
```
NEXTAUTH_URL=https://tu-dominio.netlify.app
NEXTAUTH_SECRET=tu_secret_muy_seguro
```

### **Proveedores de Autenticación:**
```
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### **Email (Resend):**
```
RESEND_API_KEY=tu_resend_api_key
EMAIL_FROM=noreply@tu-dominio.com
```

### **Stripe:**
```
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
```

## 📋 Pasos para Configurar:

1. **Ve a tu proyecto en Netlify**
2. **Settings > Environment variables**
3. **Agrega cada variable** con su valor correspondiente
4. **Re-deploy** el proyecto

## ⚠️ Importante:

- **Nunca subas** el archivo `.env` al repositorio
- **Usa URLs de producción** para la base de datos
- **Configura dominios** en NextAuth y proveedores
- **Verifica que todas las variables** estén configuradas 