import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorX Brand Portal",
  description: "Brand workspace for CreatorX campaigns"
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
