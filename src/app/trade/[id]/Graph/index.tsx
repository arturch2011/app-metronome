import Image from "next/image";
import { useState } from "react";

import Example from "@/components/graphs/price-graph";

import { format, formatDistanceToNow } from "date-fns";
import { tradeCardsData } from "@/data";
import { useParams } from "next/navigation";

interface GraphProps {
  isPt: boolean;
}

export const Graph = ({ isPt }: GraphProps) => {
  const [isApy, setIsApy] = useState(true);
  const { id } = useParams();

  const trade = tradeCardsData.find((trade, idx) => idx === Number(id));
  
  return !!trade ? (
    <div className="flex flex-col gap-6 w-full lg:w-2/3">
      <div className="flex w-full   gap-6 ">
        <div className="w-full p-4 backdrop-blur-sm bg-white/5  rounded-xl flex items-center gap-2">
          <Image
            src={trade.logoPath}
            alt="strk logo"
            width={40}
            height={40}
            className=" bg-baser  rounded-full border-2 border-primary"
          />
          <div className="flex flex-col items-start">
            <p>{ isPt ? "PT":"YT"} {"trade.tokenType"}</p>
            <p>{trade.tokenDescription }</p>
          </div>
        </div>
        <div className="w-full p-4 backdrop-blur-sm bg-white/5  rounded-xl flex items-center">
          {format(trade.maturityDate, "dd LLL yyyy")}
          <span className="font-thin ml-2">{formatDistanceToNow(trade.maturityDate)}</span>
        </div>
      </div>
      <div
        className={`w-full rounded-xl border-2 border-primary backdrop-blur-sm flex font-bold`}
      >
        <button
          onClick={() => setIsApy(true)}
          className={`${isApy
            ? "bg-primary/50 text-cprimary"
            : "bg-transparent text-slate-500"
          } w-1/2 p-2  rounded-lg`}
        >
          APY
        </button>
        <button
          onClick={() => setIsApy(false)}
          className={`${isApy
            ? "bg-transparent text-slate-500"
            : "bg-primary/50 text-cprimary"
          } w-1/2 p-2  rounded-lg`}
        >
          Price
        </button>
      </div>
      <Example />
    </div>
  ) : (
    <div>Not found</div>
  )
}