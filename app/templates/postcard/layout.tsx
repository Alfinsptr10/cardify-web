import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Classic Postcard Template & Maker | Cardify',
  description: 'Send warm wishes with our classic postcard template. A nostalgic, vintage greeting style perfect for holiday greetings, thank you notes, and travel memories.',
  keywords: ['classic postcard maker', 'vintage postcard template', 'retro greeting card', 'digital postcard generator', 'aesthetic mail template'],
  alternates: {
    canonical: '/templates/postcard',
  },
  openGraph: {
    title: 'Classic Postcard Template | Cardify',
    description: 'Send a nostalgic digital postcard to your loved ones.',
    url: '/templates/postcard',
  }
}

export default function PostcardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}