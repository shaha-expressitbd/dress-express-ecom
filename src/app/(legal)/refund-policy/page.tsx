"use client";
import React, { useState, useEffect } from 'react';
import { BiCalendar, BiCheckCircle, BiCreditCard, BiMessageSquare, BiPackage, BiXCircle } from 'react-icons/bi';
import { CgLock } from 'react-icons/cg';
import { FiAlertTriangle, FiRotateCcw } from 'react-icons/fi';
import { RiMicAiLine, RiMvAiLine } from 'react-icons/ri';


export default function RefundPolicyPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const policyData = [
    {
      id: 1,
      title: "Eligibility for Returns",
      icon: <BiCheckCircle className="w-6 h-6" />,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      borderColor: "red-500",
      items: [
        {
          text: "Items must be unused, unwashed, and in original packaging",
          icon: <BiPackage className="w-5 h-5 text-red-500" />
        },
        {
          text: "Return request must be initiated within 7 calendar days of delivery",
          icon: <BiCalendar className="w-5 h-5 text-red-500" />
        },
        {
          text: "Perishable goods, gift cards, and customized items are non-returnable unless defective",
          icon: <FiAlertTriangle className="w-5 h-5 text-orange-500" />
        }
      ]
    },
    {
      id: 2,
      title: "Return Process",
      icon: <FiRotateCcw className="w-6 h-6" />,
      color: "from-pink-500 to-red-500",
      bgColor: "from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20",
      borderColor: "pink-500",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3 mb-4">
              <RiMvAiLine className="w-8 h-8 text-red-500" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Contact Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start your return process</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Email us with your order ID and reason for return. We will issue a Return Authorization (RA) number and arrange collection or drop-off.
            </p>
            <a
              href="mailto:support@yourcompany.com"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <RiMicAiLine className="w-5 h-5 mr-2" />
              support@Azmain Fashion.com
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BiMessageSquare className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Step 1</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contact Support</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BiPackage className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Step 2</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Package Item</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiRotateCcw className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Step 3</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Send Back</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Refund Processing Time",
      icon: <CgLock className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      borderColor: "orange-500",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3 mb-4">
              <CgLock className="w-8 h-8 text-orange-500" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">7-10 Working Days</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average processing time</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. Approved refunds are credited back to your original payment method within <span className="font-bold text-red-600 dark:text-red-400">7–10 working days</span>.
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BiCreditCard className="w-5 h-5 text-red-500" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Payment Method</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Refund will be processed to your original payment method</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Order Cancellations",
      icon: <BiXCircle className="w-6 h-6" />,
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
      borderColor: "red-500",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3 mb-4">
              <BiCheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Free Cancellation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Before dispatch</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Orders can be cancelled at no cost <span className="font-bold text-green-600 dark:text-green-400">before they are dispatched</span>. If your order has already been shipped, please follow the return procedure above.
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-3 mb-4">
              <FiAlertTriangle className="w-8 h-8 text-amber-500" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">After Dispatch</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Return procedure required</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Once shipped, standard return policies apply with potential shipping charges.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Non-Refundable Situations",
      icon: <BiXCircle className="w-6 h-6" />,
      color: "from-red-600 to-pink-600",
      bgColor: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      borderColor: "red-600",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3 mb-4">
              <BiXCircle className="w-8 h-8 text-red-500" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">No Refund Policy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Situations where refunds are not available</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not offer refunds for items that show signs of misuse, intentional damage, or are returned after the 7-day window.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg text-center">
                <FiAlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Misuse</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Signs of improper use</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg text-center">
                <BiXCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Damage</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Intentional damage</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg text-center">
                <CgLock className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Late Return</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">After 7-day window</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-slate-900 dark:via-red-900/20 dark:to-pink-900/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className={`relative mx-auto max-w-7xl md:px-4 px-2 py-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Header */}
        <div className="text-center md:mb-16 mb-8">
          <div className="inline-flex items-center justify-center md:w-16 md:h-16 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full md:mb-6 mb-2 shadow-lg">
            <FiRotateCcw className="md:w-8 md:h-8 w-4 h-4 text-white" />
          </div>
          <h1 className="md:text-5xl text-xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Refund & Return Policy
          </h1>
          <p className="text-sm md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Read our refund, return, and cancellation terms with complete transparency and easy-to-understand guidelines.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 md:mb-12 mb-5">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl md:p-6 p-2 text-center shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BiCalendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">7 Days</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Return Window</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl md:p-6 p-2 text-center shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <CgLock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">7-10 Days</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Refund Processing</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl md:p-6 p-2 text-center shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Free</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cancellation</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl md:p-6 p-2 text-center shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BiPackage className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Easy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Return Process</p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="md:space-y-8 space-y-4">
          {policyData.map((section, index) => (
            <div
              key={section.id}
              className={`transform transition-all duration-500 delay-${index * 100}`}
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center justify-center md:w-12 w-8 md:h-12 h-8 bg-gradient-to-r ${section.color} rounded-xl text-white shadow-lg`}>
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-sm md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {section.id}. {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ${activeSection === section.id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="md:p-6 p-2 border-t border-gray-100 dark:border-gray-700">
                    {section.content || (
                      <div className="space-y-4 mb-2">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800">
                            {item.icon}
                            <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-0.5 rounded-2xl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Need Help with Returns?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our customer support team is here to make your return process as smooth as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center ">
                <button className="inline-flex items-center text-sm md:text-xl md:px-8 px-3 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <RiMvAiLine className="w-5 h-5 mr-2" />
                  Contact Support
                </button>
                <button className="inline-flex items-center text-sm md:text-xl md:px-8 px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <BiMessageSquare className="w-5 h-5 mr-2" />
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}