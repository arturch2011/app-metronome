"use client";

import Link from "next/link";
import {
    useBlockNumber,
    useAccount,
    useBalance,
    useContractRead,
    useContract,
    useContractWrite,
    useExplorer,
    useWaitForTransaction,
} from "@starknet-react/core";
import { motion } from "framer-motion";
import { FaLongArrowAltDown } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import contractAbi from "../abis/ammabi.json";

import { useState, useMemo, use } from "react";

require("dotenv").config();

const simpleAddr = process.env.SIMPLE_ADDR;
const mtkAddr = process.env.MTK_ADDR;

interface RmvLiqProps {
    address: string;
}

export const RmvLiq = ({ address }: RmvLiqProps) => {
    const { address: userAddress } = useAccount();
    const [showPopup, setShowPopup] = useState(false);
    const [amount, setAmount] = useState(0);

    const contractAddress =
        "0x1f2e02b552bac62c90a0b2b69a23ce7dcc3072e436cdc72df22aedf8cf32747";

    const myTokenAddr =
        "0x5724882a4f5aef9a5ced3fc2a0258257bde7ccb21d9a66f27855afc07f74821";

    const ptAddress =
        "0x751e927928287a66be78e8ff31b3628c0fb1156bf244ea3eae01b9bc92d2fe";
    const { contract } = useContract({
        abi: contractAbi,
        address: contractAddress,
    });

    const handleSubmit = async () => {
        // TO DO: Implement Starknet logic here
        writeAsync();
    };

    const calls = useMemo(() => {
        if (!userAddress || !contract) return [];
        console.log(userAddress);
        const decimals = 18; // Número de casas decimais do token (verifique no contrato!)
        const amountplus = amount ? amount * 1.05 : 0;
        const amountInWei = BigInt(amount ? amount * 10 ** 18 : 0); // Assumindo 18 casas decimais
        const amountplusInWei = BigInt(amountplus * 10 ** 18); // Assumindo 18 casas decimais

        // return contract.populateTransaction["approve"]!(contractAddress,{ low: (amount ? amount : 0), high: 0 });
        return [
            contract.populateTransaction["remove_liquidity"]!({
                low: amount ? amount : 0,
                high: 0,
            }),
        ];
    }, [contract, userAddress, amount]);

    const {
        writeAsync,
        data: writeData,
        isPending: writeIsPending,
    } = useContractWrite({
        calls,
    });

    const {
        isLoading: waitIsLoading,
        isError: waitIsError,
        error: waitError,
        data: waitData,
    } = useWaitForTransaction({
        hash: writeData?.transaction_hash,
        watch: true,
    });
    const LoadingState = ({ message }: { message: string }) => (
        <div className="flex items-center space-x-2">
            <div className="animate-spin">
                <svg
                    className="h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </div>
            <span>{message}</span>
        </div>
    );

    const buttonContent = () => {
        if (writeIsPending) {
            return <LoadingState message="Remove..." />;
        }

        if (waitIsLoading) {
            return <LoadingState message="Waiting for confirmation..." />;
        }

        if (waitData && waitData.status === "REJECTED") {
            return <LoadingState message="Transaction rejected..." />;
        }

        if (waitData) {
            return "Transaction confirmed";
        }

        return "Remove";
    };
    return (
        <>
            <div className="w-full   flex flex-col items-start  ">
                <div className="w-full flex  mb-1">
                    <p>Shares Input</p>
                </div>
                <div className="w-full rounded-xl border-2 border-primary flex overflow-hidden">
                    <input
                        type="number"
                        onChange={(e) => {
                            setAmount(e.target.valueAsNumber);
                        }}
                        className="bg-transparent w-full focus:outline-none counter p-3"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl mt-4 px-2 py-1 group border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold"
                >
                    {buttonContent()}
                </button>
            </div>
            {showPopup && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-baser px-6 pb-6 rounded-2xl flex flex-col justify-center shadow-2xl"
                    >
                        <div className="flex justify-between">
                            <h1 className="font-bold text-xl mb-4 my-6 pr-10">
                                Chose a token
                            </h1>
                            <button onClick={() => setShowPopup(false)}>
                                <svg
                                    className="h-6 w-6 hover:bg-primary ease-in-out duration-500 inline-flex items-center justify-center  rounded-md"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex gap-4"></div>
                    </motion.div>
                </div>
            )}
        </>
    );
};
