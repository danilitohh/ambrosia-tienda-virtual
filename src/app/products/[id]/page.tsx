"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        const found = (data.products || []).find((p: any) => p.id === id);
        setProduct(found || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando producto...</div>;
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/products" className="text-[#C6FF00] hover:text-[#b2e600] underline">Volver a productos</Link>
      </div>
    );
  }

  // Descripciones personalizadas
  let descripcion = "Aquí va la descripción del producto. Puedes personalizar este texto para cada producto.";

  // Puedes personalizar la descripción aquí si lo deseas, usando product.name o product.slug
  // Ejemplo:
  // if (product.slug === "brownie-de-chocolate-x2") { descripcion = "..." }

  const handleAddToCart = () => {
    addItem({ 
      id: product.id, 
      productId: product.id,
      name: product.name, 
      price: product.price, 
      quantity,
      image: product.images?.[0] || ""
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="bg-black rounded-lg shadow-lg p-8 w-full max-w-2xl flex flex-col items-center mx-auto mt-12">
        <Image src={product.images?.[0] || "/producto1.jpeg"} alt={product.name} width={500} height={500} className="rounded-lg mb-6 object-contain" />
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#C6FF00' }}>{product.name}</h1>
        <p className="text-2xl font-semibold mb-2" style={{ color: '#C6FF00' }}>{Number(product.price).toLocaleString("es-CO")}</p>
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="text-gray-400 line-through mb-2">${Number(product.comparePrice).toLocaleString("es-CO")}</span>
        )}
        <p className="mb-6 text-center text-white whitespace-pre-line">{product.description || descripcion}</p>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 px-2 py-2 rounded bg-gray-800 border border-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
          />
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
        <Link href="/products" className="text-[#C6FF00] hover:text-[#b2e600] underline">Volver a productos</Link>
      </div>
    </div>
  );
} 