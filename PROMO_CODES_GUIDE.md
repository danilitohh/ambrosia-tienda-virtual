# 🎫 Sistema de Códigos Promocionales - Ambrosia

## 📋 Descripción General

El sistema de códigos promocionales permite a los administradores crear descuentos por porcentaje que se aplican a productos específicos cuando se cumple una cantidad mínima de compra.

### 🎯 Características Principales

- **Descuentos por porcentaje** (1% - 100%)
- **Productos específicos** - Cada código aplica solo a un producto
- **Cantidad mínima** - Requiere comprar una cantidad mínima del producto
- **Límite de usos** - Opcional, para controlar el número de veces que se puede usar
- **Fecha de expiración** - Opcional, para códigos temporales
- **Validación en tiempo real** - Se valida al aplicar en el carrito

## 🗄️ Estructura de la Base de Datos

### Modelo PromoCode

```prisma
model PromoCode {
  id              String    @id @default(cuid())
  code            String    @unique                    // Código único (ej: BROWNIE10)
  description     String                               // Descripción del descuento
  discountPercent Int                                  // Porcentaje de descuento (10 = 10%)
  productId       String                               // Producto específico
  minQuantity     Int                                  // Cantidad mínima requerida
  maxUses         Int?                                 // Máximo número de usos (null = ilimitado)
  usedCount       Int       @default(0)               // Contador de usos
  isActive        Boolean   @default(true)            // Estado activo/inactivo
  expiresAt       DateTime?                           // Fecha de expiración
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  product         Product   @relation(fields: [productId], references: [id])
  orders          Order[]   @relation("PromoCodeOrders")
}
```

## 🔧 API Endpoints

### 1. Crear Código Promocional (Admin)
```
POST /api/admin/promo-codes
```

**Body:**
```json
{
  "code": "BROWNIE10",
  "description": "10% de descuento en Brownie de Chocolate x3",
  "discountPercent": 10,
  "productId": "product-id",
  "minQuantity": 3,
  "maxUses": 100,
  "expiresAt": "2025-08-15T00:00:00Z"
}
```

### 2. Listar Códigos Promocionales (Admin)
```
GET /api/admin/promo-codes
```

### 3. Eliminar Código Promocional (Admin)
```
DELETE /api/admin/promo-codes/{id}
```

### 4. Validar Código Promocional (Cliente)
```
POST /api/promo-codes/validate
```

**Body:**
```json
{
  "code": "BROWNIE10",
  "cartItems": [
    {
      "productId": "product-id",
      "quantity": 3
    }
  ]
}
```

**Response (válido):**
```json
{
  "valid": true,
  "promoCode": {
    "id": "promo-id",
    "code": "BROWNIE10",
    "description": "10% de descuento en Brownie de Chocolate x3",
    "discountPercent": 10,
    "productName": "Brownie de chocolate x2",
    "minQuantity": 3,
    "discountAmount": 9900
  }
}
```

**Response (inválido):**
```json
{
  "error": "Se requieren al menos 3 unidades de Brownie de chocolate x2"
}
```

## 🎨 Interfaz de Usuario

### Panel de Administración

**Ruta:** `/admin/promo-codes`

**Funcionalidades:**
- ✅ Crear nuevos códigos promocionales
- ✅ Ver lista de códigos existentes
- ✅ Eliminar códigos promocionales
- ✅ Ver estadísticas de uso

### Carrito de Compras

**Funcionalidades:**
- ✅ Campo para ingresar código promocional
- ✅ Validación en tiempo real
- ✅ Mostrar descuento aplicado
- ✅ Opción para remover código
- ✅ Mensajes de error descriptivos

### Checkout

**Funcionalidades:**
- ✅ Mostrar descuento en resumen de compra
- ✅ Calcular total con descuento aplicado

## 📝 Ejemplo de Uso

### Escenario: Descuento en Brownie de Chocolate

