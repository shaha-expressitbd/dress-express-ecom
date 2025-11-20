import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers | Dress Express',
    description:
        'Join our team and build the future of e-commerce in Bangladesh. Explore exciting career opportunities.',
};

export default function CareersPage() {

    return (
        <div className="min-h-screen bg-white dark:bg-gray-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 md:mt-0 -mt-4">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-20">
                    <div className="text-center">
                        <h1 className="text-3xl  md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Join Our Team
                        </h1>
                        <p className="text-base text-sm md:text-xl text-red-100 max-w-3xl mx-auto leading-relaxed mb-8">
                            Be part of Bangladesh&apos;s fastest-growing e-commerce platform.
                            We&apos;re looking for passionate individuals to help us shape the
                            future of online shopping.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                            {[
                                '🚀 Growing Team',
                                '💡 Innovation First',
                                '🌟 Great Benefits',
                            ].map((label) => (
                                <div
                                    key={label}
                                    className="bg-white/20 backdrop-blur-sm rounded-lg px-3 md:py-3 md:px-6 py-2 text-white font-semibold"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2 md:px-4 py-8 md:py-16">
                {/* Why Work With Us */}
                <section className="mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-12 text-gray-800 dark:text-red-400">
                        Why Work With Us?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Fast Growth',
                                text: 'Join a rapidly expanding company with endless opportunities for career advancement and professional development.',
                                iconPath:
                                    'M13 10V3L4 14h7v7l9-11h-7z',
                            },
                            {
                                title: 'Great Culture',
                                text: 'Work in a collaborative environment where innovation is encouraged and every voice matters.',
                                iconPath:
                                    'M13 10V3L4 14h7v7l9-11h-7z',
                            },
                            {
                                title: 'Competitive Benefits',
                                text: 'Enjoy competitive salary, health insurance, flexible working hours, and performance bonuses.',
                                iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',

                            },
                        ].map(({ title, text, iconPath }) => (
                            <div
                                key={title}
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-red-100 dark:border-red-600 p-8 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={iconPath}
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
                                    {title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm  text-center">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Open Positions */}
                <section className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800 dark:text-red-400">
                        Open Positions
                    </h2>

                    {/* Example position */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-red-100 dark:border-red-600 overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                            CRM
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="bg-red-100 dark:bg-red-800 dark:text-red-100 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm">
                                                Customer Care
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-start md:items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                📍 Dhaka, Bangladesh
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                💼 Full-time
                                            </p>
                                        </div>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors duration-300 text-sm ">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm ">
                                    Talk with Clients and ensure customer success.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Process */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-red-100 dark:border-red-600 overflow-hidden mb-16">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-white">
                            Application Process
                        </h2>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                'Apply Online',
                                'Initial Review',
                                'Interview',
                                'Final Decision',
                            ].map((step, i) => (
                                <div key={step} className="text-center">
                                    <div className="bg-red-100 dark:bg-red-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-red-600 dark:text-red-100 font-bold text-lg">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                        {step}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                        {/* brief copy per step */}
                                        {[
                                            'Submit your resume and cover letter through our online portal.',
                                            'Our HR team will review your application within 3-5 business days.',
                                            'Phone/video interview followed by technical assessment if applicable.',
                                            "We'll notify you of our decision within 1 week of the final interview.",
                                        ][i]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white">
                    <div className="text-center">
                        <h2 className="text-lg sm:text-2xl font-bold mb-4">
                            Ready to Join Us?
                        </h2>
                        <p className="text-red-100 mb-6 text-sm ">
                            Don&apos;t see a position that fits? Send us your resume anyway!
                            We&apos;re always looking for talented individuals.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="mailto:careers@dressexpress.com"
                                className="bg-white text-red-600 hover:bg-red-50 dark:hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 text-sm "
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                careers@dressexpress.com
                            </a>

                            <a
                                href="tel:+8801855375963"
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 text-sm "
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                HR Department
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
