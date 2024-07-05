import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { StarknetProvider } from "../utils/starknet-provider";
import { Navbar } from "@/components/Navbar";
import { Particles } from "@/components/Particles";

import "./globals.css";

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
