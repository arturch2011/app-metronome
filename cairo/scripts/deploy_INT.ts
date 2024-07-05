import { Account, CallData, Contract, RpcProvider, stark } from "starknet";
import * as dotenv from "dotenv";
import { getCompiledCode } from "./utils";
require("dotenv").config();

const MTK_ADDR = process.env.MTK_ADDR || "";
const PT_ADDR = process.env.PT_ADDR || "";
const YT_ADDR = process.env.YT_ADDR || "";


const RPC_ENDPOINT = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
// const MTK_ADDR = "0x5c9d91c3b78242d6cfe399df198bf176b0910485cfb2e54e4c5d609d745083d";
// const PT_ADDR = "0x04a0698b2962ced0254cb2159bdc3057a3b02da61366aeb32e19fa46961a97a7";
// const YT_ADDR = "0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642";



async function main() {
    const provider = new RpcProvider({
        nodeUrl: RPC_ENDPOINT,
    });

  //   // initialize existing predeployed account 0
    console.log("ACCOUNT_ADDRESS=", process.env.DEPLOYER_ADDRESS);
    console.log("ACCOUNT_PRIVATE_KEY=", process.env.DEPLOYER_PRIVATE_KEY);
    console.log("MTK_ADDR=", MTK_ADDR);
    console.log("PT_ADDR=", PT_ADDR);
    console.log("YT_ADDR=", YT_ADDR);
    const privateKey0 = process.env.DEPLOYER_PRIVATE_KEY ?? "";
    const deployer_address: string = process.env.DEPLOYER_ADDRESS ?? "";
    const account0 = new Account(provider, deployer_address, privateKey0, "1");
    console.log("Account connected.\n");

  // Declare & deploy contract
    let sierraCode, casmCode;

    try {
        ({ sierraCode, casmCode } = await getCompiledCode(
            "cairo_Altruist"
        ));
    } catch (error: any) {
        console.log("Failed to read contract files");
        process.exit(1);
    }

    const myCallData = new CallData(sierraCode.abi);
    const constructor = myCallData.compile("constructor", {
        inctkaddr: MTK_ADDR,
        ptaddr: PT_ADDR,
        ytaddr: YT_ADDR
    });
    try {
        const deployResponse = await account0.declareAndDeploy({
            contract: sierraCode,
            casm: casmCode,
            salt: stark.randomAddress(),
            constructorCalldata: constructor,
        });
        console.log(
            `✅ Spliter-Contract has been deploy with the address: ${deployResponse.deploy.address}`
        );
        console.log(`✅ Contract has been deploy data ${deployResponse.deploy.calldata}`);
    } catch (error: any) {
        console.log("ERRO NO DEPLOYYYY");
        console.log(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
