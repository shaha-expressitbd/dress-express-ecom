"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import {
    FaShoppingCart,
    FaUsers,
    FaAward,
    FaBolt,
    FaHeart,
    FaRocket,
    FaGlobe,
    FaMobile,
    FaStar,
} from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';

const OurStoryPage = () => {

    const router = useRouter();

    const handleShopNow = () => {
        router.push("/products");
    };
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 md:mt-0 -mt-4">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white md:py-16 py-8 ">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-2xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Our Story
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                        Discover how Azmain Fashion became your trusted partner in online
                        shopping
                    </p>
                    <div className="w-24 h-1 bg-red-300 mx-auto rounded-full" />
                </div>
            </section>

            {/* Main Story Section */}
            <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 dark:text-red-400 mb-6">
                            From Vision to Reality
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                            Azmain Fashion was born from a simple yet powerful vision: to create
                            an online marketplace where quality meets affordability, and every
                            customer feels valued. What started as a dream in a small office
                            has grown into a thriving e-commerce platform serving thousands of
                            satisfied customers worldwide.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                            Our journey began with the belief that online shopping should be
                            more than just transactions—it should be an experience that brings
                            joy, convenience, and trust to every customer interaction.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-700 p-8 rounded-2xl text-white shadow-xl">
                        <FaShoppingCart className="w-16 h-16 mb-6 text-red-200" />
                        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                        <p className="text-lg opacity-90">
                            To democratize online shopping by providing exceptional products
                            at unbeatable prices, backed by outstanding customer service and a
                            seamless digital experience.
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 dark:text-red-400 mb-12 text-center">
                        Our Journey
                    </h2>

                    <div className="space-y-8">
                        {[
                            {
                                year: '2020',
                                title: 'The Beginning',
                                description:
                                    'Founded with a small team and big dreams, focusing on customer satisfaction',
                                icon: <FaRocket className="w-6 h-6" />,
                            },
                            {
                                year: '2021',
                                title: 'Growth Phase',
                                description:
                                    'Expanded product catalog and reached 10,000+ happy customers',
                                icon: <FaUsers className="w-6 h-6" />,
                            },
                            {
                                year: '2022',
                                title: 'Innovation',
                                description:
                                    'Launched mobile app and introduced AI-powered recommendations',
                                icon: <FaMobile className="w-6 h-6" />,
                            },
                            {
                                year: '2023',
                                title: 'Expansion',
                                description:
                                    'Opened international shipping and partnered with premium brands',
                                icon: <FaGlobe className="w-6 h-6" />,
                            },
                            {
                                year: '2024',
                                title: 'Excellence',
                                description:
                                    'Achieved 99.9% customer satisfaction and industry recognition',
                                icon: <FaStar className="w-6 h-6" />,
                            },
                        ].map((m, i) => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg shrink-0">
                                    {m.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border-l-4 border-red-500 dark:border-red-600 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex flex-wrap items-center gap-4 mb-3">
                                            <span className="text-red-600 dark:text-red-400 font-bold text-lg sm:text-xl">
                                                {m.year}
                                            </span>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
                                                {m.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm ">
                                            {m.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 dark:text-red-400 mb-12 text-center">
                        Our Core Values
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaUsers className="w-8 h-8" />,
                                title: 'Customer First',
                                description:
                                    "Every decision we make starts with our customers' needs and satisfaction in mind.",
                            },
                            {
                                icon: <FaAward className="w-8 h-8" />,
                                title: 'Quality Assurance',
                                description:
                                    'We carefully curate every product to ensure it meets our high standards of excellence.',
                            },
                            {
                                icon: <FaBolt className="w-8 h-8" />,
                                title: 'Innovation',
                                description:
                                    'We constantly evolve our platform to provide the latest in e-commerce technology.',
                            },
                            {
                                icon: <FaHeart className="w-8 h-8" />,
                                title: 'Passion',
                                description:
                                    'We love what we do and it shows in every interaction with our customers.',
                            },
                            {
                                icon: <FaShield className="w-8 h-8" />,
                                title: 'Trust & Security',
                                description:
                                    'Your data and transactions are protected with industry-leading security measures.',
                            },
                            {
                                icon: <FaShoppingCart className="w-8 h-8" />,
                                title: 'Convenience',
                                description:
                                    'Making online shopping effortless and enjoyable for everyone, everywhere.',
                            },
                        ].map((v, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-red-500 dark:border-red-600"
                            >
                                <div className="text-red-600 dark:text-red-400 mb-4">
                                    {v.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                                    {v.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm ">
                                    {v.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white mb-16">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { stat: '100K+', label: 'Happy Customers' },
                            { stat: '50K+', label: 'Products' },
                            { stat: '99.9%', label: 'Satisfaction Rate' },
                            { stat: '24/7', label: 'Support' },
                        ].map(({ stat, label }, i) => (
                            <div key={i}>
                                <div className="text-3xl sm:text-4xl font-bold mb-1">
                                    {stat}
                                </div>
                                <div className="text-sm sm:text-base text-red-200">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Future Vision */}
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 dark:text-red-400 mb-6">
                        Looking Forward
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                        As we continue to grow, our commitment remains unchanged: to provide
                        an exceptional shopping experience that exceeds expectations. We're
                        constantly innovating, expanding our product range, and improving
                        our services to serve you better.
                    </p>
                    <div className="bg-red-50 dark:bg-gray-900 p-8 rounded-xl border-l-4 border-red-500 dark:border-red-600">
                        <p className="text-lg sm:text-xl font-semibold text-red-800 dark:text-red-400">
                            &quot;At Azmain Fashion, we don&apos;t just sell products—we create
                            experiences, build relationships, and make online shopping a
                            joy.&quot;
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12 sm:py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                        Be Part of Our Story
                    </h2>
                    <p className="text-lg sm:text-xl mb-8 opacity-90">
                        Join thousands of satisfied customers who trust Azmain Fashion for their
                        online shopping needs.
                    </p>
                    <button onClick={handleShopNow} className="bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-red-50 dark:hover:bg-red-700 transition-colors duration-300 shadow-lg">
                        Start Shopping Today
                    </button>
                </div>
            </section>
        </div>
    );
};

export default OurStoryPage;
