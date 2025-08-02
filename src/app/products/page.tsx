"use client";

import Link from "next/link"
import { ShoppingCart, Check } from "lucide-react";
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
  const { addItem } = useCart();
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


  const handleQuantityChange = useCallback((id: string, value: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // No permitir más de lo disponible
    if (value < 1) value = 1;
    
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }, [products]);

  const handleAddToCart = useCallback(async (product: Product) => {
    const quantity = quantities[product.id] || 1;
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
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      addToast({
        type: "success",
        title: "¡Producto agregado al carrito!",
        message: `Agregaste <b>${product.name}</b> <span style='color:#C6FF00;'>x${quantity}</span> a tu carrito.`,
        imageUrl: product.images?.[0] || "",
        duration: 3500,
      });
      setTimeout(() => {
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
        setAddedToCart(prev => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (error) {
  console.error("Add to cart error:", error);
  addToast({
    type: "error",
    title: "Error",
    message: "No se pudo agregar el producto al carrito.",
    duration: 4000,
  });
} finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  }, [addItem, addToast, quantities]);

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="min-h-screen bg-black w-full">
      {/* Header */}
      <header className="bg-black border-b border-gray-700 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 gap-2 w-full">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-[#C6FF00] text-center sm:text-left w-full sm:w-auto">
              Ambrosia
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-center">
              <CartIndicator />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 w-full">
        <div className="mb-4 sm:mb-8 w-full">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#C6FF00] text-center sm:text-left">Productos</h1>
          <p className="text-xs sm:text-base text-gray-300 text-center sm:text-left">Descubre nuestra amplia selección de productos</p>
        </div>
        {/* Barra de búsqueda eliminada */}
        <div className="space-y-4 sm:space-y-6 w-full">
          {loading ? (
            <div className="text-center text-white">Cargando productos...</div>
          ) : memoizedProducts.map((product) => {
            const isAdding = addingToCart[product.id];
            const isAdded = addedToCart[product.id];
            return (
              <div key={product.id} className="rounded-lg overflow-hidden bg-[#181818] border border-[#222] flex flex-col md:flex-row items-stretch w-full">
                {/* Imagen a la izquierda */}
                <div className="relative w-full md:w-1/2 min-w-[160px] sm:min-w-[200px] max-w-full md:max-w-[320px] aspect-[16/9] bg-gray-900 flex items-center justify-center">
                  <Image
                    src={product.images?.[0] || "/producto1.jpeg"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {/* Info a la derecha */}
                <div className="p-2 sm:p-4 flex flex-col flex-1 justify-between w-full">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 block w-full text-center sm:text-left">{product.name}</span>
                    <div className="mb-1 sm:mb-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wide w-full text-center sm:text-left block">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                      </span>
                    </div>
                    <div className="mb-2 sm:mb-4">
                      <span className="text-base sm:text-xl font-bold" style={{ color: '#C6FF00' }}>
                        ${product.price.toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className="mb-2 sm:mb-4 text-gray-300 text-xs sm:text-sm whitespace-pre-line w-full">
                      {product.description}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full">
                    <button
                      type="button"
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                      onClick={() => handleQuantityChange(product.id, Math.max(1, (quantities[product.id] || 1) - 1))}
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={Number.isFinite(quantities[product.id]) ? quantities[product.id] : 1}
                      onChange={e => handleQuantityChange(product.id, Math.max(1, Number(e.target.value)))}
                      className="w-12 sm:w-14 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                      style={{ minWidth: 0 }}
                    />
                    <button
                      type="button"
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                    <button
                      disabled={isAdding}
                      onClick={() => handleAddToCart(product)}
                      className={`font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none w-full sm:w-auto ${
                        isAdded 
                          ? 'bg-green-500 text-white' 
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
  );
}