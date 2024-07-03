interface WalletBalanceProps {
  userAddress: string | undefined;
  balance: { strk: string, pt: string, yt: string };
}

export const WalletBalance = ({ userAddress, balance }: WalletBalanceProps) => {
  return (
    <div className="w-full p-5 backdrop-blur-sm bg-white/5 rounded-xl flex flex-col items-start gap-8 ">
      <div>
        <h2 className="font-bold text-xl">
          Wallet Address:
        </h2>
        <p>
          {userAddress != null
            ? userAddress.slice(0, 15) + "..."
            : "Disconnected"}
        </p>
      </div>

      <div className="flex gap-6">
        <h2 className="font-bold text-xl">
          MTK: {Number(balance.strk).toFixed(2)}
        </h2>
        <h2 className="font-bold text-xl text-purple-400">
          PT: {Number(balance.pt).toFixed(2)}
        </h2>
        <h2 className="font-bold text-xl text-green-400">
          YT: {Number(balance.yt).toFixed(2)}
        </h2>
      </div>
    </div>
  );
};