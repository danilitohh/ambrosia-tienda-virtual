"use client";

import { useState, useEffect } from "react";
import { sendEmail } from "@/lib/email";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";
import Image from "next/image";
import WhatsAppMessageModal from "@/components/whatsapp-message-modal";
import { Dialog } from "@headlessui/react";

const NEQUI_NUMERO = "3043013144";
const WHATSAPP_NUM = "573235924705"; // +57 323 5924705

function generarNumeroOrden() {
  const fecha = new Date();
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `AMB-${y}${m}${d}-${rand}`;
}

export default function CustomCheckout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, total, appliedPromoCode, discount } = useCart();

  // Redirigir si no está autenticado
  if (status === "loading") return null;
  if (!session) {
    if (typeof window !== "undefined") router.replace("/auth/signin");
    return null;
  }

  const [step, setStep] = useState<"form" | "pago">("form");
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    telefono: "",
    email: "",
  });
  const [orderId, setOrderId] = useState<string>("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [propina, setPropina] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
    bancolombiaCuenta: "12345678901",
    bancolombiaQr: null as string | null,
    nequiNumber: NEQUI_NUMERO,
  });
  const [showShippingModal, setShowShippingModal] = useState(true);

  // Cargar configuración de pagos
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setPaymentSettings({
            bancolombiaCuenta: data.bancolombiaCuenta || "12345678901",
            bancolombiaQr: data.bancolombiaQr,
            nequiNumber: data.nequiNumber || NEQUI_NUMERO,
          });
        }
      } catch (error) {
        console.error("Error cargando configuración de pagos:", error);
      }
    };

    loadPaymentSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orden = generarNumeroOrden();
    setOrderId(orden);
    setStep("pago");
    setEnviando(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "ambrosiabhangg@gmail.com",
          subject: `Datos de envío - Orden ${orden}`,
          html: `<h2>Nuevo pedido recibido</h2>
            <p>El cliente ha completado el formulario de datos de envío.</p>
            <h3>Datos de envío:</h3>
            <ul>
              <li><b>Nombre:</b> ${form.nombre}</li>
              <li><b>Dirección:</b> ${form.direccion}</li>
              <li><b>Ciudad:</b> ${form.ciudad}</li>
              <li><b>Departamento:</b> ${form.departamento}</li>
              <li><b>Teléfono:</b> ${form.telefono}</li>
              <li><b>Email:</b> ${form.email}</li>
              <li><b>Número de orden:</b> ${orden}</li>
            </ul>`
        }),
      });
      const data = await res.json();
      setEnviado(data.success);
    } catch {
      setEnviado(false);
    } finally {
      setEnviando(false);
    }
  };



  const enviarMensajeWhatsApp = async () => {
    // Solo mostrar el modal de WhatsApp, NO enviar correo
    setShowWhatsAppModal(true);
  };





  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {/* Modal de Costo de Envío */}
      <Dialog open={showShippingModal && step === "form"} onClose={() => setShowShippingModal(false)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
        <div className="relative bg-[#181818] rounded-lg p-8 max-w-sm mx-auto border-2 border-[#C6FF00] text-center">
          <Dialog.Title className="text-xl font-bold text-[#C6FF00] mb-2">Costo de envío</Dialog.Title>
          <Dialog.Description className="mb-4 text-white">
            El costo de envío <b>varía depende de la zona</b>.<br />
            <span className="text-[#C6FF00]">El valor exacto se te informará por WhatsApp después de tu compra.</span>
          </Dialog.Description>
          <button
            onClick={() => setShowShippingModal(false)}
            className="mt-2 px-6 py-2 bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold rounded-lg"
          >
            Entendido
          </button>
        </div>
      </Dialog>
      <div className="w-full max-w-md">
        {step === "form" ? (
          <>
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="mb-6 w-full border border-[#C6FF00] text-[#C6FF00] font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-[#C6FF00] hover:text-black"
            >
              Volver al carrito
            </button>
            <form onSubmit={handleSubmit} className="bg-[#181818] p-8 rounded-lg shadow-lg w-full space-y-4">
              <h1 className="text-2xl font-bold mb-4">Datos de envío</h1>
              <input name="nombre" required placeholder="Nombre completo" value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]" />
              <input name="direccion" required placeholder="Dirección" value={form.direccion} onChange={handleChange} className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]" />
              <input name="ciudad" required placeholder="Ciudad" value={form.ciudad} onChange={handleChange} className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]" />
              <input name="departamento" required placeholder="Departamento" value={form.departamento} onChange={handleChange} className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]" />
              <input name="telefono" required placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]" />
              <input name="email" required type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]" />
              <button type="submit" className="w-full bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-8 rounded-lg transition-colors mt-6" disabled={enviando}>{enviando ? "Enviando..." : "Continuar al pago"}</button>
              {enviado && <p className="text-green-400 text-center mt-2">¡Correo enviado correctamente!</p>}
            </form>
          </>
        ) : (
          <div className="bg-[#181818] p-8 rounded-lg shadow-lg w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-[#C6FF00]">Instrucciones de pago</h1>
            {/* Resumen de compra */}
            <div className="mb-6 w-full">
              <h2 className="text-lg font-semibold mb-2 text-[#C6FF00]">Resumen de tu compra</h2>
              <ul className="mb-2 text-sm">
                {items.map(item => {
                  let nombre = item.name;
                  // Eliminar la palabra 'chocolate' de los brownies
                  if (nombre.toLowerCase().includes('brownie')) {
                    nombre = nombre.replace(/chocolate/gi, '').replace(/\s+/g, ' ').trim();
                  }
                  let cantidad = '';
                  // Si el nombre ya contiene 'de x2', 'de x3', etc., no agregar cantidad
                  if (/de x\d+/i.test(nombre)) {
                    cantidad = '';
                  } else if (nombre.toLowerCase().includes('brownie')) {
                    cantidad = item.quantity > 1 ? `combo (x${item.quantity})` : 'x1';
                  } else if (nombre.toLowerCase().includes('galleta')) {
                    cantidad = 'combo (x6)';
                  } else if (nombre.toLowerCase().includes('trufa')) {
                    cantidad = 'combo (x6)';
                  } else if (nombre.toLowerCase().includes('chocolate')) {
                    cantidad = 'combo (x8)';
                  } else {
                    cantidad = `x${item.quantity}`;
                  }
                  return (
                    <li key={item.id} className="flex justify-between border-b border-gray-700 py-1">
                      <span>{nombre}{cantidad ? ' ' + cantidad : ''}</span>
                      <span>{(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{(total + discount).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
              </div>
              {appliedPromoCode && (
                <div className="flex justify-between py-1 text-green-400">
                  <span>Descuento ({appliedPromoCode.code})</span>
                  <span>-{discount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </div>
              )}
              <div className="flex justify-between py-1 items-center">
                <span>Propina (opcional)</span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={propina}
                  onChange={e => setPropina(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-right focus:outline-none focus:ring-2 focus:ring-[#C6FF00] ml-2"
                  style={{ background: '#23272a' }}
                />
              </div>
              <div className="flex justify-between font-bold">
                <span>Total a pagar:</span>
                <span>{total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
              </div>
              <div className="text-center text-yellow-400 text-sm mt-2">
                * El valor del domicilio no está incluido. Te informaremos el costo exacto por WhatsApp.
              </div>
            </div>
            {paymentSettings.bancolombiaQr && (
              <div className="mb-4 p-4 bg-[#23272a] rounded-lg border border-[#C6FF00] text-center">
                <span className="block text-[#C6FF00] font-semibold mb-2">Escanea el QR para pagar con Bancolombia</span>
                <div className="flex justify-center">
                  <Image
                    src={paymentSettings.bancolombiaQr}
                    alt="QR Bancolombia"
                    width={200}
                    height={200}
                    className="rounded-lg border border-gray-600"
                  />
                </div>
              </div>
            )}
            <p className="mb-4 text-center text-white">Realiza la transferencia a través de uno de los siguientes métodos:</p>
            <div className="mb-4 w-full">
              <div className="bg-[#23272a] rounded p-3 mb-2">
                <span className="block text-gray-400 text-xs">Cuenta Bancolombia</span>
                <span className="font-bold text-lg text-white">{paymentSettings.bancolombiaCuenta}</span>
              </div>
              <div className="bg-[#23272a] rounded p-3">
                <span className="block text-gray-400 text-xs">Nequi</span>
                <span className="font-bold text-lg text-white">{paymentSettings.nequiNumber}</span>
              </div>
            </div>
            <div className="mb-4 w-full text-center">
              <span className="block text-gray-400 text-xs mb-1">Número de orden</span>
              <span className="font-bold text-2xl text-[#C6FF00]">{orderId}</span>
            </div>
            <button
              onClick={enviarMensajeWhatsApp}
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] text-black font-bold py-3 px-6 rounded-lg transition-colors text-center mb-4"
            >
              Enviar pedido completo por WhatsApp
            </button>
            
            <p className="text-sm text-gray-300 mb-4 text-center">
              Al hacer clic se mostrará el mensaje completo de tu pedido para copiar y enviar por WhatsApp.
              <br />
              Después de transferir, envía el comprobante para procesar tu pedido.
            </p>
            <a href="/" className="mt-4 text-[#C6FF00] hover:text-[#b2e600] underline">Volver al inicio</a>
          </div>
        )}
      </div>

      {/* Modal de WhatsApp */}
      <WhatsAppMessageModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        message={`¡Hola! 😊 Aquí está mi pedido completo:

🛒 MI PEDIDO ESPECIAL
🍪 Productos seleccionados:
${items.map(item => {
  let nombre = item.name;
  if (nombre.toLowerCase().includes('brownie')) {
    nombre = nombre.replace(/chocolate/gi, '').replace(/\s+/g, ' ').trim();
  }
  let cantidad = '';
  if (/de x\d+/i.test(nombre)) {
    cantidad = '';
  } else if (nombre.toLowerCase().includes('brownie')) {
    cantidad = item.quantity > 1 ? `combo (x${item.quantity})` : 'x1';
  } else if (nombre.toLowerCase().includes('galleta')) {
    cantidad = 'combo (x6)';
  } else if (nombre.toLowerCase().includes('trufa')) {
    cantidad = 'combo (x6)';
  } else if (nombre.toLowerCase().includes('chocolate')) {
    cantidad = 'combo (x8)';
  } else {
    cantidad = `x${item.quantity}`;
  }
  let emoji = '🍪';
  if (nombre.toLowerCase().includes('brownie')) emoji = '🍫';
  if (nombre.toLowerCase().includes('galleta')) emoji = '🍪';
  if (nombre.toLowerCase().includes('trufa')) emoji = '🍬';
  if (nombre.toLowerCase().includes('chocolate')) emoji = '🍫';
  if (nombre.toLowerCase().includes('postre')) emoji = '🍰';
  return `• ${emoji} ${nombre}${cantidad ? ' ' + cantidad : ''} - $${(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
}).join('\n')}

${appliedPromoCode ? `🎫 ¡Código promocional aplicado!\n${appliedPromoCode.code} (-$${discount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}) 💰` : ''}

${propina > 0 ? `💝 Propina para el equipo: $${propina.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} ❤️` : ''}

💵 Total a pagar: $${(total + propina).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}

📝 Número de orden: ${orderId}

¡Gracias por elegirnos! 🙏✨`}
        phoneNumber={WHATSAPP_NUM}
      />
    </div>
  );
} 