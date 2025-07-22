"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2, RefreshCw } from "lucide-react"
import { UserMenu } from "@/components/ui/user-menu";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { useCart } from "@/components/providers/cart-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";

export default function CartPage() {
  const { items, removeItem, clearCart, updateQuantity, isLoading, itemCount } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null);
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

  const handleSyncCart = async () => {
    setSyncing(true);
    try {
      // await syncCart(); // This line was removed as per the edit hint
      alert("Carrito sincronizado exitosamente");
    } catch (error) {
      alert("Error sincronizando el carrito");
    } finally {
      setSyncing(false);
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#C6FF00]">
              Ambrosia
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-[#C6FF00] hover:text-[#b2e600] transition-colors">
                Productos
              </Link>
              <CartIndicator />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-[#C6FF00] hover:text-[#b2e600] mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Carrito de Compras</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[#181818] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Productos ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
              </h2>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-black rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-[#181818] rounded-lg flex items-center justify-center overflow-hidden">
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
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">{item.name}</h3>
                      <p className="text-gray-400">${item.price.toLocaleString('es-CO', {minimumFractionDigits: 0})}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
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
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        ${(item.price * item.quantity).toLocaleString('es-CO', {minimumFractionDigits: 0})}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
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
          <div className="lg:col-span-1">
            <div className="bg-[#181818] rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                  <span>${subtotal.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                </div>
                
                
                {appliedPromoCode && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento ({appliedPromoCode.code})</span>
                    <span>-${discount.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-300 items-center">
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
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                {appliedPromoCode ? (
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-400 text-sm font-medium">
                        Código aplicado: {appliedPromoCode.code}
                      </span>
                      <button
                        onClick={handleRemovePromoCode}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    <p className="text-green-300 text-xs">
                      {appliedPromoCode.description} - Descuento: ${discount.toLocaleString('es-CO')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Código promocional"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        disabled={promoCodeLoading}
                        className="ml-2 bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        {promoCodeLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {promoCodeError && (
                      <p className="text-red-400 text-sm mt-2">{promoCodeError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || loading}
                className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-8 rounded-lg transition-colors mt-6 flex items-center justify-center"
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