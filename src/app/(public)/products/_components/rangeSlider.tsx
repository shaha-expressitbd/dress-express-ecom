import React, { useState, useRef, useEffect, useCallback } from 'react';

interface RangePriceFilterProps {
    minPrice?: number;
    maxPrice?: number;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const RangePriceFilter: React.FC<RangePriceFilterProps> = ({
    minPrice: initialMinPrice = 0,
    maxPrice: initialMaxPrice = 1000000, // Increased max price
    priceRange,
    setPriceRange,
}) => {
    const MIN_PRICE = Math.max(0, initialMinPrice);
    const MAX_PRICE = Math.max(MIN_PRICE + 100, initialMaxPrice);
    const [minHandlePos, setMinHandlePos] = useState<number>(0);
    const [maxHandlePos, setMaxHandlePos] = useState<number>(100);
    const sliderTrackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<'min' | 'max' | null>(null);

    // Initialize positions based on priceRange
    useEffect(() => {
        const [min, max] = priceRange;
        const clampedMin = Math.max(MIN_PRICE, Math.min(max - 100, min));
        const clampedMax = Math.max(clampedMin + 100, Math.min(MAX_PRICE, max));

        // Only update if values have changed to prevent infinite loop
        if (clampedMin !== priceRange[0] || clampedMax !== priceRange[1]) {
            setPriceRange([clampedMin, clampedMax]);
        }
        setMinHandlePos(((clampedMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100);
        setMaxHandlePos(((clampedMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100);
    }, [MIN_PRICE, MAX_PRICE, priceRange, setPriceRange]);

    const calculatePriceFromPosition = useCallback(
        (percentage: number) => {
            const price = MIN_PRICE + (percentage / 100) * (MAX_PRICE - MIN_PRICE);
            return Math.round(price / 10) * 10;
        },
        [MIN_PRICE, MAX_PRICE]
    );

    const calculatePositionFromPrice = useCallback(
        (price: number) => {
            return ((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
        },
        [MIN_PRICE, MAX_PRICE]
    );

    const handleMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(MIN_PRICE, Math.min(Number(e.target.value), priceRange[1] - 100));
            setPriceRange([value, priceRange[1]]);
            setMinHandlePos(calculatePositionFromPrice(value));
        },
        [priceRange, setPriceRange, calculatePositionFromPrice]
    );

    const handleMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(MAX_PRICE, Math.max(Number(e.target.value), priceRange[0] + 100));
            setPriceRange([priceRange[0], value]);
            setMaxHandlePos(calculatePositionFromPrice(value));
        },
        [priceRange, setPriceRange, calculatePositionFromPrice]
    );

    const handleMove = useCallback(
        (clientX: number) => {
            if (!isDragging.current || !sliderTrackRef.current) return;

            const rect = sliderTrackRef.current.getBoundingClientRect();
            let percentage = ((clientX - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));

            if (isDragging.current === 'min') {
                const newPercentage = Math.min(percentage, maxHandlePos - 1);
                const newPrice = calculatePriceFromPosition(newPercentage);
                setMinHandlePos(newPercentage);
                setPriceRange([newPrice, priceRange[1]]);
            } else {
                const newPercentage = Math.max(percentage, minHandlePos + 1);
                const newPrice = calculatePriceFromPosition(newPercentage);
                setMaxHandlePos(newPercentage);
                setPriceRange([priceRange[0], newPrice]);
            }
        },
        [maxHandlePos, minHandlePos, priceRange, setPriceRange, calculatePriceFromPosition]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            handleMove(e.clientX);
        },
        [handleMove]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
        },
        [handleMove]
    );

    const handleMouseUp = useCallback(() => {
        isDragging.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
    }, [handleMouseMove, handleTouchMove]);

    const handleMouseDown = useCallback(
        (handleType: 'min' | 'max') => {
            isDragging.current = handleType;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleMouseUp);
        },
        [handleMouseMove, handleTouchMove, handleMouseUp]
    );

    const handleTrackClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!sliderTrackRef.current) return;

            const rect = sliderTrackRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
            const clickPrice = calculatePriceFromPosition(percentage);

            const minDistance = Math.abs(clickPrice - priceRange[0]);
            const maxDistance = Math.abs(clickPrice - priceRange[1]);

            if (minDistance < maxDistance) {
                const newMinPrice = Math.min(clickPrice, priceRange[1] - 100);
                setPriceRange([newMinPrice, priceRange[1]]);
                setMinHandlePos(calculatePositionFromPrice(newMinPrice));
            } else {
                const newMaxPrice = Math.max(clickPrice, priceRange[0] + 100);
                setPriceRange([priceRange[0], newMaxPrice]);
                setMaxHandlePos(calculatePositionFromPrice(newMaxPrice));
            }
        },
        [priceRange, setPriceRange, calculatePriceFromPosition, calculatePositionFromPrice]
    );

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleMouseMove, handleTouchMove, handleMouseUp]);

    return (
        <div className="price-filter p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="label mb-4">
                <span className="text-lg font-semibold text-black dark:text-white">Price Range (৳)</span>
            </div>

            <div className="slider-container mb-6">
                <div
                    ref={sliderTrackRef}
                    className="slider-track h-2 bg-gray-200 dark:bg-gray-600 rounded-full relative cursor-pointer"
                    onClick={handleTrackClick}
                >
                    <div
                        className="slider-range h-full bg-primary absolute rounded-full"
                        style={{
                            left: `${minHandlePos}%`,
                            width: `${maxHandlePos - minHandlePos}%`,
                        }}
                    ></div>

                    <div
                        className="min-handle absolute w-4 h-4 bg-primary rounded-full cursor-pointer -translate-y-1/2 top-1/2 z-10 shadow-md hover:bg-red-600 transition-colors"
                        style={{ left: `${minHandlePos}%` }}
                        onMouseDown={() => handleMouseDown('min')}
                        onTouchStart={() => handleMouseDown('min')}
                        role="slider"
                        aria-valuenow={priceRange[0]}
                        aria-valuemin={MIN_PRICE}
                        aria-valuemax={priceRange[1] - 100}
                        aria-label="Minimum price"
                    ></div>

                    <div
                        className="max-handle absolute w-4 h-4 bg-primary rounded-full cursor-pointer -translate-y-1/2 top-1/2 z-10 shadow-md hover:bg-red-600 transition-colors"
                        style={{ left: `${maxHandlePos}%` }}
                        onMouseDown={() => handleMouseDown('max')}
                        onTouchStart={() => handleMouseDown('max')}
                        role="slider"
                        aria-valuenow={priceRange[1]}
                        aria-valuemin={priceRange[0] + 100}
                        aria-valuemax={MAX_PRICE}
                        aria-label="Maximum price"
                    ></div>
                </div>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="range-input min-price flex-1">
                    <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Min (৳)
                    </label>
                    <input
                        type="number"
                        id="min-price"
                        className="w-full p-2 border dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-red-500"
                        value={priceRange[0]}
                        onChange={handleMinChange}
                        min={MIN_PRICE}
                        max={priceRange[1] - 100}
                        step="10" // Changed to 10 for finer control
                    />
                </div>

                <div className="range-input max-price flex-1">
                    <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max (৳)
                    </label>
                    <input
                        type="number"
                        id="max-price"
                        className="w-full p-2 border dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                        value={priceRange[1]}
                        onChange={handleMaxChange}
                        min={priceRange[0] + 100}
                        max={MAX_PRICE}
                        step="10" // Changed to 10 for finer control
                    />
                </div>
            </div>
        </div>
    );
};

export default RangePriceFilter;