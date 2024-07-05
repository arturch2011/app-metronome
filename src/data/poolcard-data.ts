import { StaticImageData } from "next/image";

import metroLogo from "../../public/metrologoc.png";

type PoolCardData = {
  typeToken: string;
  legend: "UP TO" | "DOWN TO";
  percent: number;
  logoPath: StaticImageData;
  tvl: number;
  maturity: number;
};

export const poolsCardData: PoolCardData[]  = [
  {
    typeToken: "MTK",
    legend: "UP TO",
    percent: 5.00,
    logoPath: metroLogo,
    tvl: 20,
    maturity: 11,
  },
]

interface addressMap {
  [key: string]: addressType[];
} 

interface addressType {
  [key: string]: string;
}



export const addressMap: addressMap = {
  "0x012325ba8fb37c73cab1853c5808b9ee69193147413d21594a61581da64ff29d": [
    {
      token: "0x012325ba8fb37c73cab1853c5808b9ee69193147413d21594a61581da64ff29d",
      pt: "0x04a0698b2962ced0254cb2159bdc3057a3b02da61366aeb32e19fa46961a97a7",
      yt: "0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642",
    }
  ]
}