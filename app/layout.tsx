import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import React from "react"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
      <header className="flex items-center p-4">
          <PhoenixLogo size={40} />
          <span className="ml-2 font-bold text-xl text-purple-800">Phoenix</span>
        </header>
        {children}</body>
    </html>
  )
}

export function PhoenixLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-label="Phoenix Logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abstract Phoenix shape */}
      <path
        d="M32 60c-8-8-12-16-12-24 0-8 6-14 14-14s14 6 14 14c0 8-4 16-12 24z"
        fill="#800080"
        stroke="#800080"
        strokeWidth="2"
      />
      <path
        d="M32 36c-4-4-4-10 0-14"
        stroke="#FFA500"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="22" r="2" fill="#FFA500" />
    </svg>
  )
}
