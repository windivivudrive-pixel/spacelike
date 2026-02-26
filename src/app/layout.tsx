import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMM Galaxy - Chinh Phục Thiên Hà Mạng Xã Hội",
  description: "Hệ sinh thái mạng xã hội không giới hạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className="font-sans antialiased selection:bg-brand-accent selection:text-brand-dark"
      >
        {children}
      </body>
    </html>
  );
}
