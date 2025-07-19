import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ToasterProvider, Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ambrosia - Tienda Virtual",
  description: "Tu tienda virtual de confianza con los mejores productos",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ToasterProvider>
          <SessionProvider session={session}>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </SessionProvider>
        </ToasterProvider>
      </body>
    </html>
  );
}
