import metroLogo from "../../public/metrologoc.png";
import ethLogo from "../../public/eth.png";
import { YieldCardProps } from "@/components/YieldCard";
import { StaticImageData } from "next/image";


type YieldCardData = Omit<YieldCardProps, "link">;

export const yieldCardData: YieldCardData[]  = [
  {
    typeToken: "MTK",
    legend: "UP TO",
    percent: 5.00,
    logoPath: metroLogo
  },
  {
    typeToken: "STRK",
    legend: "UP TO",
    percent: 7.00,
    logoPath: metroLogo
  },
  {
    typeToken: "ETH",
    legend: "DOWN TO",
    percent: -1.50,
    logoPath: ethLogo
  }
]

export type TradeCardData = {
  tokenType: string;
  tokenDescription: string;
  logoPath: StaticImageData;
  maturityDate: number;
  liquidityValue: number;
  underlyingValue: number;
  impliedValue: number;
  longPercent: number;
  longPrice: number;
  fixedPercent: number;
  fixedPrice: number;
  address: string;
}

export const tradeCardsData: TradeCardData[] = [
  {
    tokenType: "MTK",
    tokenDescription: "Token MTK description",
    logoPath: metroLogo,
    maturityDate: 1721908800000,
    liquidityValue: 54650292.38,
    underlyingValue: 9.01,
    impliedValue: 22.74,
    longPercent: -100,
    longPrice: 38.5,
    fixedPercent: 15.0,
    fixedPrice: 3800.5,
    address: "0x5c9d91c3b78242d6cfe399df198bf176b0910485cfb2e54e4c5d609d745083d",
  },
  {
    tokenType: "ETH",
    tokenDescription: "Token ETH description",
    logoPath: ethLogo,
    maturityDate: 1721476800000,
    liquidityValue: 32550292.38,
    underlyingValue: 8.02,
    impliedValue: 23.74,
    longPercent: -95,
    longPrice: 39.5,
    fixedPercent: 17.0,
    fixedPrice: 3700.5,
    address: "0x"
  },
]