1. **Producto:** Brownie de chocolate x2
2. **Precio original:** $33,000
3. **Código promocional:** BROWNIE10
4. **Condiciones:** 10% de descuento al comprar 3 o más unidades

**Cálculo:**
- Cantidad mínima: 3 unidades
- Precio total sin descuento: $33,000 × 3 = $99,000
- Descuento: $99,000 × 10% = $9,900
- **Precio final:** $99,000 - $9,900 = $89,100

## 🚀 Scripts de Prueba

### Crear Código Promocional de Ejemplo
```bash
npx tsx scripts/create-promo-code.ts
```

### Probar Validación
```bash
npx tsx scripts/test-promo-code.ts
```

## 🔍 Validaciones Implementadas

### Al Crear Código
- ✅ Código único
- ✅ Porcentaje entre 1-100%
- ✅ Cantidad mínima ≥ 1
- ✅ Producto existe
- ✅ Fecha de expiración válida

### Al Validar Código
- ✅ Código existe
- ✅ Código activo
- ✅ No ha expirado
- ✅ No excede límite de usos
- ✅ Producto está en el carrito
- ✅ Cantidad mínima cumplida

### Al Aplicar Descuento
- ✅ Cálculo correcto del descuento
- ✅ Actualización del total
- ✅ Persistencia en el carrito

## 🎯 Casos de Uso Comunes

### 1. Promoción de Lanzamiento
- **Código:** NEWPRODUCT20
- **Descuento:** 20%
- **Producto:** Producto nuevo
- **Cantidad:** 1
- **Límite:** 50 usos
- **Expiración:** 7 días

### 2. Descuento por Volumen
- **Código:** BULK15
- **Descuento:** 15%
- **Producto:** Cualquier producto
- **Cantidad:** 5
- **Límite:** Sin límite
- **Expiración:** Sin expiración

### 3. Promoción Temporal
- **Código:** FLASH25
- **Descuento:** 25%
- **Producto:** Productos seleccionados
- **Cantidad:** 2
- **Límite:** 100 usos
- **Expiración:** 24 horas

## 🔧 Configuración Técnica

### Variables de Entorno
No se requieren variables adicionales para el sistema de códigos promocionales.

### Dependencias
- Prisma (ya incluido)
- NextAuth (ya incluido)
- React (ya incluido)

### Migraciones
```bash
npx prisma migrate dev --name add-promo-codes
```

## 🐛 Solución de Problemas

### Error: "Código promocional no válido"
- Verificar que el código existe
- Verificar que está activo
- Verificar que no ha expirado

### Error: "Se requieren al menos X unidades"
- Agregar más unidades del producto específico al carrito
- Verificar que es el producto correcto

### Error: "Este código aplica solo para [Producto]"
- Agregar el producto específico al carrito
- Remover otros productos si es necesario

### Error: "Código promocional agotado"
- El código ha alcanzado su límite de usos
- Contactar al administrador

## 📈 Próximas Mejoras

### Funcionalidades Futuras
- [ ] Códigos promocionales por categoría
- [ ] Descuentos por monto fijo
- [ ] Códigos de primer compra
- [ ] Códigos por email específico
- [ ] Estadísticas de uso detalladas
- [ ] Exportar reportes de códigos
- [ ] Códigos promocionales automáticos
- [ ] Integración con sistema de puntos

### Optimizaciones
- [ ] Cache de códigos promocionales
- [ ] Validación en el servidor
- [ ] Rate limiting para validaciones
- [ ] Logs de uso de códigos

## 📞 Soporte

Para dudas o problemas con el sistema de códigos promocionales:

1. Revisar este documento
2. Verificar los logs del servidor
3. Probar con los scripts de ejemplo
4. Contactar al equipo de desarrollo

---

**Versión:** 1.0.0  
**Última actualización:** Julio 2025  
**Desarrollado por:** Equipo Ambrosia 