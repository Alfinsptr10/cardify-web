import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retro 8-Bit Gameboy Greeting Card | Cardify',
  description: 'Level up your greetings! Create a nostalgic 8-bit retro console aesthetic card. The perfect interactive template for gamers and pixel art lovers.',
  keywords: ['retro 8-bit card', 'gameboy greeting card', 'gamer birthday card maker', 'pixel art card template', 'interactive console greeting'],
  alternates: {
    canonical: '/templates/retro-gameboy',
  },
  openGraph: {
    title: 'Retro 8-Bit Gameboy Card | Cardify',
    description: 'Create a nostalgic pixel-art greeting card for the gamer in your life.',
    url: '/templates/retro-gameboy',
  }
}

export default function GameboyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}