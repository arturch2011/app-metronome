"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Info } from "@phosphor-icons/react";

import { SwapMint } from "./SwapMint";
import { GraphDashboard } from "./GraphDashboard";

interface PtYtTradingProps {

}

export default function PtYtTrading({}: PtYtTradingProps) {
  const params = useParams();
  const id = params.id;
  const [isPt, setIsPt] = useState(false);

  const renderSwitchPtYtButtons = () => (
    <div
      className={` ${isPt ? "border-cbase" : "border-primary"}
        w-2/3 rounded-xl border-2 backdrop-blur-sm flex font-bold`}
    >
      <button
        onClick={() => setIsPt(true)}
        className={`${isPt
          ? "bg-cbase/50 text-cbase"
          : "bg-transparent text-slate-500"
        } w-1/2 p-2  rounded-lg`}
      >
        PT
      </button>
      <button
        onClick={() => setIsPt(false)}
        className={`${isPt
          ? "bg-transparent text-slate-500"
          : "bg-primary/50 text-cprimary"
        } w-1/2 p-2  rounded-lg `}
      >
        YT
      </button>
    </div>
  );

  return (
    <section className="mt-10 mx-10">
      <div className="flex gap-8 w-full">
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <div className="w-full p-3 backdrop-blur-sm  rounded-xl flex items-start gap-8 sombra border-2 border-primary">
            <Info className="text-primary" size={30} />
            <p>This is the PT YT trade concept.</p>
          </div>
          <div className="flex w-full items-center justify-between">
          
          { renderSwitchPtYtButtons() }

          <button className="flex rounded-xl backdrop-blur-sm  px-2 py-1  border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold">
            Go to LP
          </button>
        </div>
        <SwapMint />
      </div>
      <GraphDashboard isPt={isPt} />
    </div>
</section>
);
}
