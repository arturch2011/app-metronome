"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { SwapMint } from "./SwapMint";
import { GraphDashboard } from "./GraphDashboard";

interface PtYtTradingProps {

}

export default function PtYtTrading({}: PtYtTradingProps) {
  const params = useParams();
  const id = params.id;
  const [isPt, setIsPt] = useState(false);

  return (
    <section className="mt-10 mx-10">
      <div className="flex gap-8 w-full">
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <div className="w-full p-3 backdrop-blur-sm  rounded-xl flex items-start gap-8 sombra border-2 border-primary">
            <svg
              fill="#ec796b"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              height="30px"
              viewBox="0 0 416.979 416.979"
            >
              <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path>{" "}
            </svg>
              <p>This is the PT YT trade concept.</p>
          </div>
          <div className="flex w-full items-center justify-between">
          <div
            className={`w-2/3 rounded-xl border-2 ${
                isPt ? "border-cbase" : "border-primary"
            } backdrop-blur-sm flex font-bold`}
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
