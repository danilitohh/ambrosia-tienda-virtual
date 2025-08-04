// Test con códigos Unicode y símbolos alternativos
const mensaje = `¡Hola! Aquí está mi pedido completo:

=== MI PEDIDO ESPECIAL ===
PRODUCTOS SELECCIONADOS:
• [CHOCOLATE] Brownie de chocolate x1 - $20.000
• [GALLETA] Galletas combo (x6) - $29.900

TOTAL A PAGAR: $49.900

NUMERO DE ORDEN: AMB-20250803-85183

¡Gracias por elegirnos!`;

console.log("Mensaje con símbolos alternativos:");
console.log(mensaje);

// También probemos con emojis que funcionan mejor en WhatsApp
const mensajeConEmojis = `Hola! Aqui esta mi pedido completo:

*** MI PEDIDO ESPECIAL ***
Productos seleccionados:
- Brownie de chocolate x1 - $20.000
- Galletas combo (x6) - $29.900

Total a pagar: $49.900

Numero de orden: AMB-20250803-85183

Gracias por elegirnos!`;

console.log("\nMensaje alternativo:");
console.log(mensajeConEmojis);

const urlWhatsApp = `https://wa.me/573235924705?text=${encodeURIComponent(mensajeConEmojis)}`;
console.log("\nURL de WhatsApp:");
console.log(urlWhatsApp);
