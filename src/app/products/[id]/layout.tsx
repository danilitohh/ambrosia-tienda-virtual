import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

// Generar metadatos dinámicos para cada producto
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  })

  if (!product) {
    return {
      title: 'Producto no encontrado - Ambrosia Bhang',
      description: 'El producto que buscas no está disponible.',
    }
  }

  return {
    title: `${product.name} - Ambrosia Bhang`,
    description: `${product.name} - ${product.description || 'Delicioso producto artesanal de Ambrosia Bhang'}. Envío a domicilio en Medellín y Antioquia.`,
    keywords: `${product.name}, brownies, chocolates artesanales, ambrosia bhang, ${product.category?.name || 'postres'}, medellín, colombia`,
    openGraph: {
      title: `${product.name} - Ambrosia Bhang`,
      description: `${product.name} - ${product.description || 'Delicioso producto artesanal'}`,
      images: product.images.length > 0 ? product.images : ['/logo-ambrosia-bhang.jpeg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Ambrosia Bhang`,
      description: `${product.name} - ${product.description || 'Delicioso producto artesanal'}`,
      images: product.images.length > 0 ? product.images : ['/logo-ambrosia-bhang.jpeg'],
    },
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 