"use client";

import Link from "next/link"
import { ShoppingCart, Heart, Star, Filter, Search, Check } from "lucide-react"
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
  stock: number;
  category?: { name: string };
  description?: string;
  rating?: number;
  reviews?: number;
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
      } catch (error) {
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

    const currentCartQuantity = getCurrentCartQuantity(id);
    const maxAvailable = product.stock - currentCartQuantity;
    
    // No permitir más de lo disponible
    if (value > maxAvailable) {
      value = maxAvailable;
    }
    
    if (value < 1) value = 1;
    
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }, [getCurrentCartQuantity, products]);

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

    } catch (error) {
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Ordenar por:</span>
              <select className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]">
                <option value="newest">Más recientes</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="text-center text-white col-span-full">Cargando productos...</div>
          ) : memoizedProducts.map((product) => {
            const currentCartQuantity = getCurrentCartQuantity(product.id);
            const availableStock = product.stock - currentCartQuantity;
            const isOutOfStock = availableStock <= 0;
            const isAdding = addingToCart[product.id];
            const isAdded = addedToCart[product.id];
            
            return (
              <div key={product.id} className="rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform" style={{ background: '#181818', border: '1px solid #222' }}>
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full flex justify-center items-center h-12 bg-black bg-opacity-60 z-10">
                    <span className="text-lg font-bold text-white text-center px-2 truncate">{product.name}</span>
                  </div>
                  <div className="h-48 bg-gray-900 flex items-center justify-center">
                    <Image src={product.images?.[0] || "/producto1.jpeg"} alt={product.name} width={300} height={300} className="object-contain" loading="lazy" />
                  </div>
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-[#C6FF00] transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  
                  {/* Stock indicator */}
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      availableStock > 5 ? 'bg-green-500 text-white' : 
                      availableStock > 0 ? 'bg-yellow-500 text-black' : 
                      'bg-red-500 text-white'
                    }`}>
                      {availableStock > 5 ? 'En stock' : 
                       availableStock > 0 ? `Solo ${availableStock}` : 
                       'Agotado'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {typeof product.category === 'object' ? product.category?.name : product.category}
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-[#C6FF00] fill-current' : 'text-gray-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 ml-2">
                      ({product.reviews || 0})
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold" style={{ color: '#C6FF00' }}>
                        ${product.price.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                  
                  
                  <div className="flex space-x-2 items-center justify-center mt-2">
                    <input
                      type="number"
                      min={1}
                      max={availableStock}
                      value={quantities[product.id] || 1}
                      onChange={e => handleQuantityChange(product.id, Math.max(1, Number(e.target.value)))}
                      className="w-14 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                      disabled={isOutOfStock}
                      style={{ minWidth: 0 }}
                    />
                    <button
                      disabled={isOutOfStock || isAdding}
                      onClick={() => handleAddToCart(product)}
                      className={`font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none ${
                        isAdded 
                          ? 'bg-green-500 text-white' 
                          : isOutOfStock 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-[#C6FF00] hover:bg-[#b2e600] text-black'
                      }`}
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
                          <span>{isOutOfStock ? "Agotado" : "Agregar al carrito"}</span>
                        </>
                      )}
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                      style={{ minWidth: 'auto' }}
                    >
                      Ver
                    </Link>
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