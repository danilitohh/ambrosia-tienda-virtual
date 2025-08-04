// Test con emojis simples para WhatsApp
const mensaje = `Hola! 😊 Aqui esta mi pedido completo:

🛍️ MI PEDIDO ESPECIAL
📋 Productos seleccionados:
• 🍫 Brownie de chocolate x1 - $20.000
• 🍪 Galletas combo (x6) - $29.900

💰 Total a pagar: $49.900

📝 Numero de orden: AMB-20250803-85183

Gracias por elegirnos! 🙏`;

const mensajeCodificado = encodeURIComponent(mensaje);
const urlWhatsApp = `https://wa.me/573235924705?text=${mensajeCodificado}`;

console.log("Mensaje original:");
console.log(mensaje);
console.log("\nURL de WhatsApp:");
console.log(urlWhatsApp);
console.log("\nLongitud de la URL:", urlWhatsApp.length);

// Probar que la URL es válida
try {
  new URL(urlWhatsApp);
  console.log("✅ URL válida");
} catch (error) {
  console.log("❌ URL inválida:", error);
}
