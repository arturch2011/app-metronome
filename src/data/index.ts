import metroLogo from "../../public/metrologoc.png";
import ethLogo from "../../public/eth.png";
import { YieldCardProps } from "@/components/ui/YieldCard";
import { TradeCardProps } from "@/components/tradecard";
import { PoolsCardProps } from "@/components/ui/poolscard";




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

type PoolsCardData = Omit<PoolsCardProps, "link">;

export const poolsCardData: PoolsCardData[]  = [
  {
    typeToken: "MTK",
    legend: "UP TO",
    percent: 5.00,
    logoPath: metroLogo,
    tvl: 20,
    maturity: 11,
  },
]

let tradeCardsProps: TradeCardProps;

type TradeCardData = Omit<typeof tradeCardsProps.tradeCardData, "link">;

export const tradeCardsData: TradeCardData[] = [
  {
    logoType: "nstSTRK",
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