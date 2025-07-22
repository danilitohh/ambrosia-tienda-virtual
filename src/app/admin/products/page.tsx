"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  isActive: boolean;
  sku: string;
  slug: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function ProductsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    sku: "",
    slug: "",
    images: [] as string[]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/");
      return;
    }

    loadData();
  }, [status, session, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories")
      ]);
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    const newFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === files.length) {
            setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          }
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });
    
    setImageFiles(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      comparePrice: "",
      categoryId: "",
      sku: "",
      slug: "",
      images: []
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const url = editingProduct 
        ? `/api/admin/products` 
        : `/api/admin/products`;
      
      const method = editingProduct ? "PATCH" : "POST";
      const body = editingProduct 
        ? { id: editingProduct.id, ...form }
        : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(editingProduct ? "Producto actualizado correctamente" : "Producto creado correctamente");
        resetForm();
        setShowForm(false);
        loadData();
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.error || "Error desconocido"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      categoryId: product.categoryId,
      sku: product.sku,
      slug: product.slug,
      images: product.images
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setMessage("Producto eliminado correctamente");
        loadData();
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.error || "Error al eliminar"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive } : p));
      }
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  };

  if (status === "loading" || !session || session.user.role !== "ADMIN") {
    return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#C6FF00]">Gestión de Productos</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Volver al Panel
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Agregar Producto
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>
          {message}
        </div>
      )}

      {/* Formulario de Producto */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#181818] p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-[#C6FF00]">
              {editingProduct ? "Editar Producto" : "Agregar Producto"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Precio *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2">Precio de Comparación</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.comparePrice}
                    onChange={e => setForm(prev => ({ ...prev, comparePrice: e.target.value }))}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2">Categoría *</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                  placeholder="auto-generado si está vacío"
                />
              </div>

              <div>
                <label className="block mb-2">Imágenes</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => handleImageUpload(e.target.files)}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                />
                
                {form.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {form.images.map((img, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          width={100}
                          height={100}
                          className="rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : (editingProduct ? "Actualizar" : "Crear")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Productos */}
      {loading ? (
        <div className="text-center py-8">Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-[#181818] p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#C6FF00]">{product.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(product.id, !product.isActive)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      product.isActive ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              </div>

              {product.images.length > 0 && (
                <div className="mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-300">{product.description}</p>
                <p className="font-semibold">{product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                {product.comparePrice && (
                  <p className="text-sm text-gray-400 line-through">
                    {product.comparePrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                  </p>
                )}
                <p className="text-sm text-gray-400">Categoría: {product.category?.name}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 