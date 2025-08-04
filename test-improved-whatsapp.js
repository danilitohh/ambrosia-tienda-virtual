// Test del nuevo formato mejorado con emojis
const mensaje = `*Hola!* Aqui esta mi pedido completo:

*🛍️ MI PEDIDO ESPECIAL*
*📋 PRODUCTOS SELECCIONADOS:*
• 🍫 Brownie de chocolate x1 - $20.000
• 🍪 Galletas combo (x6) - $29.900

*💰 TOTAL A PAGAR*
$49.900

*📋 DATOS DEL PEDIDO*
Numero de orden: AMB-20250803-85183

*Gracias por elegirnos!* 🙏`;

console.log("Nuevo formato con emojis y negritas:");
console.log(mensaje);

// Test de detección de dispositivo
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
console.log("\nDetección móvil (simulado iPhone):", isMobile);

const isDesktop = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
console.log("Detección desktop (simulado Mac):", !isDesktop);

// URLs para diferentes dispositivos
const mensajeCodificado = encodeURIComponent(mensaje);
const mobileUrl = `whatsapp://send?phone=573235924705&text=${mensajeCodificado}`;
const webUrl = `https://wa.me/573235924705?text=${mensajeCodificado}`;

console.log("\nURL para móvil:", mobileUrl.substring(0, 100) + "...");
console.log("URL para web:", webUrl.substring(0, 100) + "...");
