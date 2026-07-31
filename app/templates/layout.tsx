import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Aesthetic Greeting Card & Photobooth Templates | Cardify',
  description: 'Browse our curated library of beautiful, customizable digital greeting card templates and interactive web stories. Free to use and share instantly.',
  keywords: ['greeting card templates', 'aesthetic card designs', 'free ecards', 'photobooth templates', 'digital invitations'],
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Explore Cardify Templates',
    description: 'Find your perfect aesthetic card or photostrip design.',
    url: '/templates',
  }
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}