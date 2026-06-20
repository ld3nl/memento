import { EB_Garamond, Inter, JetBrains_Mono } from 'next/font/google'

export const display = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
