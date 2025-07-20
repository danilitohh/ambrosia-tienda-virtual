import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ToasterProvider, Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ambrosia Bhang - Brownies y Chocolates Artesanales",
  description: "Los mejores brownies y chocolates artesanales en Colombia. Brownies de chocolate, trufas, galletas y más. Envío a domicilio en Medellín y Antioquia.",
  keywords: "brownies, chocolates artesanales, brownies medellín, chocolates colombia, postres artesanales, brownies de chocolate, trufas, galletas, ambrosia bhang, tienda virtual",
  authors: [{ name: "Ambrosia Bhang" }],
  creator: "Ambrosia Bhang",
  publisher: "Ambrosia Bhang",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3004'),
  openGraph: {
    title: "Ambrosia Bhang - Brownies y Chocolates Artesanales",
    description: "Los mejores brownies y chocolates artesanales en Colombia. Envío a domicilio en Medellín y Antioquia.",
    url: process.env.NEXTAUTH_URL || 'http://localhost:3004',
    siteName: "Ambrosia Bhang",
    images: [
      {
        url: "/logo-ambrosia-bhang.jpeg",
        width: 1200,
        height: 630,
        alt: "Ambrosia Bhang - Brownies y Chocolates Artesanales",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambrosia Bhang - Brownies y Chocolates Artesanales",
    description: "Los mejores brownies y chocolates artesanales en Colombia",
    images: ["/logo-ambrosia-bhang.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXTAUTH_URL || 'http://localhost:3004',
  },
  category: "food",
  classification: "business",
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
        <ErrorBoundary>
          <ToasterProvider>
            <SessionProvider session={session}>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </SessionProvider>
          </ToasterProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
