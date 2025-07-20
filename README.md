# 🚀 Ambrosia - Tienda Virtual

Una tienda virtual moderna y escalable construida con Next.js 15, TypeScript, Tailwind CSS, Prisma, NextAuth.js, Stripe y Resend, optimizada para alto rendimiento.

## 🚀 Características

- **Diseño Moderno**: Interfaz oscura y elegante con Tailwind CSS
- **Autenticación Completa**: NextAuth.js con Google OAuth y autenticación por email
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Pagos Seguros**: Integración con Stripe para procesamiento de pagos
- **Emails**: Envío de emails con Resend
- **Carrito de Compras**: Funcionalidad completa de carrito
- **Gestión de Productos**: CRUD completo para productos y categorías
- **Responsive**: Diseño completamente responsive
- **SEO Optimizado**: Meta tags y estructura optimizada

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Emails**: Resend
- **Iconos**: Lucide React
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL
- Cuenta de Stripe
- Cuenta de Resend (opcional para emails)
- Cuenta de Google OAuth (opcional)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd ambrosia
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ambrosia"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-nextauth-secret-key"

   # Google OAuth (opcional)
   GOOGLE_CLIENT_ID="tu-google-client-id"
   GOOGLE_CLIENT_SECRET="tu-google-client-secret"

   # Email (Resend)
   RESEND_API_KEY="tu-resend-api-key"
   EMAIL_FROM="noreply@tudominio.com"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_tu-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="pk_test_tu-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="whsec_tu-stripe-webhook-secret"
   ```

4. **Configurar la base de datos**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
ambrosia/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── cart/              # Página del carrito
│   │   ├── checkout/          # Página de checkout
│   │   ├── products/          # Páginas de productos
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes reutilizables
│   │   ├── providers/         # Providers de contexto
│   │   └── ui/                # Componentes de UI
│   └── lib/                   # Utilidades y configuraciones
│       ├── auth.ts            # Configuración de NextAuth
│       ├── prisma.ts          # Cliente de Prisma
│       ├── stripe.ts          # Configuración de Stripe
│       ├── email.ts           # Configuración de emails
│       └── utils.ts           # Utilidades generales
├── prisma/
│   └── schema.prisma          # Esquema de la base de datos
├── public/                    # Archivos estáticos
└── package.json
```

## 🗄️ Base de Datos

El proyecto incluye un esquema completo de base de datos con las siguientes entidades:

- **Users**: Usuarios del sistema
- **Products**: Productos de la tienda
- **Categories**: Categorías de productos
- **Orders**: Órdenes de compra
- **OrderItems**: Items de las órdenes
- **CartItems**: Items del carrito
- **Addresses**: Direcciones de envío
- **Reviews**: Reseñas de productos

## 🔐 Autenticación

El sistema incluye múltiples métodos de autenticación:

- **Google OAuth**: Inicio de sesión con Google
- **Email/Password**: Registro e inicio de sesión tradicional
- **Email Magic Links**: Envío de enlaces mágicos por email

## 💳 Pagos

Integración completa con Stripe:

- Procesamiento de tarjetas de crédito
- Webhooks para actualización de estados
- Manejo de pagos fallidos
- Reembolsos automáticos

## 📧 Emails

Sistema de emails con Resend:

- Confirmación de pedidos
- Actualización de estados
- Recuperación de contraseñas
- Notificaciones importantes

## 🎨 Personalización

### Colores y Tema

El proyecto usa un tema oscuro por defecto. Para personalizar:

1. Edita `src/app/globals.css`
2. Modifica las variables de color en Tailwind
3. Actualiza los componentes según necesites

### Formato de Hora

El sistema usa formato de 12 horas por defecto. Las funciones de formateo están en `src/lib/utils.ts`.

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🔧 Configuración Adicional

### Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Agrega tu dominio a las URLs autorizadas

### Stripe

1. Crea una cuenta en [Stripe](https://stripe.com/)
2. Obtén tus claves de API
3. Configura webhooks para tu dominio
4. Prueba con tarjetas de prueba

### Resend

1. Crea una cuenta en [Resend](https://resend.com/)
2. Verifica tu dominio
3. Obtén tu API key
4. Configura el remitente de emails

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

- [ ] Panel de administración
- [ ] Sistema de cupones
- [ ] Wishlist
- [ ] Búsqueda avanzada
- [ ] Filtros de productos
- [ ] Sistema de notificaciones push
- [ ] App móvil
- [ ] Múltiples idiomas
- [ ] Múltiples monedas

---

**¡Disfruta construyendo tu tienda virtual con Ambrosia! 🛍️**
