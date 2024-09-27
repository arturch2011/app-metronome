import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import localFont from "next/font/local";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Particles } from "@/components/particles";
import { Toaster } from "sonner";

const cairo = Cairo({ subsets: ["latin"] });
const sourceSans = localFont({
    src: "../../public/fonts/SourceSans3Variable.ttf",
});

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
            <body className={sourceSans.className}>
                <StarknetProvider>
                    <Navbar />
                    <Toaster />
                    <Particles className="absolute inset-0 -z-10" />
                    {children}
                </StarknetProvider>
            </body>
        </html>
    );
}
