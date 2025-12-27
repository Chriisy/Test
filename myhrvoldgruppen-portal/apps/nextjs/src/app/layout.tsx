import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { AuthProvider } from "../providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myhrvoldgruppen Portal",
  description: "Enterprise Service Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={GeistSans.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
