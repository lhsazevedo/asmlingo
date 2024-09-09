import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Asmlingo",
  description: "The best way to learn SH4 assembly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx("font-sans", nunito.variable)}>
      <body className="min-h-screen flex flex-col px-4 py-6">{children}</body>
    </html>
  );
}
