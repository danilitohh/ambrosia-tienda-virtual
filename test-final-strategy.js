// Test de la solución final sin emojis en URL
const mensajeSinEmojis = `*Hola!* Aqui esta mi pedido completo:

*MI PEDIDO ESPECIAL*
*PRODUCTOS SELECCIONADOS:*
• [BROWNIE] Brownie de chocolate x1 - $20.000
• [GALLETA] Galletas combo (x6) - $29.900

*TOTAL A PAGAR*
$49.900

*DATOS DEL PEDIDO*
Numero de orden: AMB-20250803-85183

*Gracias por elegirnos!*`;

const mensajeConEmojis = `🛍️ MI PEDIDO ESPECIAL 🛍️
📋 PRODUCTOS SELECCIONADOS:
• 🍫 Brownie de chocolate x1 - $20.000
• 🍪 Galletas combo (x6) - $29.900

💰 TOTAL: $49.900
📋 Orden: AMB-20250803-85183
🙏 ¡Gracias por elegirnos!`;

console.log("=== ESTRATEGIA FINAL ===");
console.log("\n1. MENSAJE PARA URL (sin emojis):");
console.log(mensajeSinEmojis);

console.log("\n2. MENSAJE PARA COPIAR (con emojis):");
console.log(mensajeConEmojis);

console.log("\n3. URL WHATSAPP:");
const url = `https://wa.me/573235924705?text=${encodeURIComponent(mensajeSinEmojis)}`;
console.log(url);

console.log("\n4. FLUJO:");
console.log("   1. Abrir WhatsApp con mensaje sin emojis");
console.log("   2. Ofrecer copiar versión con emojis");
console.log("   3. Usuario pega mensaje bonito en WhatsApp");

console.log("\n✅ Estrategia: URL limpia + emojis por clipboard");
