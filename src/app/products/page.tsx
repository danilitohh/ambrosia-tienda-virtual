"use client";

import Link from "next/link"
import { ShoppingCart, Check } from "lucide-react"
import { UserMenu } from "@/components/ui/user-menu";
import { CartIndicator } from "@/components/ui/cart-indicator";
import { useCart } from "@/components/providers/cart-provider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useToaster } from "@/components/ui/toaster";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category?: { name: string };
  description?: string;
  rating?: number;
  reviews?: number;
  stock: number;
};

export default function ProductsPage() {
  const { addItem, items } = useCart();
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [addingToCart, setAddingToCart] = useState<{ [id: string]: boolean }>({});
  const [addedToCart, setAddedToCart] = useState<{ [id: string]: boolean }>({});
  const { addToast } = useToaster();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Obtener cantidad actual en el carrito para cada producto
  const getCurrentCartQuantity = useCallback((productId: string) => {
    const cartItem = items.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }, [items]);

  const handleQuantityChange = useCallback((id: string, value: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (value < 1) value = 1;
    
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }, [products]);

  const handleAddToCart = useCallback(async (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const currentCartQuantity = getCurrentCartQuantity(product.id);
    
    // Validar stock disponible
    if (currentCartQuantity + quantity > product.stock) {
      addToast({
        type: "error",
        title: "Stock insuficiente",
        message: `Solo quedan ${product.stock - currentCartQuantity} unidades disponibles.`,
        duration: 4000,
      });
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      addItem({ 
        id: product.id,
        productId: product.id,
        name: product.name, 
        price: product.price, 
        quantity,
        image: product.images?.[0] || ""
      });

      // Mostrar feedback visual
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      
      addToast({
        type: "success",
        title: "¡Producto agregado al carrito!",
        message: `Agregaste <b>${product.name}</b> <span style='color:#C6FF00;'>x${quantity}</span> a tu carrito.`,
        imageUrl: product.images?.[0] || "",
        duration: 3500,
      });

      // Resetear cantidad después de agregar
      setTimeout(() => {
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
        setAddedToCart(prev => ({ ...prev, [product.id]: false }));
      }, 2000);

    } catch {
      addToast({
        type: "error",
        title: "Error",
        message: "No se pudo agregar el producto al carrito.",
        duration: 4000,
      });
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  }, [addItem, addToast, quantities, getCurrentCartQuantity]);

  const memoizedProducts = useMemo(() => products, [products]);

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
              <CartIndicator />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#C6FF00]">Productos</h1>
          <p className="text-gray-300">Descubre nuestra amplia selección de productos</p>
        </div>
        <div className="rounded-lg p-6 mb-8 bg-black">
          {/* Eliminada la barra de búsqueda de productos */}
        </div>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-white">Cargando productos...</div>
          ) : memoizedProducts.map((product) => {
            const isAdding = addingToCart[product.id];
            const isAdded = addedToCart[product.id];
            return (
              <div key={product.id} className="flex flex-col md:flex-row items-center bg-[#181818] border border-[#222] rounded-lg overflow-hidden shadow-lg p-4 gap-6">
                {/* Imagen a la izquierda */}
                <div className="flex-shrink-0 w-40 h-40 flex items-center justify-center bg-gray-900 rounded-lg">
                  <Image src={product.images?.[0] || "/producto1.jpeg"} alt={product.name} width={160} height={160} className="object-contain w-full h-full" loading="lazy" />
                </div>
                {/* Info a la derecha */}
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-xl font-bold text-[#C6FF00] mb-1">{product.name}</span>
                  {/* Eliminar calificación y estrellas */}
                  <span className="text-xs text-gray-400 uppercase tracking-wide">{typeof product.category === 'object' ? product.category?.name : product.category}</span>
                  <span className="text-gray-300 mb-2">{product.description}</span>
                  <span className="text-2xl font-bold text-white mb-2">${product.price.toLocaleString("es-CO")}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      value={quantities[product.id] || 1}
                      onChange={e => handleQuantityChange(product.id, Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                      style={{ minWidth: 0 }}
                    />
                    <button
                      disabled={isAdding}
                      onClick={() => handleAddToCart(product)}
                      className={`font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none ${isAdded ? 'bg-green-500 text-white' : 'bg-[#C6FF00] hover:bg-[#b2e600] text-black'}`}
                      style={{ minWidth: 'auto', outline: 'none', boxShadow: 'none', border: 'none' }}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>¡Agregado!</span>
                        </>
                      ) : isAdding ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          <span>Agregando...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span>Agregar al carrito</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}