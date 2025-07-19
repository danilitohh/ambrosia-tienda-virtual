"use client";
import { useState } from "react";
import { sendEmail } from "@/lib/email";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";

const BANCOLOMBIA_CUENTA = "12345678901";
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
          to: form.email,
          subject: `Confirmación de pedido ${orden}`,
          html: `<h2>¡Gracias por tu pedido!</h2>
            <p>Tu número de orden es <b>${orden}</b>.</p>
            <h3>Datos de envío:</h3>
            <ul>
              <li><b>Nombre:</b> ${form.nombre}</li>
              <li><b>Dirección:</b> ${form.direccion}</li>
              <li><b>Ciudad:</b> ${form.ciudad}</li>
              <li><b>Departamento:</b> ${form.departamento}</li>
              <li><b>Teléfono:</b> ${form.telefono}</li>
              <li><b>Email:</b> ${form.email}</li>
            </ul>
            <p>Por favor realiza el pago siguiendo las instrucciones en pantalla y comparte tu comprobante junto con tu número de orden.</p>
            <p>Si tienes dudas o para enviar tu comprobante, contáctanos por WhatsApp: <a href="https://wa.me/573235924705" style="color:#25D366;font-weight:bold;">323 5924705</a></p>`
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

  const mensajeWhatsapp = orderId
    ? `Hola, ya realicé el pago de mi pedido. Mi número de orden es ${orderId}. Mis datos de envío: Nombre: ${form.nombre}, Dirección: ${form.direccion}, Ciudad: ${form.ciudad}, Teléfono: ${form.telefono}`
    : "";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
                {items.map(item => (
                  <li key={item.id} className="flex justify-between border-b border-gray-700 py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>${(total + discount).toLocaleString('es-CO')}</span>
              </div>
              {appliedPromoCode && (
                <div className="flex justify-between py-1 text-green-400">
                  <span>Descuento ({appliedPromoCode.code})</span>
                  <span>-${discount.toLocaleString('es-CO')}</span>
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
              <div className="flex justify-between py-2 border-t border-gray-700 mt-2 text-lg font-bold">
                <span>Total a pagar</span>
                <span>${(total + propina).toLocaleString('es-CO')}</span>
              </div>
            </div>
            <div className="mb-4 p-4 bg-[#23272a] rounded-lg border border-[#C6FF00] text-center">
              <span className="block text-[#C6FF00] font-semibold mb-2">Por ahora solo tenemos disponible el pago por Nequi.</span>
              <span className="block text-white">Realiza tu pago al número:</span>
              <span className="block text-2xl font-bold text-[#C6FF00]">304 3013144</span>
            </div>
            <p className="mb-4 text-center text-white">Realiza la transferencia a través de uno de los siguientes métodos:</p>
            <div className="mb-4 w-full">
              <div className="bg-[#23272a] rounded p-3 mb-2">
                <span className="block text-gray-400 text-xs">Cuenta Bancolombia</span>
                <span className="font-bold text-lg text-white">{BANCOLOMBIA_CUENTA}</span>
              </div>
              <div className="bg-[#23272a] rounded p-3">
                <span className="block text-gray-400 text-xs">Nequi</span>
                <span className="font-bold text-lg text-white">{NEQUI_NUMERO}</span>
              </div>
            </div>
            <div className="mb-4 w-full text-center">
              <span className="block text-gray-400 text-xs mb-1">Número de orden</span>
              <span className="font-bold text-2xl text-[#C6FF00]">{orderId}</span>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(mensajeWhatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] text-black font-bold py-3 px-6 rounded-lg transition-colors text-center mb-4"
            >
              Contactar por WhatsApp con mi número de orden
            </a>
            <p className="text-sm text-gray-300 mb-4 text-center">Después de transferir, envía el comprobante por WhatsApp o email para procesar tu pedido.</p>
            <a href="/" className="mt-4 text-[#C6FF00] hover:text-[#b2e600] underline">Volver al inicio</a>
          </div>
        )}
      </div>
    </div>
  );
} 