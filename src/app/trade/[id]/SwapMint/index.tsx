import { Mint } from "./Mint";
import { Swap } from "./Swap";
import { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";

interface SwapMintProps {
  id: string;
}

export const SwapMint = ({ id }: SwapMintProps) => {
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
        <Swap
          isPt={true}
          address={id}
          pt="0x04a0698b2962ced0254cb2159bdc3057a3b02da61366aeb32e19fa46961a97a7"
          yt="0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642"
        />
      ) : (
        <Mint address="oi" />
      )}
    </div>
  )
}