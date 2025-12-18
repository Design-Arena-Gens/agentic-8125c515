import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Truck Driver\'s Heroic Rescue',
  description: 'An animated story of courage and sacrifice',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
