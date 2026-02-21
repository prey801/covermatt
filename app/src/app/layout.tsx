import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/context/CartContext";
import ToastContainer from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "Covermatt Hardware & Electricals | Kenya's #1 Hardware Store",
  description: "Kenya's trusted online marketplace for quality hardware, electrical supplies, and home improvement products. Fast delivery across Nairobi and major cities.",
  keywords: "hardware, electricals, power tools, plumbing, Nairobi, Kenya, Covermatt",
  openGraph: {
    title: "Covermatt Hardware & Electricals",
    description: "Premium hardware and electrical supplies delivered to your door in Kenya.",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
