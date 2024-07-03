import { StaticImageData } from "next/image";

import strkLogo from "../../public/metrologoc.png";
import ethLogo from "../../public/eth.png";

type YieldCardData = {
  typeToken: string;
  legend: "UP TO" | "DOWN TO";
  percent: number;
  logoPath: StaticImageData;
}

export const yieldCardData: YieldCardData[]  = [
  {
    typeToken: "MTK",
    legend: "UP TO",
    percent: 5.00,
    logoPath: strkLogo
  },
  {
    typeToken: "STRK",
    legend: "UP TO",
    percent: 7.00,
    logoPath: strkLogo
  },
  {
    typeToken: "ETH",
    legend: "DOWN TO",
    percent: -1.50,
    logoPath: ethLogo
  }
]