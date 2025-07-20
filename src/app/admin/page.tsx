"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados para settings
  const [settings, setSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  // Estados para productos
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  // Formulario anuncio
  const [announcement, setAnnouncement] = useState("");
  const [announcementImage, setAnnouncementImage] = useState<string | null>(null);
  const [announcementImageFile, setAnnouncementImageFile] = useState<File | null>(null);

  // Formulario Nequi
  const [nequiNumber, setNequiNumber] = useState("");

  // Formulario QR Bancolombia
  const [bancolombiaQr, setBancolombiaQr] = useState<string | null>(null);
  const [bancolombiaQrFile, setBancolombiaQrFile] = useState<File | null>(null);
  const [bancolombiaCuenta, setBancolombiaCuenta] = useState("");

  // Cargar settings y productos
  useEffect(() => {
    if (status !== "authenticated" || !session || session.user.role !== "ADMIN") return;
    setLoadingSettings(true);
    fetch("/api/admin/settings")
      .then(async res => {
        if (!res.ok) throw new Error("Error al cargar settings");
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      })
      .then(data => {
        setSettings(data);
        setAnnouncement(data?.announcement || "");
        setAnnouncementImage(data?.announcementImage || null);
        setNequiNumber(data?.nequiNumber || "");
        setBancolombiaQr(data?.bancolombiaQr || null);
        setBancolombiaCuenta(data?.bancolombiaCuenta || "");
      })
      .finally(() => setLoadingSettings(false));
    setLoadingProducts(true);
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(setProducts)
      .finally(() => setLoadingProducts(false));
  }, [status, session]);

  // Subir imagen a Cloudinary o similar (mock, solo base64 local para demo)
  const handleImageUpload = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) setter(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Guardar settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcement,
          announcementImage,
          nequiNumber,
          bancolombiaCuenta,
          bancolombiaQr,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setSettingsMsg("¡Configuración guardada!");
        console.log("Configuración guardada exitosamente:", data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error al guardar:", res.status, errorData);
        setSettingsMsg(`Error al guardar: ${errorData.details || errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      setSettingsMsg(`Error de red: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSavingSettings(false);
    }
  };

  // Cambiar disponibilidad producto
  const handleToggleProduct = async (id: string, isActive: boolean) => {
    setSavingProductId(id);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive }),
    });
    setProducts(products => products.map(p => p.id === id ? { ...p, isActive } : p));
    setSavingProductId(null);
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session.user.role !== "ADMIN") {
    return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#C6FF00]">Panel de Administración</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Gestionar Productos
          </button>
          <button
            onClick={() => router.push('/admin/promo-codes')}
            className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Gestionar Códigos Promocionales
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Anuncio */}
        <section className="bg-[#181818] p-6 rounded-lg border border-[#C6FF00]">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">Editar anuncio principal</h2>
          {loadingSettings ? <div>Cargando...</div> : (
            <form onSubmit={e => { e.preventDefault(); handleSaveSettings(); }}>
              <textarea
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white mb-2"
                rows={3}
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Texto del anuncio"
              />
              <div className="mb-2">
                <label className="block mb-1">Imagen del anuncio:</label>
                {announcementImage && (
                  <Image src={announcementImage} alt="Anuncio" width={200} height={120} className="mb-2 rounded" />
                )}
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAnnouncementImageFile(file);
                    handleImageUpload(file, setAnnouncementImage);
                  }
                }} />
              </div>
              <button type="submit" className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-2 px-6 rounded-lg mt-2" disabled={savingSettings}>Guardar</button>
              {settingsMsg && <div className="mt-2 text-sm text-[#C6FF00]">{settingsMsg}</div>}
            </form>
          )}
        </section>
        {/* Disponibilidad de productos */}
        <section className="bg-[#181818] p-6 rounded-lg border border-[#C6FF00]">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">Disponibilidad de productos</h2>
          {loadingProducts ? <div>Cargando...</div> : (
            <ul>
              {products.map(product => (
                <li key={product.id} className="flex items-center justify-between border-b border-gray-700 py-2">
                  <span>{product.name}</span>
                  <button
                    className={`px-4 py-1 rounded ${product.isActive ? 'bg-green-600' : 'bg-red-600'} text-white font-semibold ml-4`}
                    onClick={() => handleToggleProduct(product.id, !product.isActive)}
                    disabled={savingProductId === product.id}
                  >
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* Número de Nequi */}
        <section className="bg-[#181818] p-6 rounded-lg border border-[#C6FF00]">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">Número de Nequi</h2>
          {loadingSettings ? <div>Cargando...</div> : (
            <form onSubmit={e => { e.preventDefault(); handleSaveSettings(); }}>
              <input
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white mb-2"
                value={nequiNumber}
                onChange={e => setNequiNumber(e.target.value)}
                placeholder="Número de Nequi"
              />
              <button type="submit" className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-2 px-6 rounded-lg mt-2" disabled={savingSettings}>Guardar</button>
              {settingsMsg && <div className="mt-2 text-sm text-[#C6FF00]">{settingsMsg}</div>}
            </form>
          )}
        </section>
        {/* Cuenta Bancolombia */}
        <section className="bg-[#181818] p-6 rounded-lg border border-[#C6FF00]">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">Cuenta Bancolombia</h2>
          {loadingSettings ? <div>Cargando...</div> : (
            <form onSubmit={e => { e.preventDefault(); handleSaveSettings(); }}>
              <input
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white mb-2"
                value={bancolombiaCuenta}
                onChange={e => setBancolombiaCuenta(e.target.value)}
                placeholder="Número de cuenta Bancolombia"
              />
              <button type="submit" className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-2 px-6 rounded-lg mt-2" disabled={savingSettings}>Guardar</button>
              {settingsMsg && <div className="mt-2 text-sm text-[#C6FF00]">{settingsMsg}</div>}
            </form>
          )}
        </section>
        {/* QR Bancolombia */}
        <section className="bg-[#181818] p-6 rounded-lg border border-[#C6FF00]">
          <h2 className="text-xl font-semibold mb-4 text-[#C6FF00]">QR Bancolombia</h2>
          {loadingSettings ? <div>Cargando...</div> : (
            <form onSubmit={e => { e.preventDefault(); handleSaveSettings(); }}>
              {bancolombiaQr && (
                <Image src={bancolombiaQr} alt="QR Bancolombia" width={200} height={200} className="mb-2 rounded" />
              )}
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setBancolombiaQrFile(file);
                  handleImageUpload(file, setBancolombiaQr);
                }
              }} />
              <button type="submit" className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-2 px-6 rounded-lg mt-2" disabled={savingSettings}>Guardar</button>
              {settingsMsg && <div className="mt-2 text-sm text-[#C6FF00]">{settingsMsg}</div>}
            </form>
          )}
        </section>
      </div>
    </div>
  );
} 