"use client";

import Link from "next/link"
import { ShoppingCart, User, Search, Menu, ArrowRight, X } from "lucide-react"
import { UserMenu } from "@/components/ui/user-menu";
import { CartIndicator } from "@/components/ui/cart-indicator";
import Image from "next/image";
import { useState, useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category?: { name: string };
  description?: string;
};

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementConfig, setAnnouncementConfig] = useState<any>(null);

  // Mostrar el anuncio al cargar la página
  useEffect(() => {
    // Cargar configuración del anuncio desde la base de datos
    fetch("/api/admin/settings")
      .then(async res => {
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(data => {
        setAnnouncementConfig(data);
        // Solo mostrar el anuncio si hay configuración y no está vacío
        if (data && (data.announcement || data.announcementImage)) {
          setShowAnnouncement(true);
        }
      })
      .catch(() => {
        // Si no hay configuración, no mostrar anuncio
        setShowAnnouncement(false);
      });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products", {
          headers: {
            'Cache-Control': 'max-age=300' // 5 minutos de caché en cliente
          }
        });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAnnouncement) {
        closeAnnouncement();
      }
    };

    if (showAnnouncement) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showAnnouncement]);

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  const showAnnouncementAgain = () => {
    setShowAnnouncement(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Modal de Anuncio */}
      {showAnnouncement && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-in fade-in duration-300"
          onClick={closeAnnouncement}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={closeAnnouncement}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Imagen del anuncio */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              {announcementConfig?.announcementImage ? (
                <Image 
                  src={announcementConfig.announcementImage} 
                  alt="Anuncio Ambrosia" 
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[80vh] object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              
              {/* Overlay con información adicional */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#C6FF00] mb-2">
                    {announcementConfig?.announcement || "¡Bienvenido a Ambrosia!"}
                  </h2>
                  {announcementConfig?.announcement && (
                    <p className="text-white text-sm md:text-base mb-4">
                      Descubre nuestros productos únicos y de alta calidad
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/products"
                      onClick={closeAnnouncement}
                      className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
                    >
                      Ver Productos
                    </Link>
                    <button
                      onClick={closeAnnouncement}
                      className="border border-[#C6FF00] text-[#C6FF00] hover:bg-[#C6FF00] hover:text-black font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white border-4 border-[#C6FF00] mr-3">
                <Image src="/logo-ambrosia-bhang.jpeg" alt="Logo Ambrosia Bhang" width={56} height={56} className="rounded-full object-contain" />
              </div>
              <Link href="/" className="text-2xl font-bold text-[#C6FF00]">
                Ambrosia Bhang
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-[#C6FF00] hover:text-[#b2e600] transition-colors">
                Productos
              </Link>
              <Link href="/nosotros" className="text-[#C6FF00] hover:text-[#b2e600] transition-colors">
                Nosotros
              </Link>
              <button
                onClick={showAnnouncementAgain}
                className="text-[#C6FF00] hover:text-[#b2e600] transition-colors text-sm"
                title="Ver anuncio"
              >
                📢 Anuncio
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <CartIndicator />
              <UserMenu />
              <button className="md:hidden text-gray-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#C6FF00]" style={{ textShadow: '2px 2px 8px #000' }}>
              Bienvenido a{" "}
              <span className="text-white">Ambrosia</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white" style={{ textShadow: '1px 1px 6px #000' }}>
              Descubre productos únicos y de alta calidad. Tu tienda virtual de confianza con los mejores precios y servicio al cliente excepcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="group font-semibold py-3 px-8 rounded-lg transition-all duration-300 bg-[#C6FF00] text-black hover:bg-[#b2e600] hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Ver Productos</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/cart"
                className="group font-semibold py-3 px-8 rounded-lg transition-all duration-300 border-2 border-[#C6FF00] text-[#C6FF00] hover:bg-[#C6FF00] hover:text-black flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Ver Carrito</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Productos más vendidos */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#C6FF00]">Productos más vendidos</h2>
          {loading ? (
            <div className="text-center text-white">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Brownie de chocolate x1",
                "Chocolates",
                "Galletas"
              ].map((nombre, idx) => {
                const prod = products.find(p => p.name.toLowerCase().includes(nombre.toLowerCase()));
                return prod ? (
                  <div key={prod.id} className="rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform" style={{ background: '#181818', border: '1px solid #222' }}>
                    <div className="h-48 bg-gray-900 flex items-center justify-center">
                      <Image src={prod.images[0] || "/producto1.jpeg"} alt={prod.name} width={300} height={300} className="object-contain" loading="lazy" />
                    </div>
                    <div className="p-4 flex flex-col items-center">
                      <span className="text-lg font-bold text-white mb-2 text-center">{prod.name}</span>
                      <span className="text-[#C6FF00] font-semibold text-xl mb-4">${Number(prod.price).toLocaleString('es-CO')}</span>
                      <Link href={`/products/${prod.id}`} className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-2 px-6 rounded-lg transition-colors">Ver producto</Link>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#C6FF00]">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Envíos seguros",
                description: "Empacamos discretamente y trabajamos con transportadoras confiables para que tu pedido llegue a salvo. Puede ser entrega el mismo día. Si son envíos fuera de Medellín llegan de 1 a 2 día hábiles.",
                icon: "📦",
              },
              {
                title: "Guía de consumo",
                description: "Cumplimos con guías de consumo para tener más conciencia del viaje",
                icon: "📖",
              },
              {
                title: "Pagos Seguros",
                description: "Transacciones protegidas y seguras",
                icon: "🔒",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-4xl mb-4" style={{ color: '#C6FF00' }}>{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#C6FF00' }}>{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C6FF00]">Ambrosia Bhang</h3>
              <p className="text-gray-300">
                Tu tienda virtual de confianza con los mejores productos y precios.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#C6FF00]">Contacto</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a
                    href="https://wa.me/573235924705"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C6FF00] hover:text-[#b2e600] font-semibold"
                  >
                    WhatsApp: 323 5924705
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ambrosia Bhang. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
