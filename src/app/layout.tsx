import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space Like - Chinh Phục Không Gian Mạng Xã Hội",
  description: "Hệ sinh thái mạng xã hội không giới hạn",
};

import { PreferencesProvider } from "@/contexts/PreferencesContext";
import Chatbot from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className="font-sans antialiased selection:bg-brand-accent selection:text-brand-dark"
      >
        <PreferencesProvider>
          {children}
          <Chatbot />
        </PreferencesProvider>
      </body>
    </html>
  );
}
