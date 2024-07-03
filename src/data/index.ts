import metroLogo from "../../public/metrologoc.png";
import ethLogo from "../../public/eth.png";
import { YieldCardProps } from "@/components/ui/YieldCard";
import { TradeCardProps } from "@/app/trade/TradeCard";


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

let tradeCardsProps: TradeCardProps;

type TradeCardData = Omit<typeof tradeCardsProps.tradeCardData, "link">;

export const tradeCardsData: TradeCardData[] = [
  {
    logoType: "MTK",
    logoPath: metroLogo,
    maturityDate: 1721908800000,
    liquidityValue: 54650292.38,
    underlyingValue: 9.01,
    impliedValue: 22.74,
    longPercent: -100,
    longPrice: 38.5,
    fixedPercent: 15.0,
    fixedPrice: 3800.5,
  },
  {
    logoType: "ETH",
    logoPath: ethLogo,
    maturityDate: 1721908800000,
    liquidityValue: 32550292.38,
    underlyingValue: 8.02,
    impliedValue: 23.74,
    longPercent: -95,
    longPrice: 39.5,
    fixedPercent: 17.0,
    fixedPrice: 3700.5,
  },
]