// Diagnóstico completo de WhatsApp y emojis
console.log("=== DIAGNÓSTICO WHATSAPP & EMOJIS ===\n");

// 1. Verificar soporte de emojis
console.log("1. SOPORTE DE EMOJIS:");
const testEmojis = ["😊", "🛍️", "📋", "🍫", "🍪", "💰", "🙏"];
testEmojis.forEach(emoji => {
  console.log(`   ${emoji} - Código: ${emoji.codePointAt(0)?.toString(16)}`);
});

// 2. Verificar codificación UTF-8
console.log("\n2. CODIFICACIÓN UTF-8:");
const mensajeTest = "*Hola!* 😊 Pedido: 🛍️ Total: 💰";
console.log("   Mensaje original:", mensajeTest);
console.log("   URL encoded:", encodeURIComponent(mensajeTest));
console.log("   Longitud original:", mensajeTest.length);
console.log("   Longitud codificada:", encodeURIComponent(mensajeTest).length);

// 3. Verificar APIs del navegador
console.log("\n3. APIS DEL NAVEGADOR:");
console.log("   navigator.userAgent:", navigator?.userAgent || "N/A");
console.log("   window.open disponible:", typeof window?.open === 'function');
console.log("   encodeURIComponent disponible:", typeof encodeURIComponent === 'function');

// 4. Probar diferentes formatos de emoji
console.log("\n4. FORMATOS DE EMOJI:");

// Formato Unicode directo
const unicodeDirect = "\u{1F60A} \u{1F6CD} \u{1F4CB}";
console.log("   Unicode directo:", unicodeDirect);

// Formato HTML entities
const htmlEntities = "&#128522; &#128717; &#128203;";
console.log("   HTML entities:", htmlEntities);

// Formato texto con códigos
const textCodes = ":smile: :shopping_bags: :clipboard:";
console.log("   Códigos de texto:", textCodes);

// 5. URLs de WhatsApp
console.log("\n5. URLS WHATSAPP:");

const mensajeSimple = "Hola! Este es un pedido de prueba";
const mensajeConEmojis = "Hola! 😊 Este es un pedido 🛍️ de prueba 💰";

console.log("   Sin emojis:", `https://wa.me/573235924705?text=${encodeURIComponent(mensajeSimple)}`);
console.log("   Con emojis:", `https://wa.me/573235924705?text=${encodeURIComponent(mensajeConEmojis)}`);

// 6. Alternativas de formato
console.log("\n6. ALTERNATIVAS DE FORMATO:");

const formato1 = "*Pedido:* Sin emojis - Total: $49.900";
const formato2 = "PEDIDO: [CHOCOLATE] Brownie - Total: $49.900";
const formato3 = "🎯 PEDIDO 🎯\n📦 PRODUCTOS 📦\n💵 TOTAL: $49.900";

console.log("   Formato 1 (asteriscos):", formato1);
console.log("   Formato 2 (corchetes):", formato2);
console.log("   Formato 3 (emojis básicos):", formato3);

console.log("\n=== FIN DIAGNÓSTICO ===");
