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
import contractAbi from "../abis/ammabi.json";
import myTokenAbi from "../abis/mTAbi.json";
import ptTokenAbi from "../abis/ptabi.json";
import ytTokenAbi from "../abis/ytabi.json";
import { toast } from "sonner";
import { MdSwapVert } from "react-icons/md";
import { motion } from "framer-motion";
import { useState, useMemo, use } from "react";

require("dotenv").config();

const mtkAddr = process.env.NEXT_PUBLIC_MTK_ADDR || "";
const ptkAddr = process.env.NEXT_PUBLIC_PT_ADDR || "";
const ytkAddr = process.env.NEXT_PUBLIC_YT_ADDR || "";
const contractAddr = process.env.NEXT_PUBLIC_AMM_ADDR || "";
const contractYt = process.env.NEXT_PUBLIC_AMMY_ADDR || "";

interface SwapProps {
    isPt: boolean;
    address: string;
    pt: string;
    yt: string;
}

export const Swap = ({ isPt, address, pt, yt }: SwapProps) => {
    const { address: userAddress } = useAccount();
    const [amount, setAmount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const {
        isLoading: balanceIsLoading,
        isError: balanceIsError,
        error: balanceError,
        data: balanceData,
    } = useBalance({
        token: mtkAddr,
        address: userAddress,
        watch: true,
    });

    const {
        isLoading: balancePTIsLoading,
        isError: balancePTIsError,
        error: balancePTError,
        data: balancePTData,
    } = useBalance({
        token: ptkAddr,
        address: userAddress,
        watch: true,
    });
    const {
        isLoading: balanceYTIsLoading,
        isError: balanceYTIsError,
        error: balanceYTError,
        data: balanceYTData,
    } = useBalance({
        token: ytkAddr,
        address: userAddress,
        watch: true,
    });

    let ptbal = "0";
    let ytbal = "0";
    let strkbal = "0";

    let contractAddress = "";
    let sendingToken = "";
    if (isPt) {
        contractAddress = contractAddr;
        sendingToken = ptkAddr;
    } else {
        sendingToken = ytkAddr;
        contractAddress = contractYt;
    }

    if (!balanceIsLoading && !balanceIsError) {
        strkbal = balanceData?.formatted!;
    }

    if (!balancePTIsLoading && !balancePTIsError) {
        ptbal = balancePTData?.formatted!;
    }

    if (!balanceYTIsLoading && !balanceYTIsError) {
        ytbal = balanceYTData?.formatted!;
    }
    const { contract } = useContract({
        abi: contractAbi,
        address: contractAddress,
    });
    const contractapprove = useContract({
        abi: myTokenAbi,
        address: mtkAddr,
    });
    const { contract: contractpt } = useContract({
        abi: ptTokenAbi,
        address: ptkAddr,
    });
    const { contract: contractyt } = useContract({
        abi: ytTokenAbi,
        address: ytkAddr,
    });

    const handleSubmit = async () => {
        // TO DO: Implement Starknet logic here
        writeAsync();
    };

    const calls = useMemo(() => {
        if (
            !userAddress ||
            !contract ||
            !contractapprove ||
            !contractpt ||
            !contractyt
        )
            return [];
        console.log(userAddress);
        const amountInWei = BigInt(amount ? amount * 10 ** 18 : 0); // Assumindo 18 casas decimais

        // return contract.populateTransaction["approve"]!(contractAddress,{ low: (amount ? amount : 0), high: 0 });
        return [
            contractyt.populateTransaction["approve"]!(contractAddress, {
                low: amountInWei ? amountInWei : 0,
                high: 0,
            }),
            contractpt.populateTransaction["approve"]!(contractAddress, {
                low: amountInWei ? amountInWei : 0,
                high: 0,
            }),
            contractapprove.contract?.populateTransaction["approve"]!(
                contractAddress,
                {
                    low: amountInWei ? amountInWei : 0,
                    high: 0,
                }
            ),
            contract.populateTransaction["swap"]!(sendingToken, {
                low: amountInWei ? amountInWei : 0,
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
            return <LoadingState message="Swap..." />;
        }

        if (waitIsLoading) {
            return <LoadingState message="Waiting for confirmation..." />;
        }

        if (waitData && waitData.status === "REJECTED") {
            toast.error("Transaction rejected");
            return <LoadingState message="Transaction rejected..." />;
        }

        if (waitData) {
            toast.success("Transaction confirmed");
            return "Transaction confirmed";
        }

        return "Swap";
    };
    return (
        <>
            <div className="w-full  flex flex-col items-start  ">
                <div className="w-full flex justify-between mb-1">
                    <p>Input</p>
                    <p>
                        Balance:{" "}
                        {isPt
                            ? Number(ptbal).toFixed(2)
                            : Number(ytbal).toFixed(2)}
                    </p>
                </div>
                <div className="w-full rounded-xl border-2 border-primary flex overflow-hidden">
                    <input
                        type="number"
                        onChange={(e) => {
                            setAmount(e.target.valueAsNumber);
                        }}
                        className="bg-transparent w-2/3 focus:outline-none counter p-3"
                    />
                    <button
                        onClick={() => setShowPopup(true)}
                        className=" border-l-2 border-primary text-primary hover:bg-primary hover:text-baser w-1/3 ease-in-out duration-500  p-3 active:bg-baser active:text-primary active:duration-0 font-bold"
                    >
                        {isPt ? "PT MTK" : "YT MTK"}
                    </button>
                </div>
                <MdSwapVert className="self-center text-primary text-4xl my-2" />

                <div className="w-full rounded-xl border-2 border-primary flex overflow-hidden mb-4">
                    {/* <input
                        type="number"
                        onChange={(e) => {
                            setAmount((e.target.valueAsNumber * 10) ^ 18);
                        }}
                        className="bg-transparent w-2/3 focus:outline-none counter p-3"
                    /> */}
                    <p className="w-2/3 p-3">
                        {isPt ? amount * 1.05 : amount / 20}
                    </p>
                    <button
                        onClick={() => setShowPopup(true)}
                        className=" border-l-2 border-primary text-primary hover:bg-primary hover:text-baser w-1/3 ease-in-out duration-500  p-3 active:bg-baser active:text-primary active:duration-0 font-bold"
                    >
                        MTK
                    </button>
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl text-center  px-2 py-1 group border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold"
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
