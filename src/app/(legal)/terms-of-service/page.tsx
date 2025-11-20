import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Azmain Fashion",
  description: "Please read these terms carefully before using our website.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-2 md:px-8 md:py-16 py-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-5xl font-bold text-white md:mb-4 mb-2 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm md:text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our website and services
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 md:px-8 py-12">
        {/* Last Updated Info */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-1 mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-700 font-medium">
              Last updated: January 2025 | Effective immediately
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                Acceptance of Terms
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                By accessing or using Azmain Fashion website you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree with any part of these terms, you must discontinue use of our website immediately.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                Use of the Site
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not exploit the site for any unlawful purpose, transmit malicious code, or attempt to gain unauthorized access to data.
              </p>
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">Prohibited Activities Include:</h3>
                <ul className="text-red-700 space-y-1 text-sm">
                  <li>• Unauthorized access to user accounts or systems</li>
                  <li>• Distribution of malware or harmful code</li>
                  <li>• Violation of intellectual property rights</li>
                  <li>• Harassment or abuse of other users</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                Orders & Payments
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                All prices are listed in Bangladeshi Taka (BDT) unless otherwise stated. We reserve the right to refuse or cancel any order at our discretion.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">💳 Payment Methods</h3>
                  <p className="text-red-700 text-sm">We accept various payment methods including mobile banking, cards, and cash on delivery.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">📋 Order Processing</h3>
                  <p className="text-red-700 text-sm">Orders are processed within 24 hours of confirmation and payment verification.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                Shipping & Delivery
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Our standard delivery times are <span className="font-bold text-red-600">Inside Dhaka — up to 5 business days</span> and <span className="font-bold text-red-600">Outside Dhaka — up to 10 business days</span>. Full shipping details are outlined in our{" "}
                <a href="/shipping-info" className="text-red-600 hover:text-red-800 underline decoration-red-300 hover:decoration-red-600 transition-colors duration-300">
                  Shipping Info
                </a>.
              </p>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-red-800">Important Note</h3>
                </div>
                <p className="text-red-700 text-sm">Delivery times may vary during peak seasons, holidays, or due to unforeseen circumstances.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
                Return & Refunds
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Refund requests are processed within <span className="font-bold text-red-600">7–10 working days</span> of approval. See our{" "}
                <a href="/refund-policy" className="text-red-600 hover:text-red-800 underline decoration-red-300 hover:decoration-red-600 transition-colors duration-300">
                  Refund Policy
                </a>{" "}
                for full details.
              </p>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">🔄 Refund Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-1 text-xs">1</div>
                    <p className="text-red-700">Submit Request</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-1 text-xs">2</div>
                    <p className="text-red-700">Review & Approval</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-1 text-xs">3</div>
                    <p className="text-red-700">Process Payment</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</span>
                Intellectual Property
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on this site is the property of Azmain Fashion or its licensors and is protected under Bangladeshi copyright laws.
              </p>
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">Protected Content Includes:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-red-700">
                  <div>• Website design & layout</div>
                  <div>• Product images & descriptions</div>
                  <div>• Brand names & logos</div>
                  <div>• Written content & articles</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</span>
                Governing Law
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka.
              </p>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
                  </svg>
                  <h3 className="font-semibold text-red-800">Legal Jurisdiction</h3>
                </div>
                <p className="text-red-700 text-sm">All legal matters will be handled according to Bangladeshi law and regulations.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Questions About These Terms?
          </h2>
          <p className="text-red-100 mb-6">
            If you have any questions about these Terms & Conditions, please don't hesitate to contact us.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@dressexpress.com"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-6 py-3 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@dressexpress.com
            </a>
            <a
              href="tel:+8801721665758"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-6 py-3 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +8801721665758

            </a>
          </div>
        </div>
      </main>
    </div>
  );
}