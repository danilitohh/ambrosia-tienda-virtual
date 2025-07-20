# Ambrosia Bhang - Tienda Virtual

Tienda virtual especializada en brownies y chocolates artesanales en Medellín, Colombia.

## 🍫 Características

- **Productos Artesanales**: Brownies de chocolate, trufas, galletas y más
- **Envío a Domicilio**: Cobertura en Medellín y Antioquia
- **Pagos Seguros**: Integración con Stripe
- **Panel de Administración**: Gestión completa de productos y pedidos
- **SEO Optimizado**: Configurado para Google y motores de búsqueda

## 🚀 Optimización SEO

### Configuraciones Implementadas

- ✅ **Metadatos dinámicos** para cada página y producto
- ✅ **Sitemap XML** generado automáticamente
- ✅ **Robots.txt** configurado
- ✅ **Open Graph** y **Twitter Cards** para redes sociales
- ✅ **URLs canónicas** para evitar contenido duplicado
- ✅ **Estructura de datos** optimizada para Google

### Archivos SEO

- `src/app/layout.tsx` - Metadatos globales
- `src/app/sitemap.ts` - Sitemap dinámico
- `public/robots.txt` - Instrucciones para crawlers
- `src/app/api/sitemap/route.ts` - API para sitemap XML

### Variables de Entorno Requeridas

```env
# Google Search Console
GOOGLE_VERIFICATION=tu-codigo-de-verificacion

# URL del sitio
NEXTAUTH_URL=https://tu-dominio.netlify.app
```

## 📱 Tecnologías

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL con Prisma
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Emails**: Resend
- **Deploy**: Netlify

## 🔧 Instalación

```bash
npm install
npm run dev
```

## 📊 Google Analytics y Search Console

1. **Google Search Console**:
   - Agrega tu dominio
   - Verifica la propiedad
   - Sube el sitemap: `https://tu-dominio.netlify.app/sitemap.xml`

2. **Google Analytics**:
   - Configura GA4
   - Agrega el código de seguimiento

3. **Optimización Continua**:
   - Monitorea el rendimiento en Search Console
   - Optimiza contenido basado en keywords
   - Mejora la velocidad de carga

## 🌟 Características SEO

- **Títulos optimizados** para cada página
- **Descripciones meta** atractivas
- **Keywords relevantes** para brownies y chocolates
- **Imágenes optimizadas** con alt text
- **URLs amigables** para SEO
- **Contenido estructurado** para rich snippets

## 📈 Métricas a Monitorear

- Posicionamiento en Google
- Tráfico orgánico
- Tiempo de carga
- Tasa de rebote
- Conversiones

---

Desarrollado con ❤️ para Ambrosia Bhang
