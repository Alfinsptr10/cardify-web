import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Modern Minimalist Greeting Card | Cardify',
  description: 'Design a clean, typography-focused minimalist greeting card. Perfect for aesthetic birthdays, modern weddings, and elegant invitations. Create and share instantly.',
  keywords: ['minimalist greeting card', 'modern card template', 'clean aesthetic card', 'simple typography card maker', 'elegant digital invitation'],
  alternates: {
    canonical: '/templates/minimalist',
  },
  openGraph: {
    title: 'Modern Minimalist Greeting Card | Cardify',
    description: 'Create a clean and elegant minimalist greeting card in seconds.',
    url: '/templates/minimalist',
  }
}

export default function MinimalistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // --- INJECT SEO: BREADCRUMB SCHEMA ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cardify-web-kappa.vercel.app/" // Ganti domain nanti
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Templates",
        "item": "https://cardify-web-kappa.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Modern Minimalist",
        "item": "https://cardify-web-kappa.vercel.app/templates/minimalist"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}