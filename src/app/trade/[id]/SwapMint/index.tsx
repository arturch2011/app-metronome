import { Mint } from "./Mint";
import { Swap } from "./Swap";
import { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";

export const SwapMint = () => {
  const [isSwap, setIsSwap] = useState(true);

  return (
    <div className="w-full p-5 backdrop-blur-sm bg-white/5  rounded-xl flex flex-col  gap-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-lg">
          <button
            onClick={() => setIsSwap(true)}
            className={` ${ isSwap
              ? " text-white"
              : " text-slate-500"
            } hover:text-slate-300`}
          >
            Swap
          </button>
          <button
            onClick={() => setIsSwap(false)}
            className={` ${ isSwap
              ? " text-slate-500"
              : " text-white"
            } hover:text-slate-300`}
          >
            Mint
          </button>
        </div>
        <button className="flex items-center gap-2 rounded-xl backdrop-blur-sm  px-2 py-1  border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold">
          <span>0.1%</span>
          <IoSettingsSharp />
        </button>
      </div>
      {isSwap ? (
        <Swap isPt={true} address="oi" />
      ) : (
        <Mint address="oi" />
      )}
    </div>
  )
}