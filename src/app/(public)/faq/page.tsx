'use client';

import React, { useState, useEffect } from 'react';
import {
    BiCheckCircle,
    BiChevronDown,
    BiChevronUp,
    BiCreditCard,
    BiHelpCircle,
    BiPackage,
    BiPhone,
    BiSearch,
} from 'react-icons/bi';
import { CgLock } from 'react-icons/cg';
import { FaUsers } from 'react-icons/fa';
import { FcPackage } from 'react-icons/fc';
import { FiMessageCircle, FiRefreshCw } from 'react-icons/fi';

const FAQPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [filteredFAQs, setFilteredFAQs] = useState<
        {
            id: number;
            category: string;
            question: string;
            answer: string;
            popular: boolean;
        }[]
    >([]);

    /*static data*/
    const categories = [
        { id: 'all', name: 'All Questions', icon: BiHelpCircle, count: 24 },
        { id: 'orders', name: 'Orders & Shipping', icon: BiPackage, count: 8 },
        { id: 'payments', name: 'Payment & Billing', icon: BiCreditCard, count: 6 },
        { id: 'returns', name: 'Returns & Refunds', icon: FiRefreshCw, count: 5 },
        { id: 'account', name: 'Account & Profile', icon: FaUsers, count: 5 },
    ];

    const faqData = [
        /*unchanged FAQ objects */
        {
            id: 1,
            category: 'orders',
            question: 'How long does shipping take?',
            answer:
                'Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days)…',
            popular: true,
        },
        {
            id: 2,
            category: 'orders',
            question: 'Can I track my order?',
            answer:
                'Yes! Once your order ships, you’ll receive a tracking number via email…',
            popular: true,
        },
        {
            id: 3,
            category: 'payments',
            question: 'What payment methods do you accept?',
            answer:
                'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Amazon Pay…',
            popular: true,
        },
        {
            id: 4,
            category: 'returns',
            question: 'What is your return policy?',
            answer:
                'We offer a 30-day return policy for most items. Items must be unused…',
            popular: true,
        },
        {
            id: 5,
            category: 'account',
            question: 'How do I create an account?',
            answer:
                'Click “Sign Up” in the top-right corner, enter your email and create a password…',
            popular: false,
        },
        {
            id: 6,
            category: 'orders',
            question: 'Can I modify or cancel my order?',
            answer: 'You can modify or cancel your order within 1 hour of placing it. After that, orders enter our fulfillment process and cannot be changed. Contact customer service immediately for urgent changes.',
            popular: false
        },
        {
            id: 7,
            category: 'payments',
            question: 'Is my payment information secure?',
            answer: 'Absolutely! We use 256-bit SSL encryption and are PCI DSS compliant. We never store your full credit card information on our servers. All transactions are processed through secure payment gateways.',
            popular: false
        },
        {
            id: 8,
            category: 'returns',
            question: 'How do I initiate a return?',
            answer: 'Log into your account, go to "My Orders", find your order, and click "Return Items". Select the items you want to return, choose a reason, and we\'ll email you a prepaid return label.',
            popular: false
        },
        {
            id: 9,
            category: 'orders',
            question: 'Do you offer international shipping?',
            answer: 'Yes! We ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. Customs fees may apply and are the responsibility of the customer.',
            popular: false
        },
        {
            id: 10,
            category: 'account',
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. The link expires in 24 hours for security.',
            popular: false
        }
    ];

    const stats = [
        { icon: FaUsers, value: '20K+', label: 'Happy Customers' },
        { icon: FcPackage, value: '300K+', label: 'Orders Delivered' },
        { icon: CgLock, value: '24/7', label: 'Customer Support' },
        { icon: BiCheckCircle, value: '99.9%', label: 'Satisfaction Rate' },
    ];

    /* filtering */
    useEffect(() => {
        let list = faqData;
        if (selectedCategory !== 'all') {
            list = list.filter((f) => f.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
            );
        }
        setFilteredFAQs(list);
    }, [selectedCategory, searchQuery]);

    const toggleAccordion = (id: number) =>
        setOpenAccordion((prev) => (prev === id ? null : id));


    return (
        <div className="min-h-screen bg-white dark:bg-gray-800">
            {/* Hero */}
            <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white md:mt-0 -mt-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-base md:text-xl text-red-100 max-w-3xl mx-auto">
                        Find answers to common questions about Azmain Fashion’s products, services,
                        and policies.
                    </p>
                </div>
            </header>

            {/* Search */}
            <section className="-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8">
                    <div className="relative max-w-2xl mx-auto">
                        <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Search for answers…"
                            className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto md:px-4 px-2 lg:px-8 mt-12 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div
                            key={label}
                            className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                                {value}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Content */}
            <main className="max-w-7xl mx-auto md:px-4 px-2 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                Categories
                            </h2>
                            <ul className="space-y-2">
                                {categories.map(({ id, name, icon: Icon, count }) => (
                                    <li key={id}>
                                        <button
                                            onClick={() => setSelectedCategory(id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${selectedCategory === id
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{name}</span>
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${selectedCategory === id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                    }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* FAQ list */}
                    <section className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                            {/* header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {selectedCategory === 'all'
                                        ? 'All Questions'
                                        : categories.find((c) => c.id === selectedCategory)?.name}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {filteredFAQs.length} question
                                    {filteredFAQs.length !== 1 && 's'} found
                                </p>
                            </div>

                            {/* accordion */}
                            <div className="p-6">
                                {filteredFAQs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <BiHelpCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                            No questions found
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Try adjusting your search or browse different categories.
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {filteredFAQs.map((f) => (
                                            <li key={f.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => toggleAccordion(f.id)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className="text-sm  font-semibold text-gray-800 dark:text-gray-100">
                                                            {f.question}
                                                        </span>
                                                        {f.popular && (
                                                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                                                Popular
                                                            </span>
                                                        )}
                                                    </span>
                                                    {openAccordion === f.id ? (
                                                        <BiChevronUp className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <BiChevronDown className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </button>
                                                {openAccordion === f.id && (
                                                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-4 text-sm ">
                                                            {f.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* CTA */}
            <footer className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-base md:text-xl text-red-100 mb-6 max-w-2xl mx-auto">
                        Our customer support team is here to help you 24/7.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-white text-red-600 px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 text-sm ">
                            <FiMessageCircle className="w-5 h-5" />
                            Live Chat
                        </button>
                        <button className="bg-red-800 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-red-900 transition-colors flex items-center gap-2 text-sm ">
                            <BiPhone className="w-5 h-5" />
                            <a href="tel:01855375963">Call Support</a>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FAQPage;
