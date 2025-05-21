import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
//import Navbar from "../Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahabang Parang Child Development Center Angono, Rizal",
  description: "Mahabang Parang Child Development Center Angono, Rizal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
  
        {children}</body>
    </html>
  );
}

