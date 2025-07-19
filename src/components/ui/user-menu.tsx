"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-gray-300">Hola, {session.user?.name || session.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold px-4 py-2 rounded transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold px-4 py-2 rounded transition-colors"
    >
      Iniciar Sesión
    </button>
  );
} 