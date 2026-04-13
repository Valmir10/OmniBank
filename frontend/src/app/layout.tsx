import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OmniBank - Modern Financial Portal",
  description:
    "Secure financial portal with Open Banking, real-time budgeting, and crypto exchange",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-omni-dark">{children}</div>
      </body>
    </html>
  );
}
