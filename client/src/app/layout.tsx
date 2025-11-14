import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SUI Betting',
  description: 'Decentralized on-chain betting built on Sui Blockchain',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-zinc-50`}
      >
        {/* 
          Outer wrapper:
          - Always full height
          - Centers content vertically/horizontally
        */}
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* 
            Dynamic window container:
            - Full width on small screens
            - Expands to 90% width on large screens
            - Max-width ensures readability (xl breakpoint)
          */}
          <div className="w-full max-w-[1600px] lg:w-[90%]">{children}</div>
        </div>
      </body>
    </html>
  )
}
