import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vintage Newspaper Greeting Card Maker | Cardify',
  description: 'Make headline news! Create a unique vintage press and newspaper-style greeting card. Add your own photos and story, then share your aesthetic card online.',
  keywords: ['vintage newspaper card', 'newspaper greeting card generator', 'headline news card maker', 'retro press template', 'unique birthday newspaper'],
  alternates: {
    canonical: '/templates/newspaper',
  },
  openGraph: {
    title: 'Vintage Newspaper Card Maker | Cardify',
    description: 'Turn your greeting into headline news with this vintage newspaper template.',
    url: '/templates/newspaper',
  }
}

export default function NewspaperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}