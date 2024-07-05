// const path = require("path");
const { Account, CallData, Contract, RpcProvider } = require("starknet");
const contractAbi = require("./abi/abi.json");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.autoBurnAll = functions.pubsub
    .schedule("*/3 * * * *")
    .timeZone("Europe/Brussels")
    .onRun(async (context) => {
        try {
            // Lógica da sua função aqui

            //initialize provider with a Sepolia Testnet node
            const myNodeUrl =
                "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
            const provider = new RpcProvider({ nodeUrl: `${myNodeUrl}` });
            const contractAddress =
                "0x2411fba0588c3b29595275c5572d6d1e78e9f6bba293c956748d08d268816d";

            const privateKey0 =
                "0x03fd565e9ec112cf0e3e36b1d28142eba322178c71668df624f43145dec2baae";
            const account0Address =
                "0x004216814c720eC8C306AfBBB6F9cbb517737e8ac4ACF678108396B835b29aE1";
            const account0 = new Account(
                provider,
                account0Address,
                privateKey0
            );

            const { abi: testAbi } = await provider.getClassAt(contractAddress);
            if (testAbi === undefined) {
                throw new Error("no abi.");
            }
            const myTestContract = new Contract(
                testAbi,
                contractAddress,
                provider
            );
            myTestContract.connect(account0);

            const myCall = myTestContract.populate("burnAll", []);
            const res = await myTestContract.burnAll(myCall.calldata);
            await provider.waitForTransaction(res.transaction_hash);
            console.log("Função executada com sucesso após 3 minutos!");
            console.log("Transaction hash:", res.transaction_hash);
        } catch (error) {
            console.error("Erro na execução da função:", error);
        }
    });
