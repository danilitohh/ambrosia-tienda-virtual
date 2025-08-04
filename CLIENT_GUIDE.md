# 🛍️ Guía del Cliente - Tienda Virtual Ambrosia

## 📋 Resumen del Proyecto

**Ambrosia** es una tienda virtual completa y moderna que incluye todas las funcionalidades necesarias para vender productos en línea. El proyecto está listo para ser entregado y desplegado.

### ✅ Funcionalidades Implementadas

- ✅ **Página Principal**: Diseño atractivo con hero section y categorías destacadas
- ✅ **Catálogo de Productos**: Página de productos con filtros y búsqueda
- ✅ **Carrito de Compras**: Funcionalidad completa de carrito
- ✅ **Proceso de Checkout**: Formularios de dirección y pago
- ✅ **Sistema de Autenticación**: Registro e inicio de sesión
- ✅ **Base de Datos**: Esquema completo con Prisma
- ✅ **Diseño Responsive**: Funciona en todos los dispositivos
- ✅ **Tema Oscuro**: Interfaz moderna y elegante
- ✅ **Integración de Pagos**: Configurado para Stripe
- ✅ **Sistema de Emails**: Configurado para Resend

## 🚀 Pasos para Poner en Producción

### 1. Configuración Inicial

1. **Clonar el repositorio** (si no lo tienes ya)
2. **Instalar dependencias**:
   ```bash
   npm install
   ```

### 2. Configurar Base de Datos

1. **Crear base de datos PostgreSQL**:
   - Usar servicios como: Supabase, Railway, Neon, o PostgreSQL local
   - Obtener la URL de conexión

2. **Configurar variables de entorno**:
   ```bash
   cp env.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales reales.

### 3. Configurar Servicios Externos

#### Stripe (Pagos)
1. Crear cuenta en [stripe.com](https://stripe.com)
2. Obtener claves de API (pública y secreta)
3. Configurar webhooks para tu dominio

#### Resend (Emails) - Opcional
1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio de email
3. Obtener API key

#### Google OAuth - Opcional
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto y habilitar Google+ API
3. Crear credenciales OAuth 2.0

### 4. Desplegar la Aplicación

#### Opción A: Vercel (Recomendado)
1. Conectar repositorio a [vercel.com](https://vercel.com)
2. Configurar variables de entorno en Vercel
3. Deploy automático

#### Opción B: Otros Proveedores
- **Netlify**: Compatible con Next.js
- **Railway**: Incluye PostgreSQL
- **DigitalOcean App Platform**
- **AWS Amplify**

### 5. Configurar Dominio

1. Comprar dominio (GoDaddy, Namecheap, etc.)
2. Configurar DNS para apuntar a tu proveedor de hosting
3. Actualizar `NEXTAUTH_URL` con tu dominio

## 🛠️ Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Ejecutar en producción
npm run start

# Poblar base de datos con datos de ejemplo
npm run seed

# Ver base de datos en navegador
npm run db:studio

# Actualizar esquema de base de datos
npm run db:push
```

## 📊 Estructura de Datos

### Productos
- Nombre, descripción, precio
- Imágenes múltiples
- Stock y SKU
- Categorías
- Precios de comparación (descuentos)

### Usuarios
- Información básica
- Roles (cliente/admin)
- Direcciones múltiples
- Historial de pedidos

### Pedidos
- Estado del pedido
- Información de pago
- Dirección de envío
- Items del pedido

## 🎨 Personalización

### Cambiar Colores
Editar `src/app/globals.css`:
```css
:root {
  --primary: #8b5cf6; /* Color principal */
  --background: #111827; /* Fondo oscuro */
}
```

### Cambiar Logo
Reemplazar el texto "Ambrosia" en:
- `src/app/page.tsx`
- `src/app/auth/signin/page.tsx`
- `src/app/auth/signup/page.tsx`

### Agregar Productos
1. Usar Prisma Studio: `npm run db:studio`
2. O crear API endpoints para gestión
3. O usar el script de seed como base

## 🔧 Configuración Avanzada

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://tudominio.com"
NEXTAUTH_SECRET="tu-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (opcional)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@tudominio.com"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Configurar Webhooks de Stripe

