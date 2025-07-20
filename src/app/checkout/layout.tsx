import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout - Finalizar Compra | Ambrosia Bhang',
  description: 'Finaliza tu compra de brownies y chocolates artesanales. Pago seguro y envío a domicilio en Medellín y Antioquia.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 