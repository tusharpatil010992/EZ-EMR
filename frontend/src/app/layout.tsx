import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EZ-EMR",
  description: "Electronic Medical Records Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-gray-50 font-sans text-gray-900" suppressHydrationWarning>{children}</body>
    </html>
  );
}