1. En el dashboard de Stripe, ir a Webhooks
2. Agregar endpoint: `https://tudominio.com/api/webhooks/stripe`
3. Seleccionar eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`

## 📱 Funcionalidades del Cliente

### Para Clientes
- ✅ Navegar productos
- ✅ Agregar al carrito
- ✅ Proceso de checkout
- ✅ Registro/inicio de sesión
- ✅ Historial de pedidos
- ✅ Gestión de direcciones

### Para Administradores
- ⚠️ Panel de administración (pendiente)
- ⚠️ Gestión de productos (pendiente)
- ⚠️ Gestión de pedidos (pendiente)

## 🚨 Consideraciones de Seguridad

1. **Nunca** subir `.env.local` al repositorio
2. Usar HTTPS en producción
3. Configurar CORS apropiadamente
4. Validar inputs en el servidor
5. Usar rate limiting para APIs

## 📈 Optimizaciones Recomendadas

### Performance
- Implementar caché con Redis
- Optimizar imágenes con Next.js Image
- Usar CDN para assets estáticos

### SEO
- Agregar meta tags dinámicos
- Implementar sitemap.xml
- Configurar robots.txt

### Analytics
- Integrar Google Analytics
- Configurar Facebook Pixel
- Implementar tracking de conversiones

## 🆘 Soporte y Mantenimiento

### Monitoreo
- Configurar alertas de error
- Monitorear performance
- Revisar logs regularmente

### Backups
- Configurar backups automáticos de la base de datos
- Mantener copias de seguridad del código
- Documentar cambios importantes

### Actualizaciones
- Mantener dependencias actualizadas
- Revisar cambios de Next.js
- Actualizar Prisma cuando sea necesario

## 📞 Contacto y Soporte

Para soporte técnico o preguntas sobre la implementación:

1. Revisar la documentación en `README.md`
2. Verificar la configuración de variables de entorno
3. Revisar logs de error
4. Contactar al desarrollador para soporte adicional

---

# Guía para usar la Tienda Virtual Ambrosia

## 1. ¿Cómo ingresar a la tienda?

- Abre tu navegador (Chrome, Safari, etc.).
- Escribe la dirección: https://ambrosia-eosin.vercel.app/
- Presiona Enter y espera a que cargue la página.

---

## 2. ¿Cómo comprar productos?

1. Explora los productos en la página principal.
2. Haz clic en el producto que te interesa para ver más detalles.
3. Haz clic en “Agregar al carrito” para añadirlo.
4. Cuando termines, haz clic en el ícono del carrito (arriba a la derecha).
5. Revisa tu pedido y haz clic en “Finalizar compra”.
6. Llena tus datos y confirma el pedido.
7. El administrador te contactará por WhatsApp o correo para confirmar el total y el envío.

---

## 3. ¿Cómo pagar y recibir tu pedido?

- Sigue las instrucciones que te dará el administrador (puede ser Nequi, Bancolombia, etc.).
- Recibe tu pedido en la dirección que diste.

---

## 4. ¿Cómo contactar al administrador?

- Usa el botón de WhatsApp en la página para enviar tus dudas o preguntas.
- También puedes responder al correo de confirmación.

---

## 5. ¿Cómo usar la sección de administración?

### Acceso

- Ve a la página de la tienda: https://ambrosia-eosin.vercel.app/
- Busca el botón o enlace para “Ingresar” o “Admin”.
- Ingresa tus credenciales de administrador:
  - **Correo:** admin@ambrosia.com
  - **Contraseña:** admin123

### Funciones principales

- **Editar productos:** Puedes cambiar el nombre, precio, descripción e imágenes de los productos.
- **Agregar nuevos productos:** Llena el formulario y sube las imágenes.
- **Eliminar productos:** Haz clic en el botón de eliminar junto al producto.
- **Editar información de la página:** Cambia textos, imágenes principales, anuncios y datos de contacto.
- **Ver pedidos:** Revisa los pedidos recibidos y su estado.

### ¿Cómo editar imágenes e información?

1. Ingresa como administrador.
2. Ve a la sección que quieres editar (productos, anuncios, datos de contacto, etc.).
3. Haz clic en el botón de “Editar” o “Modificar”.
4. Cambia la información o sube una nueva imagen.
5. Guarda los cambios.

---

## 6. ¿Qué hacer si olvidas tu contraseña de administrador?

- Usa la opción “Recuperar contraseña” en la página de ingreso.
- Sigue las instrucciones para restablecerla.

---

## 7. ¿Qué hacer si tienes dudas o problemas?

- Contacta al desarrollador o usa el botón de WhatsApp en la tienda.
- Revisa los correos de confirmación para información adicional.

---

¡Listo! Así puedes comprar y administrar la Tienda Virtual Ambrosia fácilmente.

---

## 🎉 ¡Tu Tienda Virtual Está Lista!

Con esta configuración, tendrás una tienda virtual completamente funcional con:

- ✅ Diseño profesional y moderno
- ✅ Funcionalidades completas de e-commerce
- ✅ Sistema de pagos seguro
- ✅ Base de datos robusta
- ✅ Código limpio y mantenible
- ✅ Documentación completa

**¡Disfruta vendiendo en línea con Ambrosia! 🛍️**