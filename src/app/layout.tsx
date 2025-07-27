import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Temu - Undangan Pernikahan Digital',
  description: 'Buat undangan pernikahan digital yang elegan dan personal untuk hari bahagia Anda. Mudah dibuat, mudah dibagikan, dan tak terlupakan.',
  keywords: 'undangan pernikahan, undangan digital, wedding invitation, undangan online',
  authors: [{ name: 'Temu Team' }],
  openGraph: {
    title: 'Temu - Undangan Pernikahan Digital',
    description: 'Buat undangan pernikahan digital yang elegan dan personal untuk hari bahagia Anda.',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

