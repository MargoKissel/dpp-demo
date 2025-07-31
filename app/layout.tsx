// app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

// подключаем Inter с нужными весами
const inter = Inter({ subsets: ['latin'], weight: ['400','600','700'] })

export const metadata = { title: 'Digitaler Produktpass', description: '…' }

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
