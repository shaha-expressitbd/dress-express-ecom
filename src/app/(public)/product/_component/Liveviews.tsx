// components/LiveViews.tsx
"use client";

import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";

interface LiveViewsProps {
    initialCount: number | string;
    maxIncrement?: number;
    minIntervalMs?: number;
    maxIntervalMs?: number;
}

function formatCount(n: number) {
    if (Number.isNaN(n)) return "0";
    return Math.floor(n).toLocaleString();
}

export function LiveViews({
    initialCount,
    maxIncrement = 2,
    minIntervalMs = 2000,
    maxIntervalMs = 6000,
}: LiveViewsProps) {
    // Coerce initialCount → number, default to 0 on failure
    const startCount = (() => {
        const parsed =
            typeof initialCount === "string"
                ? parseInt(initialCount, 10)
                : initialCount;
        return Number.isNaN(parsed) ? 0 : parsed;
    })();

    const [count, setCount] = useState<number>(startCount);

    useEffect(() => {
        let cancelled = false;

        function scheduleNext() {
            const delay =
                Math.random() * (maxIntervalMs - minIntervalMs) + minIntervalMs;
            setTimeout(() => {
                if (cancelled) return;

                // Random up/down between 0 and maxIncrement
                const direction = Math.random() < 0.5 ? 1 : -1;
                const step = Math.floor(Math.random() * (maxIncrement + 1)) * direction;

                setCount((c) => {
                    let next = c + step;
                    if (next > 190) next = 190;
                    if (next < 10) next = 10;
                    return next;
                });

                scheduleNext();
            }, delay);
        }

        scheduleNext();
        return () => {
            cancelled = true;
        };
    }, [maxIncrement, minIntervalMs, maxIntervalMs]);

    return (
        <span className="px-2 flex items-center text-red-500 text-sm bg-gray-100 rounded-full">
            <FiEye className="w-3 h-3 mr-1" />
            {formatCount(count)}
            {/* only show the text on md+ screens */}
            <span className="md:hidden inline ml-1 p-0.5">Watching</span>
            <span className="hidden md:inline ml-1">
                Online Viewers
            </span>
        </span>
    );
}
