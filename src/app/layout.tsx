import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Navbar from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Metronome",
  description: "DAPP Metronome",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cairo.className}>
        <StarknetProvider>
          <Navbar/>
          {children}
        </StarknetProvider>
      </body>
    </html>
  );
}
