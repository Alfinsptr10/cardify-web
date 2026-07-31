import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cardify-web-kappa.vercel.app'

  return {
    rules: {
      userAgent: '*', // Berlaku untuk semua mesin pencari (Google, Bing, Yahoo, dll)
      allow: '/',
      // Sembunyikan halaman akun, dashboard, atau API biar gak jadi sampah di Google Search
      disallow: ['/api/', '/account/', '/private/', '/login', '/register'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}