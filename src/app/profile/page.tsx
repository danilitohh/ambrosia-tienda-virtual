"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);

  // Consultar si el usuario ya tiene Google vinculado
  useEffect(() => {
    async function checkGoogleLinked() {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("/api/profile/accounts");
        const data = await res.json();
        setHasGoogle(data.providers?.includes("google") ?? false);
      } catch {
        setHasGoogle(null);
      }
    }
    checkGoogleLinked();
  }, [session]);

  if (status === "loading") return <div className="p-8 text-white">Cargando...</div>;
  if (!session) return <div className="p-8 text-white">Debes iniciar sesión para ver tu perfil.</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-[#181818] rounded-lg p-8 shadow-lg border border-[#C6FF00]">
      <h1 className="text-3xl font-bold mb-4 text-[#C6FF00]">Mi perfil</h1>
      <p className="text-white mb-2"><b>Email:</b> {session.user.email}</p>
      <p className="text-white mb-6"><b>ID:</b> {session.user.id}</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#C6FF00] mb-2">Vinculación de cuentas</h2>
        {hasGoogle === null ? (
          <span className="text-gray-400">Verificando...</span>
        ) : hasGoogle ? (
          <span className="text-green-400 font-semibold">Google ya está vinculado ✅</span>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/profile", prompt: "consent" })}
            className="bg-[#C6FF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#b2e600] transition-colors"
          >
            Vincular cuenta de Google
          </button>
        )}
      </div>
    </div>
  );
} 