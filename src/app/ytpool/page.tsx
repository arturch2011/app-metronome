"use client";

import { Mint } from "@/components/mint";
import { Swap } from "@/components/swap";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import strklogo from "/public/metrologoc.png";
import Chart from "@/components/graphs/apy-graph";
// import Example from "@/components/graphs/price-graph";
import Example2 from "@/components/graphs/apy-graph";
import { Three } from "@/components/ui/threelines";
import { addressMap } from "../../data";
import { AddLiq } from "@/components/addliqudity";
import { RmvLiq } from "@/components/removeliq";
import { AddYTLiq } from "@/components/ytliq";

export default function PtYtTrading() {
    const params = useParams();
    const id = params.id;
    const [isPt, setIsPt] = useState(false);
    const [isSwap, setIsSwap] = useState(true);
    const [isApy, setIsApy] = useState(true);

    return (
        <>
            <section className="min-h-screen w-full flex items-center justify-center py-20">
                <div className="flex gap-8 w-full max-w-screen-2xl">
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
                            <p>This is the add liquidity to the lp concept.</p>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <div
                                className={`w-2/3 rounded-xl border-2 ${
                                    isPt ? "border-cbase" : "border-primary"
                                } backdrop-blur-sm flex font-bold`}
                            >
                                <button
                                    onClick={() => {
                                        setIsPt(true);
                                    }}
                                    className={`w-1/2 p-2  rounded-lg ${
                                        isPt
                                            ? "bg-cbase/50 text-cbase"
                                            : "bg-transparent text-slate-500"
                                    }`}
                                >
                                    Zap
                                </button>
                                <button
                                    onClick={() => {
                                        setIsPt(false);
                                    }}
                                    className={`w-1/2 p-2  rounded-lg ${
                                        isPt
                                            ? "bg-transparent text-slate-500"
                                            : "bg-primary/50 text-cprimary"
                                    }`}
                                >
                                    Manual
                                </button>
                            </div>
                            <button className="flex rounded-xl backdrop-blur-sm  px-2 py-1  border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold">
                                Go to Swap
                            </button>
                        </div>
                        <div className="w-full p-5 backdrop-blur-sm bg-white/5  rounded-xl flex flex-col  gap-6">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-lg">
                                    <button
                                        onClick={() => {
                                            setIsSwap(true);
                                        }}
                                        className={` ${
                                            isSwap
                                                ? " text-white"
                                                : " text-slate-500"
                                        } hover:text-slate-300`}
                                    >
                                        Add Liquidity
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsSwap(false);
                                        }}
                                        className={` ${
                                            isSwap
                                                ? " text-slate-500"
                                                : " text-white"
                                        } hover:text-slate-300`}
                                    >
                                        Remove Liquidity
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 rounded-xl backdrop-blur-sm  px-2 py-1  border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold">
                                    <span>0.1%</span>
                                    <IoSettingsSharp />
                                </button>
                            </div>
                            {isSwap ? (
                                <AddYTLiq address={"0x"} />
                            ) : (
                                <RmvLiq address="oi" />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 w-full lg:w-2/3">
                        <div className="flex w-full   gap-6 ">
                            <div className="w-full p-4 backdrop-blur-sm bg-white/5  rounded-xl flex items-center gap-2">
                                <Image
                                    src={strklogo}
                                    alt="strk logo"
                                    width={40}
                                    height={40}
                                    className=" bg-baser  rounded-full border-2 border-primary"
                                />
                                <div className="flex flex-col items-start">
                                    <p>MTK Pool</p>
                                    <p>My Token Metronome</p>
                                </div>
                            </div>
                            <div className="w-full p-4 backdrop-blur-sm bg-white/5  rounded-xl flex items-center">
                                Maturity
                            </div>
                        </div>
                        <div
                            className={`w-full rounded-xl border-2 border-primary backdrop-blur-sm flex font-bold`}
                        >
                            <button
                                onClick={() => {
                                    setIsApy(true);
                                }}
                                className={`w-1/2 p-2  rounded-lg ${
                                    isApy
                                        ? "bg-primary/50 text-cprimary"
                                        : "bg-transparent text-slate-500"
                                }`}
                            >
                                Pool Info
                            </button>
                            <button
                                onClick={() => {
                                    setIsApy(false);
                                }}
                                className={`w-1/2 p-2  rounded-lg ${
                                    isApy
                                        ? "bg-transparent text-slate-500"
                                        : "bg-primary/50 text-cprimary"
                                }`}
                            >
                                Historical APY
                            </button>
                        </div>
                        <div className="flex flex-col w-full ">
                            {isApy ? (
                                <div className="flex flex-col gap-6 w-full justify-around p-5 backdrop-blur-sm bg-white/5  rounded-xl my-4">
                                    <div className="flex w-full items-center justify-start gap-4 mb-4">
                                        <p className="text-2xl font-bold">
                                            This is a test pool just to check
                                            functionalities and add liquidity
                                            for swap and mint tokens.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-6 w-full justify-around p-5 backdrop-blur-sm bg-white/5  rounded-xl">
                                        <div className="w-full flex items-center justify-between">
                                            <p>Total Value Locked</p>
                                            <p>$200,000,000.00</p>
                                        </div>
                                        <div className="w-full flex items-center ">
                                            <span className="w-2/3 h-3 bg-primary rounded-l-full" />
                                            <span className="w-1/3 h-3 bg-cbase rounded-r-full" />
                                        </div>
                                        <div className="w-full flex items-center justify-between">
                                            <div className="flex flex-col items-start">
                                                <p>Underline</p>
                                                <p>$132,000,000.00</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p>PT</p>
                                                <p>$68,000,000.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Example2 />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
