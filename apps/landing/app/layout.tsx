import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CURVAX — P2P Matchday Stands',
  description:
    'True peer-to-peer stadium experience for football fans worldwide. Live pulse, synchronized chants, cryptographic prediction seals, and immortal match capsules. Built on Hyperswarm and Hypercore for the Tether Developers Cup Pears track.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
