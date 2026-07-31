import type { Metadata, ResolvingMetadata } from 'next'

// Next.js 15: params adalah Promise
type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  
  return {
    title: `Template ${id} Not Found | Cardify`,
    description: `Template dengan ID ${id} belum tersedia.`,
    // SANGAT PENTING: Mencegah Google meng-index halaman error/fallback ini
    robots: {
      index: false,
      follow: true, // Bot masih boleh mengikuti link "Kembali ke Beranda" atau link template lain di halaman ini
    },
  }
}

export default function DynamicTemplateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}