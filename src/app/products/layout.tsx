import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos - Brownies y Chocolates Artesanales | Ambrosia Bhang',
  description: 'Descubre nuestra selección de brownies y chocolates artesanales. Brownies de chocolate, trufas, galletas y más. Envío a domicilio en Medellín y Antioquia.',
  keywords: 'productos, brownies, chocolates artesanales, brownies medellín, trufas, galletas, postres artesanales, ambrosia bhang',
  openGraph: {
    title: 'Productos - Brownies y Chocolates Artesanales | Ambrosia Bhang',
    description: 'Descubre nuestra selección de brownies y chocolates artesanales. Envío a domicilio en Medellín y Antioquia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Productos - Brownies y Chocolates Artesanales | Ambrosia Bhang',
    description: 'Descubre nuestra selección de brownies y chocolates artesanales.',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 