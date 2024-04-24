import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { twMerge } from 'tailwind-merge'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SmartNew Sistemas',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <head>
        <link
          rel="icon"
          type="favicon"
          href="https://sistemas.smartnewsystem.com.br/favicon.ico"
        />
      </head>
      <body className={twMerge(inter.className, 'antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
