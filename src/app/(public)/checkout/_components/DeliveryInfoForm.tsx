"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaBackward } from "react-icons/fa";

interface PaymentMethod {
    name: string;
    logo: string;
}

interface Props {
    formData: {
        name: string;
        phone: string;
        address: string;
        delivery_area: string;
        note: string;
        paymentMethod: string;
    };
    formErrors: {
        name: string;
        phone: string;
        address: string;
        delivery_area: string;
        note: string;
    };
    insideFee: number;
    subDhakaFee: number;
    outsideFee: number;
    isLoading: boolean;
    handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    handlePaymentMethodChange: (method: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    availablePaymentMethods: PaymentMethod[];
}

const DeliveryInfoForm: React.FC<Props> = ({
    formData,
    formErrors,
    insideFee,
    subDhakaFee,
    outsideFee,
    isLoading,
    handleChange,
    handlePaymentMethodChange,
    handleSubmit,
    onBack,
    availablePaymentMethods,
}) => {
    const [isNoteVisible, setIsNoteVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-2 md:p-8 border border-gray-100">
                <div className="flex items-center md:mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3 hidden md:flex">
                        <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white hidden md:block">
                        ডেলিভারি তথ্য
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="fixed top-2 left-4 z-50 md:hidden flex items-center justify-center w-8 h-10 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-white hover:text-primary transition-colors"
                >
                    <FaBackward className="text-sm text-primary" />
                </button>

                <p className="text-gray-600 dark:text-white md:mb-8 mb-2 bg-blue-50 dark:bg-gray-700 md:p-4 p-2 rounded-lg border-l-4 border-primary pl-10 md:block hidden">
                    অর্ডার কনফার্ম করতে আপনার সঠিক তথ্য দিন
                </p>

                <div className="space-y-2">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block md:mb-2 text-sm font-semibold text-gray-700 dark:text-white mt-10 md:mt-0">
                            আপনার নাম*
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="আপনার নাম লিখুন"
                            className={`w-full px-4 py-1 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${formErrors.name
                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                : "border-gray-200 focus:border-primary hover:border-gray-300"
                                }`}
                            disabled={isLoading}
                        />
                        {formErrors.name && (
                            <p className="mt-2 text-red-600 text-sm flex items-center">Warning: {formErrors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block md:mb-2 text-sm font-semibold text-gray-700 dark:text-white">
                            ফোন নাম্বার*
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            pattern="[0-9]*"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="01xxxxxxxxx (বাংলা ডিজিট গ্রহণযোগ্য)"
                            className={`w-full px-4 py-1 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${formErrors.phone
                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                : "border-gray-200 focus:border-primary hover:border-gray-300"
                                }`}
                            disabled={isLoading}
                        />
                        {formErrors.phone && (
                            <p className="mt-2 text-red-600 text-sm flex items-center">Warning: {formErrors.phone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block md:mb-2 text-sm font-semibold text-gray-700 dark:text-white">
                            ডেলিভারি ঠিকানা*
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="বাসা/ফ্ল্যাট নাম্বর, রোড, এলাকা, থানা"
                            rows={2}
                            className={`w-full px-4 py-1 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${formErrors.address
                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                : "border-gray-200 focus:border-primary hover:border-gray-300"
                                }`}
                            disabled={isLoading}
                        />
                        {formErrors.address && (
                            <p className="mt-2 text-red-600 text-sm flex items-center">Warning: {formErrors.address}</p>
                        )}
                    </div>

                    {/* Delivery Area */}
                    <div>
                        <label htmlFor="delivery_area" className="block md:mb-2 text-sm font-semibold text-gray-700 dark:text-white">
                            ডেলিভারি এলাকা*
                        </label>
                        <select
                            id="delivery_area"
                            name="delivery_area"
                            value={formData.delivery_area}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm text-gray-800 dark:text-white dark:bg-gray-700 ${formErrors.delivery_area
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-primary hover:border-gray-300"
                                }`}
                            disabled={isLoading}
                        >
                            <option value="" disabled hidden>ডেলিভারি লোকেশন নির্বাচন করুন</option>
                            <option value="inside_dhaka">ঢাকার ভিতরে - ৳{insideFee}</option>
                            <option value="outside_dhaka">ঢাকার বাইরে - ৳{outsideFee}</option>
                        </select>
                        {formErrors.delivery_area && (
                            <p className="mt-2 text-red-600 text-sm flex items-center">Warning: {formErrors.delivery_area}</p>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="note" className="block md:mb-2 text-sm font-semibold text-gray-700 dark:text-white">
                                বিশেষ নির্দেশনা (ঐচ্ছিক)
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsNoteVisible(!isNoteVisible)}
                                className="md:hidden ml-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-600"
                            >
                                {isNoteVisible ? "Up" : "Down"}
                            </button>
                        </div>
                        {(isNoteVisible || !isMobile) && (
                            <textarea
                                id="note"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="কোন বিশেষ নির্দেশনা থাকলে লিখুন"
                                rows={2}
                                className={`w-full px-4 py-1 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${formErrors.note
                                    ? "border-red-300 bg-red-50 focus:border-red-500"
                                    : "border-gray-200 focus:border-primary hover:border-gray-300"
                                    }`}
                                disabled={isLoading}
                            />
                        )}
                        {formErrors.note && (
                            <p className="mt-2 text-red-600 text-sm flex items-center">Warning: {formErrors.note}</p>
                        )}
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-green-50 p-2 md:p-6 rounded-xl border border-green-200">
                        <div className={`flex justify-between ${availablePaymentMethods.length === 0 ? 'flex-row' : 'flex-col'}`}>
                            <div className={`flex flex-row items-center gap-3 justify-between mb-2 md:mb-6 ${availablePaymentMethods.length === 0 ? 'flex-col' : 'flex-row'}`}>
                                <h3 className="font-semibold text-gray-800 mb-1">পেমেন্ট পদ্ধতি</h3>
                                <p className="text-sm text-gray-600">নিরাপদ ও সুবিধাজনক</p>
                            </div>

                            <div className={`grid gap-4 ${availablePaymentMethods.length === 0 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-2 w-full'}`}>
                                {/* COD */}
                                <label
                                    className={`flex items-center p-3 border border-gray-300 rounded-lg dark:border-gray-600 cursor-pointer transition-colors ${formData.paymentMethod === "cashOnDelivery"
                                        ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-500"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cashOnDelivery"
                                        checked={formData.paymentMethod === "cashOnDelivery"}
                                        onChange={() => handlePaymentMethodChange("cashOnDelivery")}
                                        className="mr-3 accent-indigo-600"
                                        disabled={isLoading}
                                    />
                                    <Image src="/assets/cod.png" alt="Cash on Delivery" width={50} height={32} />
                                    <span className="text-gray-700 dark:text-gray-200">COD</span>
                                </label>

                                {/* Dynamic SSL Methods */}
                                {availablePaymentMethods.map((method) => (
                                    <label
                                        key={method.name}
                                        className={`flex items-center p-3 border border-gray-300 rounded-lg dark:border-gray-600 cursor-pointer transition-colors ${formData.paymentMethod === method.name
                                            ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-500"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.name}
                                            checked={formData.paymentMethod === method.name}
                                            onChange={() => handlePaymentMethodChange(method.name)}
                                            className="mr-3 accent-indigo-600"
                                            disabled={isLoading}
                                        />
                                        <div className="flex items-center">
                                            {method.logo && (
                                                <Image
                                                    src={method.logo}
                                                    alt={`${method.name} logo`}
                                                    width={32}
                                                    height={32}
                                                    className="mr-2 object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/fallback-image.png";
                                                    }}
                                                />
                                            )}
                                            <span className="text-black dark:text-white">{method.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-xl border border-blue-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="w-6 h-6 rounded-md border-2 border-gray-200 text-primary focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 mt-1"
                                disabled={isLoading}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-white">
                                By proceeding, you acknowledge that you have read and agree to our{" "}
                                <a href="/terms-of-service" className="text-primary hover:underline">Terms & Conditions</a>
                                ,{" "}
                                <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                                , and{" "}
                                <a href="/refund-policy" className="text-primary hover:underline">Return & Refund Policy</a>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DeliveryInfoForm;