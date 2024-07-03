import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

export interface YieldCardProps {
  link: string;
  typeToken: string;
  legend: "UP TO" | "DOWN TO";
  percent: number;
  logoPath: StaticImageData;
}

export const YieldCard = ({ link, legend, percent, logoPath, typeToken }: YieldCardProps) => {
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
            { typeToken }
          </header>
          <p>{ legend }</p>
          <p 
            className={`
              text-2xl font-bold 
              ${ isPercentNegative ? 'text-red-400': 'text-green-400'}
            `}
          >
            { `${percent.toFixed(2)} %` }
          </p>
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