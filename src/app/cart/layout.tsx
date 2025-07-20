import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito de Compras | Ambrosia Bhang',
  description: 'Revisa tu carrito de compras con los mejores brownies y chocolates artesanales de Ambrosia Bhang.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 