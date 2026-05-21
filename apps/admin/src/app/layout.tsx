import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorX Admin",
  description: "Admin control centre for CreatorX"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
