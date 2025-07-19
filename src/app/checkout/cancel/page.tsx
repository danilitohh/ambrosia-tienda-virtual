"use client";
import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-red-400">Pago cancelado</h1>
      <p className="mb-6 text-lg">El pago fue cancelado. Puedes intentarlo de nuevo o revisar tu carrito.</p>
      <Link href="/cart" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Volver al carrito</Link>
    </div>
  );
} 