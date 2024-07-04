import { TradeCard } from "../../components/tradecard";

import { tradeCardsData } from "../../data";

export default function TradePage() {
    return (
        <div className="min-h-screen w-full">
            <section className=" py-20 px-10 ">
                <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-5xl font-bold">Trading Markets</h1>
                        <p className="text-xl max-w-96">
                            Exit anytime at market price. All yield is streamed
                            to YT until maturity. PT can be redeemed for the
                            underlying asset after maturity.
                        </p>
                    </div>
                </div>
            </section>
            <section className="px-10  ">
                <div className="w-full flex items-center justify-between  h-20 max-w-screen-2xl mx-auto">
                    <div className="border-2 border-primary rounded-xl p-2  focus-within:sombrafocus backdrop-blur-sm flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent  w-2/3 focus:outline-none counter "
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-search h-5 w-5"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                    <button className="flex items-center gap-2 rounded-xl  px-2 py-1 group border-solid border-2 border-primary text-primary hover:bg-primary hover:text-baser ease-in-out duration-500 active:bg-baser active:text-primary active:duration-0 text-lg font-bold">
                        <span>Filter</span>
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 "
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                className="fill-primary group-hover:fill-baser ease-in-out duration-500 group-active:fill-primary group-active:duration-0"
                                d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
                            />
                        </svg>
                    </button>
                </div>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-screen-2xl mx-auto px-10">
                {tradeCardsData.map((tradeCardData, idx) => (
                    <TradeCard
                        key={idx}
                        link={`/trade/${tradeCardData.address}`}
                        tradeCardData={tradeCardData}
                    />
                ))}
            </section>
        </div>
    );
}
