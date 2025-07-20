import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros - Ambrosia Bhang | Brownies y Chocolates Artesanales',
  description: 'Conoce la historia de Ambrosia Bhang. Somos especialistas en brownies y chocolates artesanales en Medellín. Calidad y sabor en cada producto.',
  keywords: 'nosotros, ambrosia bhang, historia, brownies artesanales, chocolates medellín, postres artesanales, calidad',
  openGraph: {
    title: 'Nosotros - Ambrosia Bhang | Brownies y Chocolates Artesanales',
    description: 'Conoce la historia de Ambrosia Bhang. Especialistas en brownies y chocolates artesanales en Medellín.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nosotros - Ambrosia Bhang | Brownies y Chocolates Artesanales',
    description: 'Conoce la historia de Ambrosia Bhang. Especialistas en brownies y chocolates artesanales.',
  },
}

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 