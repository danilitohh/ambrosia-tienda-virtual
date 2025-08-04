// Test final del mensaje de WhatsApp sin emojis
const mensaje = `Hola! Aqui esta mi pedido completo:

*** MI PEDIDO ESPECIAL ***
PRODUCTOS SELECCIONADOS:
- [BROWNIE] Brownie de chocolate x1 - $20.000
- [GALLETA] Galletas combo (x6) - $29.900

*** TOTAL A PAGAR ***
$49.900

*** DATOS DEL PEDIDO ***
Numero de orden: AMB-20250803-85183

Gracias por elegirnos!`;

const urlWhatsApp = `https://wa.me/573235924705?text=${encodeURIComponent(mensaje)}`;

console.log("Mensaje final:");
console.log(mensaje);
console.log("\nURL de WhatsApp:");
console.log(urlWhatsApp);
console.log("\nLongitud:", urlWhatsApp.length);

// Verificar que funciona
try {
  new URL(urlWhatsApp);
  console.log("✅ URL válida - Lista para WhatsApp");
} catch (error) {
  console.log("❌ Error:", error);
}
