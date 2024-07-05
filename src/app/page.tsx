"use client";

import { YieldCard } from "@/components/ui/YieldCard";

import { yieldCardData } from "../data";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <section className=" py-20 px-10 ">
                <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-5xl font-bold">
                            Yield Tokenization
                        </h1>
                        {/* <p className="text-xl max-w-96">
            The proof of concept requires that when a user
            transfers a MTK token, two tokens are generated, one
            PT(main token) and one YT(yeald token).
          </p> */}
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-screen-2xl mx-auto px-10">
                {yieldCardData.map((data, idx) => (
                    <YieldCard
                        key={idx}
                        link="/yield"
                        typeToken={data.typeToken}
                        legend={data.legend}
                        percent={data.percent}
                        logoPath={data.logoPath}
                    />
                ))}
            </section>
        </div>
    );
}
