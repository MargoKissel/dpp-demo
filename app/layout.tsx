// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400','600','700'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Digitaler Produktpass',
  description: 'MVP eines Digital Product Passport',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={inter.className}>
      <head />
      <body className="min-h-screen bg-gray-50 flex items-start justify-center p-4">
        {children}
      </body>
    </html>
  )
}
