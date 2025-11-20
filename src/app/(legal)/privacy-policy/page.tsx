"use client";
import { useEffect, useState } from 'react';
import { BiChevronRight, BiLock, BiShield } from 'react-icons/bi';
import { BsEye, BsMailbox } from 'react-icons/bs';
import { FaUserSecret } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';


export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: <BsEye className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            When you visit or make a purchase from our site, we collect certain
            information including your name, billing and shipping address, payment
            details, e-mail address, and phone number. We also automatically
            collect log data such as your IP address, browser type, and pages
            viewed.
          </p>
          <div className="bg-blue-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
            <p className="text-gray-700 dark:text-gray-300 p-2">
              Cookies and similar technologies help us remember your preferences and
              improve site performance. You can disable cookies in your browser, but
              some features may not function properly.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "How We Use Your Data",
      icon: <BiShield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            {[
              "Process and deliver your orders",
              "Provide customer support and respond to inquiries",
              "Personalize your shopping experience and improve our website",
              "Send marketing communications (you may opt out at any time)",
              "Detect and prevent fraud or misuse of our services"
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Sharing Your Data",
      icon: <FaUserSecret className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We share information with trusted third-party service providers solely
            for the purposes listed above—for example, payment processors, courier
            partners, and analytics providers.
          </p>
          <div className="bg-amber-50 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              We never sell your personal data to third parties.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Your Rights",
      icon: <BiLock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            You can request access to, correction of, or deletion of your personal
            information at any time. To exercise these rights, contact us at
            <a
              href="mailto:privacy@yourcompany.com"
              className="inline-flex items-center ml-2 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              <BsMailbox className="w-4 h-4 mr-1" />
              privacy@yourcompany.com
            </a>
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "Updates to This Policy",
      icon: <FiFileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This policy may be updated periodically to reflect changes in our
            practices or legal requirements. We will notify you of material
            changes by posting the revised policy with an updated "Last updated"
            date.
          </p>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-gray-600 dark:text-gray-400 italic font-medium">
              Last updated: 10 July 2025
            </p>
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

      <main className={`relative mx-auto max-w-7xl md:px-4 px-2 md:py-12 py-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Header */}
        <div className="text-center md:mb-16 mb-8">
          <div className="inline-flex items-center justify-center md:w-16 w-8 md:h-16 h-8  bg-gradient-to-r from-red-500 to-pink-500 rounded-full md:mb-6 mb-2 shadow-lg">
            <BiShield className="md:w-8 w-4 md:h-8 h-4  text-white" />
          </div>
          <h1 className="text-xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Learn how Azmain Fashion collects, uses, shares, and protects your data with complete transparency.
          </p>
        </div>

        {/* Sections */}
        <div className="md:space-y-8 space-y-4">
          {sections.map((section, index) => (
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
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center md:w-12 md:h-12 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white shadow-lg p-1">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="md:text-2xl text-sm  font-bold text-gray-800 dark:text-gray-200">
                        {section.id}. {section.title}
                      </h2>
                    </div>
                  </div>
                  <BiChevronRight
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${activeSection === section.id ? 'rotate-90' : ''
                      }`}
                  />
                </div>

                <div className={`overflow-hidden transition-all duration-500 ${activeSection === section.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-700 text-sm md:text-xl">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-0.5 rounded-2xl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Questions about our Privacy Policy?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're here to help you understand how we protect your data.
              </p>
              <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <BsMailbox className="w-5 h-5 mr-2" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}