"use client";
import { useEffect, useState } from "react";

export const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        completed: false
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const end = new Date(endDate);
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    completed: true
                });
                clearInterval(timer);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                days,
                hours,
                minutes,
                seconds,
                completed: false
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (timeLeft.completed) {
        return (
            <div className="bg-gray-100 dark:bg-gray-600 px-3 py-2 rounded-lg text-center">
                <span className="text-sm text-gray-600 dark:text-gray-200">Sale ended</span>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-200 border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-2 text-center dark:text-gray-700">Offer ends in</div>
            <div className="flex justify-center items-center space-x-2">
                <div className="text-center">
                    <div className="text-xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-700">Days</div>
                </div>
                <div className="text-gray-300">:</div>
                <div className="text-center">
                    <div className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-700">Hours</div>
                </div>
                <div className="text-gray-300">:</div>
                <div className="text-center">
                    <div className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-700">Minutes</div>
                </div>
                <div className="text-gray-300">:</div>
                <div className="text-center">
                    <div className="text-xl font-bold text-red-500">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-700">Seconds</div>
                </div>
            </div>
        </div>
    );
};