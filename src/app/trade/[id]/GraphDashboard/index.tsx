import Image from "next/image";
import { useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import { TradeCardData, tradeCardsData } from "@/data/trade-data";
import { useParams } from "next/navigation";
import { Graph } from "./Graph";
import { apyGraphInitialData, metricsData, priceGraphInitalData } from "@/data/graph-data";
import { Metric } from "./Metric";

interface GraphDashboardProps {
  isPt: boolean;
}

export const GraphDashboard = ({ isPt }: GraphDashboardProps) => {
  const [isApy, setIsApy] = useState(true);
  const { id } = useParams();

  const trade = tradeCardsData.find(data => data.address === id);
  
  const isTradeExist = !!trade;

  const renderDashboardHeader = (trade: TradeCardData) => (
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
          <p>{ isPt ? "PT":"YT"} {trade.tokenType}</p>
          <p>{trade.tokenDescription }</p>
        </div>
      </div>
      <div className="w-full p-4 backdrop-blur-sm bg-white/5  rounded-xl flex items-center">
        {format(trade.maturityDate, "dd LLL yyyy")}
        <span className="font-thin ml-2">{formatDistanceToNow(trade.maturityDate)}</span>
      </div>
    </div>
  );

  const renderSwitchButtons = () => (
    <div className="w-full rounded-xl border-2 border-primary backdrop-blur-sm flex font-bold">
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
  );

  const renderGraphs = (trade: TradeCardData) => {
    const renderMetrics = () => (
      <div className="flex gap-6 w-full justify-around p-5 backdrop-blur-sm bg-white/5  rounded-xl my-4">
        {
          metricsData.map((metric, idx) => (
            <Metric 
              key={idx}
              title={metric.title}
              typeValue={metric.typeValue}
              value={metric.value}
              percent={metric.percent}
            />
          ))
        }
      </div>
    );

    return (
      <div className="flex flex-col w-full ">
        <div>
          <div className="flex w-full items-center justify-start gap-4 mb-4">
            <p className="text-2xl font-bold">
              {isApy
                ? `${trade.impliedValue}%`
                : isPt ? `0.2${trade.tokenType}` : `0.8${trade.tokenType}`
              }
            </p>
            <p className="text-green-400 text-xl">
              50% (Past 7d)
            </p>
          </div>
          <p>
            {isPt
              ? "1 PT rstETH is equal to1 rstETH at maturity."
              : "1 YT rstETH represents the yield of1 rstETH until maturity."}
          </p>
          <Graph initialData={isApy ? apyGraphInitialData : priceGraphInitalData} />
        </div>
        { renderMetrics() }
      </div>
    );
  };  
  
  return isTradeExist ? (
    <div className="flex flex-col gap-6 w-full lg:w-2/3">
      { renderDashboardHeader(trade) }
      { renderSwitchButtons() }
      { renderGraphs(trade) }
    </div>
  ) : (
    <div>Not found</div>
  )
}