import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import numeral from "numeral";

export interface PoolsCardProps {
    link: string;
    typeToken: string;
    legend: "UP TO" | "DOWN TO";
    percent: number;
    logoPath: StaticImageData;
    tvl: number;
    maturity: number;
}

export const PoolsCard = ({
    link,
    legend,
    percent,
    logoPath,
    typeToken,
    tvl,
    maturity,
}: PoolsCardProps) => {
    const isPercentNegative = percent < 0;

    return (
        <div>
            <Link href={link}>
                <div
                    className="
            relative
            w-full p-5
            backdrop-blur-sm bg-white/5 rounded-xl 
            flex flex-col 
            border-[1px] border-hidden sombra
            hover:border-primary
            transition duration-700"
                >
                    <header className="text-2xl font-bold mb-4">
                        {typeToken} Pool
                    </header>
                    <p
                        className={`
              text-2xl font-bold 
              ${isPercentNegative ? "text-red-400" : "text-green-400"}
            `}
                    >
                        {`${percent.toFixed(2)} %`} p.a.
                    </p>
                    <p>
                        <span className="font-bold text-xl">
                            ${numeral(tvl).format("0,0.00")}{" "}
                        </span>
                        tvl
                    </p>
                    <div className="w-full flex justify-between items-center pt-4">
                        <p>Maturity</p>
                        <p>{`${maturity} days`}</p>
                    </div>
                    <Image
                        src={logoPath}
                        alt="strk logo"
                        width={80}
                        height={80}
                        className="absolute right-10 top-[-30px] bg-baser p-3 rounded-full border-2 border-primary"
                    />
                </div>
            </Link>
        </div>
    );
};
