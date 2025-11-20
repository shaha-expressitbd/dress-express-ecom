'use client';

import React, { useState, useEffect } from 'react';
import {
    BiAward,
    BiCheckCircle,
    BiGlobe,
    BiHelpCircle,
    BiPhone,
    BiSearch,
    BiSend,
    BiShield,
} from 'react-icons/bi';
import { BsArrowRight, BsHeadphones, BsMailbox, BsSend } from 'react-icons/bs';
import { CgLock } from 'react-icons/cg';
import { FaStarHalfAlt, FaUsers } from 'react-icons/fa';
import { FiAlertCircle, FiHelpCircle, FiMessageCircle, FiZap } from 'react-icons/fi';
import { GiPaperClip } from 'react-icons/gi';
import { IoAlertCircle } from 'react-icons/io5';
import { LuMessageCircle, LuMessageCircleCode } from 'react-icons/lu';
import { SiTarget } from 'react-icons/si';

const SupportPage = () => {
    /*state  */
    const [activeTab, setActiveTab] = useState<'contact' | 'live-chat' | 'resources' | 'status'>(
        'contact'
    );
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium',
        orderNumber: '',
    });
    const [chatMessages, setChatMessages] = useState<
        { id: number; type: 'bot' | 'user'; message: string; time: string }[]
    >([
        {
            id: 1,
            type: 'bot',
            message: "Hello! I'm here to help. What can I assist you with today?",
            time: '10:30 AM',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    /*static data */
    const supportOptions = [
        {
            id: 'contact',
            title: 'Contact Support',
            icon: FiMessageCircle,
            description: 'Get personalized help from our support team',
            color: 'from-red-500 to-red-600',
        },
        {
            id: 'live-chat',
            title: 'Live Chat',
            icon: BsHeadphones,
            description: 'Chat with our support agents in real-time',
            color: 'from-blue-500 to-blue-600',
        },
        {
            id: 'resources',
            title: 'Help Resources',
            icon: BiHelpCircle,
            description: 'Browse guides, tutorials, and documentation',
            color: 'from-green-500 to-green-600',
        },
        {
            id: 'status',
            title: 'System Status',
            icon: BiShield,
            description: 'Check our service status and uptime',
            color: 'from-purple-500 to-purple-600',
        },
    ] as const;

    const contactMethods = [
        {
            icon: BiPhone,
            title: 'Phone Support',
            description: '+880 1855-375963',
            availability: '24/7 Available',
            color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900',
        },
        {
            icon: BsMailbox,
            title: 'Email Support',
            description: 'support@dressexpress.com',
            availability: 'Response within 2 hours',
            color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900',
        },
        {
            icon: LuMessageCircle,
            title: 'Live Chat',
            description: 'Instant messaging',
            availability: 'Online now',
            color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900',
        },
    ];

    const supportTopics = [
        'Order Issues',
        'Payment Problems',
        'Shipping Questions',
        'Returns & Refunds',
        'Account Help',
        'Technical Issues',
        'Product Information',
        'Billing Questions',
    ];

    const helpResources = [
        {
            category: 'Getting Started',
            articles: [
                { title: 'How to Create an Account', views: '12.5k', helpful: 98 },
                { title: 'Making Your First Order', views: '8.2k', helpful: 96 },
                { title: 'Payment Methods Guide', views: '6.8k', helpful: 94 },
            ],
        },
        {
            category: 'Orders & Shipping',
            articles: [
                { title: 'Tracking Your Order', views: '15.3k', helpful: 99 },
                { title: 'Shipping Options & Times', views: '11.7k', helpful: 97 },
                { title: 'International Shipping', views: '7.4k', helpful: 95 },
            ],
        },
        {
            category: 'Returns & Refunds',
            articles: [
                { title: 'Return Policy Overview', views: '9.6k', helpful: 98 },
                { title: 'How to Return Items', views: '8.9k', helpful: 96 },
                { title: 'Refund Processing Times', views: '6.2k', helpful: 94 },
            ],
        },
    ];

    const systemStatus = [
        { service: 'Website', status: 'operational', uptime: '99.9%' },
        { service: 'Mobile App', status: 'operational', uptime: '99.8%' },
        { service: 'Payment Processing', status: 'operational', uptime: '99.9%' },
        { service: 'Order Management', status: 'operational', uptime: '99.7%' },
        { service: 'Customer Support', status: 'operational', uptime: '99.9%' },
    ];

    const stats = [
        { icon: FaUsers, value: '50+', label: 'Support Agents' },
        { icon: CgLock, value: '< 2 min', label: 'Avg Response Time' },
        { icon: FaStarHalfAlt, value: '4.9/5', label: 'Customer Rating' },
        { icon: BiGlobe, value: '24/7', label: 'Global Support' },
    ];

    /*helpers */
    const getStatusColor = (status: string) =>
    ({
        operational: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
        degraded: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
        outage: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900',
    }[status] || 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800');

    const getStatusIcon = (status: string) =>
    ({
        operational: BiCheckCircle,
        degraded: FiAlertCircle,
        outage: IoAlertCircle,
    }[status] || FiHelpCircle);

    /*handlers */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //console.log('Support ticket submitted:', formData);
        alert('Support ticket submitted successfully!');
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setChatMessages((prev) => [
            ...prev,
            { id: prev.length + 1, type: 'user', message: newMessage, time: timeNow },
        ]);
        setNewMessage('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setChatMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    type: 'bot',
                    message: 'Thank you! I’m processing your request and will reply shortly.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }, 2000);
    };


    return (
        <div className="min-h-screen  bg-white dark:bg-gray-800">
            {/* Hero */}
            <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white md:mt-0 -mt-4">
                <div className="max-w-7xl mx-auto px-2 md:px-4 py-8 md:py-16 text-center">
                    <h1 className="text-2xl md:text-5xl font-bold mb-4">Support Center</h1>
                    <p className="text-sm md:text-xl text-red-100 max-w-3xl mx-auto">
                        We’re here to help you every step of the way. Get instant support, find answers, or
                        connect with our expert team.
                    </p>

                    {/* quick stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold">{value}</div>
                                <div className="text-red-100 text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Support options */}
            <section className="max-w-7xl mx-auto px-2 md:px-4 -mt-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {supportOptions.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => setActiveTab(o.id as typeof activeTab)}
                            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-left group ${activeTab === o.id ? 'ring-2 ring-red-500' : ''
                                }`}
                        >
                            <div
                                className={`w-12 h-12 bg-gradient-to-br ${o.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <o.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{o.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{o.description}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Main area */}
            <main className="max-w-7xl mx-auto px-2 md:px-4 pb-20">
                {/* CONTACT  */}
                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ticket form */}
                        <section className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg md:p-8 p-2">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                                    Submit a Support Ticket
                                </h2>

                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    {/* name + email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Full Name *', name: 'name', type: 'text', required: true },
                                            { label: 'Email Address *', name: 'email', type: 'email', required: true },
                                        ].map(({ label, name, type, required }) => (
                                            <div key={name}>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {label}
                                                </label>
                                                <input
                                                    type={type}
                                                    name={name}
                                                    value={(formData as any)[name]}
                                                    onChange={handleInputChange}
                                                    required={required}
                                                    className="w-full md:px-4 px-2 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Support Topic
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full text-black dark:text-white px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">Select a topic…</option>
                                            {supportTopics.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* priority + order */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Priority Level
                                            </label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="w-full text-black dark:text-white px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            >
                                                {['low', 'medium', 'high', 'urgent'].map((p) => (
                                                    <option key={p} value={p}>
                                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Order Number (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="orderNumber"
                                                value={formData.orderNumber}
                                                onChange={handleInputChange}
                                                placeholder="EMD-123456"
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={6}
                                            required
                                            placeholder="Please describe your issue in detail…"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* actions */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                        >
                                            <GiPaperClip className="w-5 h-5" />
                                            Attach Files
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                                        >
                                            <BiSend className="w-5 h-5" />
                                            Submit Ticket
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        {/* sidebar */}
                        <aside className="space-y-6">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                    Other Ways to Reach Us
                                </h3>
                                <ul className="space-y-4">
                                    {contactMethods.map((m) => (
                                        <li
                                            key={m.title}
                                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
                                                <m.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{m.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">{m.description}</p>
                                                <p className="text-green-600 dark:text-green-400 text-xs font-medium mt-1">
                                                    {m.availability}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className=" bg-white dark:bg-gray-900 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiZap className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Premium Support</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-400 text-sm mb-4">
                                    Need priority assistance? Upgrade for faster response times and dedicated agents.
                                </p>
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/*LIVE CHAT*/}
                {activeTab === 'live-chat' && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                        {/* header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Live Chat Support</h2>
                                <p className="text-red-100">Connected with Agent Sarah</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full" />
                                <span className="text-sm">Online</span>
                            </div>
                        </div>

                        {/* messages */}
                        <div className="h-96 overflow-y-auto p-6 space-y-4">
                            {chatMessages.map((m) => (
                                <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${m.type === 'user'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                            }`}
                                    >
                                        <p>{m.message}</p>
                                        <p
                                            className={`text-xs mt-1 ${m.type === 'user' ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            {m.time}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.1s' }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* input */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-4">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message…"
                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    <BsSend className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESOURCES  */}
                {activeTab === 'resources' && (
                    <section className="space-y-8">
                        <header className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Help Resources</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Browse our comprehensive collection of guides, tutorials, and documentation.
                            </p>
                        </header>

                        {/* search */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search help articles…"
                                    className="w-full pl-12 pr-4 py-3 border text-black dark:text-white border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {helpResources.map((section) => (
                                <article key={section.category} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                        {section.category}
                                    </h3>
                                    <ul className="space-y-4">
                                        {section.articles.map((a) => (
                                            <li key={a.title} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-b-0">
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-red-600 cursor-pointer mb-2">
                                                    {a.title}
                                                </h4>
                                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                    <span>{a.views} views</span>
                                                    <span className="flex items-center gap-1">
                                                        <SiTarget className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        {a.helpful}% helpful
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full mt-4 text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 flex items-center justify-center gap-2">
                                        View All Articles
                                        <BsArrowRight className="w-4 h-4" />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/*STATUS */}
                {activeTab === 'status' && (
                    <section className="space-y-8">
                        <header className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">System Status</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Current operational status of all Azmain Fashion services.
                            </p>
                        </header>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Service Status</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                        All Systems Operational
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                {systemStatus.map((s) => {
                                    const ColorIcon = getStatusIcon(s.status);
                                    return (
                                        <li
                                            key={s.service}
                                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <span className="flex items-center gap-4">
                                                <span
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                                                        s.status
                                                    )}`}
                                                >
                                                    <ColorIcon className="w-4 h-4" />
                                                </span>
                                                <span>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{s.service}</h4>
                                                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                                        {s.status}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="text-right">
                                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                    {s.uptime}
                                                </span>
                                                <br />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">30-day uptime</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <BiAward className="w-8 h-8 text-green-600 dark:text-green-400" />
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    99.9% Uptime Guarantee
                                </h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-400 mb-4">
                                We’re committed to reliability. Our infrastructure is designed for maximum uptime
                                and performance.
                            </p>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                View SLA Details
                            </button>
                        </div>
                    </section>
                )}
            </main>

            {/* Footer CTA */}
            <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Need immediate assistance?</h2>
                    <p className="text-gray-300 mb-6">
                        Our support team is available 24/7 to help you with any questions or concerns.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+8801855375963"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                            <BiPhone className="w-5 h-5" />
                            Call Now: +880 1855-375963
                        </a>
                        <button className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                            <LuMessageCircleCode className="w-5 h-5" />
                            Start Live Chat
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SupportPage;
