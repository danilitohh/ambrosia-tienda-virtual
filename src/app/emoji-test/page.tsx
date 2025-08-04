"use client";

import { useState } from "react";
import { useCart } from "../../components/providers/cart-provider";

export default function EmojiTest() {
  const [resultado, setResultado] = useState<string>("");
  // Obtener productos y total del carrito real
  const { items, total } = useCart();
  // Obtener el orderId generado en checkout si está disponible
  // Puedes pasar el orderId como prop o desde contexto global si lo tienes
  // Ejemplo: const { orderId } = useCart();
  // Si no existe, mostrar uno temporal:
  const orderId =
    typeof window !== "undefined" && window.localStorage.getItem("orderId")
      ? window.localStorage.getItem("orderId")
      : "SIN-ORDEN";

  const probarEmojis = () => {
    // Calcular subtotal
    const subtotal = total;
    // Generar lista de productos
    const productosTexto = items
      .map(
        (item, idx) =>
          `[${idx + 1}] ${item.name} x${item.quantity}\n    Precio ................. $${(
            item.price * item.quantity
          ).toLocaleString("es-CO")}`
      )
      .join("\n\n");
    const mensaje = `>>> *¡QUIERO CONFIRMAR MI PEDIDO!* <<<\n\n*Orden: ${orderId}*\n\n*=== PRODUCTOS SELECCIONADOS ===*\n\n${productosTexto}\n\n*=== RESUMEN FINANCIERO ===*\nSubtotal .................. $${subtotal.toLocaleString(
      "es-CO"
    )}\nDescuentos ................ $0.000\n*TOTAL PARCIAL ............ $${subtotal.toLocaleString(
      "es-CO"
    )}*\n*El valor del domicilio será confirmado por el equipo Ambrosia.*\n\n*Por favor confírmame el valor del domicilio para completar mi pago.*\n\n********************************\n        *AMBROSIA BHANG*\n   Tu compra será confirmada en breve 🍬\n********************************`;

    console.log("Mensaje original:", mensaje);

    const codificado = encodeURIComponent(mensaje);
    console.log("Mensaje codificado:", codificado);

    const url = `https://wa.me/573235924705?text=${codificado}`;
    console.log("URL completa:", url);

    setResultado(`
Mensaje original:
${mensaje}

URL codificada:
${url}

Longitud original: ${mensaje.length}
Longitud URL: ${url.length}
    `);

    // Intentar abrir WhatsApp
    try {
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const copiarMensaje = async () => {
    const mensaje = `🛍️ PEDIDO ESPECIAL 🛍️
📋 Productos:
• 🍫 Brownie - $20.000
• 🍪 Galletas - $29.900
💰 Total: $49.900
🙏 Gracias!`;

    try {
      await navigator.clipboard.writeText(mensaje);
      alert("✅ Mensaje copiado al portapapeles!");
    } catch (error) {
      console.error("Error copiando:", error);
      alert("❌ Error al copiar");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">🧪 Test de Emojis WhatsApp</h1>

        <div className="space-y-4">
          <button
            onClick={probarEmojis}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            🚀 Probar WhatsApp con Emojis
          </button>

          <button
            onClick={copiarMensaje}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
          >
            📋 Copiar Mensaje de Prueba
          </button>

          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold">Emojis de prueba:</h3>
            <div className="text-2xl mt-2">
              😊 🛍️ 📋 🍫 🍪 🍬 🧁 💰 🎟️ 💝 🙏
            </div>
          </div>

          {resultado && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">Resultado:</h3>
              <pre className="text-xs mt-2 whitespace-pre-wrap">{resultado}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
