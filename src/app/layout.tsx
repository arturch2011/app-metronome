import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Particles } from "@/components/particles";

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
                    <Navbar />
                    <Particles className="absolute inset-0 -z-10" />
                    {children}
                </StarknetProvider>
            </body>
        </html>
    );
}
