"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  productId: string;
  minQuantity: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function PromoCodesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercent: 10,
    productId: '',
    minQuantity: 1,
    maxUses: '',
    expiresAt: ''
  });

  // Redirigir si no es admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [session, status, router]);

  // Cargar productos y códigos promocionales
  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      // Cargar productos
      const productsRes = await fetch('/api/admin/products');
      let productsData = [];
      if (productsRes.ok) {
        const text = await productsRes.text();
        productsData = text ? JSON.parse(text) : [];
      } else {
        // Si hay error, muestra alerta y deja productos vacío
        alert('No tienes permisos para ver los productos o hubo un error en el servidor.');
        productsData = [];
      }
      setProducts(Array.isArray(productsData) ? productsData : []);

      // Cargar códigos promocionales
      const promoCodesRes = await fetch('/api/admin/promo-codes');
      const promoCodesData = await promoCodesRes.json();
      setPromoCodes(Array.isArray(promoCodesData) ? promoCodesData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setProducts([]);
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          expiresAt: formData.expiresAt || null
        })
      });

      if (res.ok) {
        const newPromoCode = await res.json();
        setPromoCodes([newPromoCode, ...promoCodes]);
        setFormData({
          code: '',
          description: '',
          discountPercent: 10,
          productId: '',
          minQuantity: 1,
          maxUses: '',
          expiresAt: ''
        });
        alert('Código promocional creado exitosamente');
      } else {
        const error = await res.json();
        alert(error.error || 'Error creando el código promocional');
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
      alert('Error creando el código promocional');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este código promocional?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPromoCodes(promoCodes.filter(code => code.id !== id));
        alert('Código promocional eliminado exitosamente');
      } else {
        alert('Error eliminando el código promocional');
      }
    } catch (error) {
      console.error('Error deleting promo code:', error);
      alert('Error eliminando el código promocional');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#C6FF00]">Códigos Promocionales</h1>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Volver al Admin
          </button>
        </div>

        {/* Formulario para crear código promocional */}
        <div className="bg-[#181818] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">Crear Nuevo Código Promocional</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Código</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                placeholder="Ej: BROWNIE10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                placeholder="Ej: 10% off en Brownie x3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Porcentaje de Descuento</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Producto</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                required
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toLocaleString('es-CO')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cantidad Mínima</label>
              <input
                type="number"
                min="1"
                value={formData.minQuantity}
                onChange={(e) => setFormData({...formData, minQuantity: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Máximo de Usos (opcional)</label>
              <input
                type="number"
                min="1"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
                placeholder="Ilimitado si está vacío"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fecha de Expiración (opcional)</label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                className="w-full px-3 py-2 bg-[#23272a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {creating ? 'Creando...' : 'Crear Código Promocional'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de códigos promocionales */}
        <div className="bg-[#181818] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">Códigos Promocionales Existentes</h2>
          {promoCodes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay códigos promocionales creados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2">Código</th>
                    <th className="text-left py-3 px-2">Descripción</th>
                    <th className="text-left py-3 px-2">Descuento</th>
                    <th className="text-left py-3 px-2">Producto</th>
                    <th className="text-left py-3 px-2">Cant. Mín.</th>
                    <th className="text-left py-3 px-2">Usos</th>
                    <th className="text-left py-3 px-2">Estado</th>
                    <th className="text-left py-3 px-2">Expira</th>
                    <th className="text-left py-3 px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(promoCodes) ? promoCodes : []).map((code) => (
                    <tr key={code.id} className="border-b border-gray-800">
                      <td className="py-3 px-2 font-mono text-[#C6FF00]">{code.code}</td>
                      <td className="py-3 px-2">{code.description}</td>
                      <td className="py-3 px-2">{code.discountPercent}%</td>
                      <td className="py-3 px-2">{code.product.name}</td>
                      <td className="py-3 px-2">{code.minQuantity}</td>
                      <td className="py-3 px-2">
                        {code.usedCount}
                        {code.maxUses && ` / ${code.maxUses}`}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          code.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {code.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {code.expiresAt ? formatDate(code.expiresAt) : 'Sin expiración'}
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleDelete(code.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}