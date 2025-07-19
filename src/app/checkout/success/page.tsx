"use client";
import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4 text-[#C6FF00]">¡Pago exitoso!</h1>
      <p className="mb-6 text-lg">Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
      <Link href="/products" className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-8 rounded-lg transition-colors">Seguir comprando</Link>
    </div>
  );
} 