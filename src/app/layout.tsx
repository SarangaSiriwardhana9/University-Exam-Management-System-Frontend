import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Portal - Exam Management System",
  description: "Comprehensive university exam management system for students, faculty, and administrators",
  keywords: ["university", "exam", "management", "education", "portal"],
  authors: [{ name: "University Portal Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <AuthProvider>
            <NuqsAdapter>
              {children}
              <Toaster 
                position="top-right" 
                richColors
                closeButton
                toastOptions={{
                  className: 'shadow-xl',
                  duration: 4000,
                }}
              />
            </NuqsAdapter>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}