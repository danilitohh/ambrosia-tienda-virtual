"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react"
import { UserMenu } from "@/components/ui/user-menu";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { useCart } from "@/components/providers/cart-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";

interface PromoCode {
  code: string;
  discountAmount: number;
  description?: string;
}

export default function CartPage() {
  const { items, removeItem, clearCart, updateQuantity, isLoading, itemCount } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [promoCodeError, setPromoCodeError] = useState('');
  const [promoCodeLoading, setPromoCodeLoading] = useState(false);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);
  const [propina, setPropina] = useState(0);
  const discount = useMemo(() => appliedPromoCode ? appliedPromoCode.discountAmount : 0, [appliedPromoCode]);
  const total = useMemo(() => subtotal + propina - discount, [subtotal, propina, discount]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const validation = await res.json();

      if (!res.ok) {
        alert(validation?.error || "Error validando el carrito. Inicia sesión para continuar.");
        console.error("Error de validación:", validation);
        setLoading(false);
        return;
      }

      if (!validation.valid) {
        alert("Algunos productos no están disponibles. Por favor, revisa tu carrito.");
        console.error("Errores de validación:", validation.results || validation);
        setLoading(false);
        return;
      }

      router.push("/checkout");
    } catch (error) {
      alert("Error al procesar el checkout. Por favor, intenta de nuevo.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clearCart();
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeError('Ingresa un código promocional');
      return;
    }

    setPromoCodeLoading(true);
    setPromoCodeError('');

    try {
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim(),
          cartItems: items
        })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedPromoCode(data.promoCode);
        setPromoCodeError('');
        alert(`¡Código aplicado! Descuento de $${data.promoCode.discountAmount.toLocaleString('es-CO')}`);
      } else {
        setPromoCodeError(data.error || 'Error aplicando el código');
        setAppliedPromoCode(null);
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoCodeError('Error aplicando el código promocional');
      setAppliedPromoCode(null);
    } finally {
      setPromoCodeLoading(false);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCode('');
    setPromoCodeError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-[#C6FF00] animate-spin mb-4" />
          <p className="text-gray-400">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-400 mb-8">Agrega algunos productos para comenzar a comprar</p>
            <Link
              href="/products"
              className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black w-full">
      {/* Header */}
      <header className="bg-black border-b border-gray-700 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 gap-2 w-full">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-[#C6FF00] text-center sm:text-left w-full sm:w-auto">
              Ambrosia
            </Link>
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 gap-2 w-full sm:w-auto justify-center">
              <Link href="/products" className="text-[#C6FF00] hover:text-[#b2e600] transition-colors w-full sm:w-auto text-center">
                Productos
              </Link>
              <CartIndicator />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 w-full">
        {/* Page Header */}
        <div className="mb-8 w-full">
          <Link href="/products" className="inline-flex items-center text-[#C6FF00] hover:text-[#b2e600] mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left w-full sm:w-auto">Carrito de Compras</h1>
            <div className="flex items-center space-x-0 sm:space-x-4 gap-2 w-full sm:w-auto justify-center">
              <button
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 transition-colors text-xs sm:text-sm w-full sm:w-auto"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 w-full">
          {/* Cart Items */}
          <div className="lg:col-span-2 w-full overflow-x-auto">
            <div className="bg-[#181818] rounded-lg p-4 sm:p-6 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">
                Productos ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
              </h2>
              
              <div className="space-y-4 sm:space-y-6 w-full">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 p-2 sm:p-4 bg-black rounded-lg w-full">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <div className="w-20 h-20 bg-[#181818] rounded-lg flex items-center justify-center overflow-hidden mx-auto">
                        <Image 
                          src={item.image && item.image !== '' ? item.image : '/producto-placeholder.png'} 
                          alt={item.name} 
                          width={80} 
                          height={80} 
                          className="object-contain w-full h-full" 
                          loading="lazy" 
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-medium text-white">{item.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-base">${item.price.toLocaleString('es-CO', {minimumFractionDigits: 0})}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-[#181818] hover:bg-[#222] text-white rounded-lg flex items-center justify-center transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-[#181818] hover:bg-[#222] text-white rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right w-full sm:w-auto">
                      <p className="text-base sm:text-lg font-semibold text-white">
                        ${(item.price * item.quantity).toLocaleString('es-CO', {minimumFractionDigits: 0})}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors w-full sm:w-auto"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 w-full">
            <div className="bg-[#181818] rounded-lg p-4 sm:p-6 sticky top-8 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 w-full">
                <div className="flex justify-between text-gray-300 w-full">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                  <span>${subtotal.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                </div>
                
                {appliedPromoCode && (
                  <div className="flex justify-between text-green-400 w-full">
                    <span>Descuento ({appliedPromoCode.code})</span>
                    <span>-${discount.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-300 items-center w-full">
                  <span>Propina (opcional)</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={propina}
                    onChange={e => setPropina(Math.max(0, Number(e.target.value)))}
                    className="w-16 sm:w-24 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-right focus:outline-none focus:ring-2 focus:ring-[#C6FF00] ml-2"
                    style={{ background: '#23272a' }}
                  />
                </div>
                
                <div className="border-t border-gray-600 pt-4 w-full">
                  <div className="flex justify-between text-white font-semibold text-base sm:text-lg w-full">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6 w-full">
                {appliedPromoCode ? (
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-3 w-full">
                    <div className="flex justify-between items-center mb-2 w-full">
                      <span className="text-green-400 text-xs sm:text-sm font-medium">
                        Código aplicado: {appliedPromoCode.code}
                      </span>
                      <button
                        onClick={handleRemovePromoCode}
                        className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    <p className="text-green-300 text-xs">
                      {appliedPromoCode.description} - Descuento: ${discount.toLocaleString('es-CO')}
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                      <input
                        type="text"
                        placeholder="Código promocional"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-transparent w-full"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        disabled={promoCodeLoading}
                        className="bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
                      >
                        {promoCodeLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {promoCodeError && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2">{promoCodeError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || loading}
                className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg transition-colors mt-4 sm:mt-6 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirigiendo...
                  </>
                ) : (
                  "Proceder al Pago"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 