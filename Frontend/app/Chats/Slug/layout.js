import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MedAssist AI - Medical Chat Assistant",
  description: "Professional medical chat assistant for healthcare information and guidance",
}

export default function ChatLayout({ children }) {
  return (
    <div className="flex h-full">
      {children}
    </div>
  )
}