import { format, formatDistanceToNow } from "date-fns";
import numeral from "numeral";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export interface TradeCardProps {
  link: string;
  tradeCardData: {
    logoType: string;
    logoPath: StaticImageData;
    maturityDate: number;
    liquidityValue: number;
    underlyingValue: number;
    impliedValue: number;
    longPercent: number;
    longPrice: number;
    fixedPercent: number;
    fixedPrice: number;
  }
}

export const TradeCard = ({ tradeCardData: { ...trade }, link}: TradeCardProps) => {
  return (
    <div>
      <Link href={ link }>
        <div className="relative w-full p-5 backdrop-blur-sm bg-white/5 rounded-xl flex flex-col gap-2 ">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold ">{ trade.logoType }</h1>
            <Image
              src={ trade.logoPath }
              alt="strk logo"
              width={60}
              height={60}
              className=" bg-baser p-3 rounded-full border-2 border-primary"
            />
          </div>
          <div className="flex items-center justify-between text-primary">
            <p className=" font-bold ">Maturity</p>
            <p>
              <span className="text-cprimary">
                {format(trade.maturityDate, "dd LLL yyyy ")}
              </span>
              { formatDistanceToNow(trade.maturityDate)}
            </p>
          </div>
          <div className="flex items-center justify-between text-primary">
              <p className=" font-bold ">Liquidity</p>
              <p>
                <span className="text-cprimary">
                  { numeral(trade.liquidityValue).format("0,0.00") }
                </span>
              </p>
          </div>
          <div className="flex items-center justify-between text-primary leading-3">
              <p className=" font-bold ">
                Underlying APY
                <span className="block font-light text-sm">
                  Price
                </span>
              </p>
              <p className="text-cprimary text-end">
                { `${trade.underlyingValue}%`}
                <span className="block font-light text-sm">
                  $3,000.53
                </span>
              </p>
          </div>
          <div className="flex items-center justify-between text-primary">
              <p className=" font-bold ">Implied APY</p>
              <p>
                <span className="text-cprimary">
                  { `${trade.impliedValue}%` }
                </span>
              </p>
          </div>
          <div className="flex items-center justify-between sombra border-[1px] border-primary/25 hover:border-cprimary bg-primary/50 rounded-md p-4">
              <div className="flex gap-4 items-center">
                  <h3 className="font-bold text-2xl">YT</h3>
                  <div className="flex flex-col">
                      <p>Long yield APY</p>
                      <p>Price</p>
                  </div>
              </div>
              <div className="flex flex-col">
                  <p>{ `${trade.longPercent}%`}</p>
                  <p>{ numeral(trade.longPrice).format("$0,0.0") }</p>
              </div>
          </div>
          <div className="flex items-center justify-between sombra dois border-[1px] border-cbase/25 hover:border-cbase bg-cbase/50 rounded-md p-4">
              <div className="flex gap-4 items-center">
                  <h3 className="font-bold text-2xl">PT</h3>
                  <div className="flex flex-col">
                      <p>Fixed APY</p>
                      <p>Price</p>
                  </div>
              </div>
              <div className="flex flex-col text-end">
                  <p>{`${trade.fixedPercent}%`}</p>
                  <p>{ numeral(trade.fixedPrice).format("$0,0.0") }</p>
              </div>
          </div>
        </div>
      </Link>
  </div>
  );
};