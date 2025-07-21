# 🚀 Actualizar Variables de Entorno en Vercel

## **Variables que necesitas actualizar en Vercel:**

### **1. Ve a tu dashboard de Vercel:**
- Abre [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Selecciona tu proyecto "ambrosia"

### **2. Ve a Settings → Environment Variables:**
- En el menú lateral, haz clic en **Settings**
- Luego haz clic en **Environment Variables**

### **3. Actualiza estas variables:**

#### **DATABASE_URL (IMPORTANTE):**
```
postgresql://postgres.fmdnopkzeisopsohrzrq:Tr3scorazon!@aws-0-us-east-2.pooler.supabase.com:6543/postgres
```

#### **NEXTAUTH_URL:**
```
https://tu-dominio.vercel.app
```

#### **NEXTAUTH_SECRET:**
```
tu-secret-actual
```

### **4. Haz clic en "Save" y luego "Redeploy":**
- Después de guardar las variables
- Ve a **Deployments**
- Haz clic en **"Redeploy"** en el último deployment

## **✅ Verificación:**
- La aplicación debería funcionar correctamente con Supabase
- Los productos y categorías deberían aparecer
- El carrito y checkout deberían funcionar

## **🔧 Si hay problemas:**
1. Verifica que todas las variables estén correctas
2. Asegúrate de que el proyecto de Supabase esté activo
3. Revisa los logs de Vercel para errores 