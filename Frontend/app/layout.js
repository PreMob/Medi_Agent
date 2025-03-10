import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import { neobrutalism } from '@clerk/themes'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MedAI Assistant",
  description: "Made by MediDevs",
};

export default function RootLayout({ children }) {
  return (
   <ClerkProvider
      appearance={{
         signIn: { baseTheme: neobrutalism },
      }}>
    <html lang="en" suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
     <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange={false}
      >
        <div className="flex flex-col h-full">
          <Navbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider> 
  );
}
