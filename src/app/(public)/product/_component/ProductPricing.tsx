"use client";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { CountdownTimer } from "./CountdownTimer";
import { LiveViews } from "./Liveviews";
import { FiThumbsUp } from "react-icons/fi";
interface ProductPricingProps {

    sellingPrice: number;
    offerPrice: number;
    stock: number;
    discountPercent: number;
    discountStartDate?: string;
    discountEndDate?: string;
}

export default function ProductPricing({

    sellingPrice,
    offerPrice,
    stock,
    discountPercent,
    discountStartDate,
    discountEndDate,
}: ProductPricingProps) {
    const now = new Date().getTime();
    const start = discountStartDate ? new Date(discountStartDate).getTime() : 0;
    const end = discountEndDate ? new Date(discountEndDate).getTime() : 0;

    const isOfferActive = offerPrice < sellingPrice && now >= start && now <= end;
    const displayPrice = isOfferActive ? offerPrice : sellingPrice;

    return (
        <div className="space-y-3 md:space-y-4 mt-2 sm:mb-2">
            <div className="flex flex-row  items-center gap-1 md:gap-2 flex-wrap">
                <div className="bg-gray-200 py-1 rounded-full items-center md:gap-4 text-xs text-gray-600 hidden md:block font-semibold">
                    <LiveViews initialCount={10} />
                </div>

                {/* Badges */}
                <div>  {stock > 0 && stock <= 10 && (
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center animate-pulse">
                        <HiLightningBolt />
                        Almost Gone!
                    </span>
                )}</div>
                <div>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center">
                        <HiSparkles />
                        Premium Quality
                    </span>
                </div>
                <div> <span className="flex items-center bg-gray-300 px-2 py-1.5 rounded-full text-black text-xs ">
                    <FiThumbsUp className="w-3 h-3 md:w-4 md:h-4 mr-1 " />
                    89% recommend
                </span></div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl md:rounded-2xl p-2 md:p-6 border border-gray-200 md:mx-0">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            ৳{displayPrice.toFixed(2)}
                        </span>
                        {isOfferActive && (
                            <span className="line-through text-gray-400 text-base md:text-xl">
                                ৳{sellingPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-200">
                            Price per unit
                        </div>
                        <div
                            className={`text-sm md:text-lg font-semibold ${isOfferActive ? "text-red-500 animate-pulse" : "text-primary"
                                }`}
                        >
                            {isOfferActive ? "Super Deal!" : "Best Deal!"}
                        </div>
                    </div>
                </div>

                {isOfferActive && (
                    <div className="mt-1 md:mt-2 flex items-center gap-1 md:gap-2">
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full">
                            {discountPercent}% OFF
                        </span>
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-200">
                            Save ৳{(sellingPrice - offerPrice).toFixed(2)}
                        </span>
                    </div>
                )}

                {isOfferActive && discountEndDate && (
                    <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
                        <div className="text-xs md:text-sm text-red-500 font-semibold">
                            Offer ends:{" "}
                            <CountdownTimer endDate={discountEndDate!} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
