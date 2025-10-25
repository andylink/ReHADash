import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { HAProvider } from "@/lib/ha-context"
import { ThemeProvider } from "@/lib/theme-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Home Assistant Dashboard",
  description: "Custom Home Assistant dashboard with real-time updates",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <HAProvider>{children}</HAProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
