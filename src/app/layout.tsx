import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToasterProvider, Toaster } from '@/components/ui/toaster'

// Removed duplicate default export of RootLayout
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ambrosia Bhang - Brownies y Chocolates Artesanales',
  description: 'Descubre nuestros deliciosos brownies y chocolates artesanales. Envío a domicilio en Medellín y Antioquia. Calidad premium y sabores únicos.',
  keywords: 'brownies, chocolates, artesanales, Medellín, Antioquia, delivery, postres, dulces',
  authors: [{ name: 'Ambrosia Bhang' }],
  creator: 'Ambrosia Bhang',
  publisher: 'Ambrosia Bhang',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tu-proyecto.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ambrosia Bhang - Brownies y Chocolates Artesanales',
    description: 'Descubre nuestros deliciosos brownies y chocolates artesanales. Envío a domicilio en Medellín y Antioquia.',
    url: 'https://tu-proyecto.vercel.app',
    siteName: 'Ambrosia Bhang',
    images: [
      {
        url: '/logo-ambrosia-bhang.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ambrosia Bhang - Brownies y Chocolates Artesanales',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambrosia Bhang - Brownies y Chocolates Artesanales',
    description: 'Descubre nuestros deliciosos brownies y chocolates artesanales. Envío a domicilio en Medellín y Antioquia.',
    images: ['/logo-ambrosia-bhang.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-google-verification-code',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo-ambrosia-bhang.jpeg" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ToasterProvider>
          <SessionProvider session={session}>
            <CartProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </CartProvider>
          </SessionProvider>
        </ToasterProvider>
      </body>
    </html>
  )
}
