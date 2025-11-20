import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information | dressexpress",
  description:
    "Learn about our delivery areas, timelines, charges, and logistics partners.",
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-16 py-4">
          <div className="text-center">
            <h1 className="text-xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Shipping Information
            </h1>
            <p className="text-sm md:text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Fast, reliable delivery across Bangladesh with transparent pricing and real-time tracking
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto md:px-4 px-2 md:py-16 py-8">
        <div className="grid gap-8">
          {/* Delivery Timelines */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                Delivery Timelines
              </h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 hover:bg-red-100 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Inside Dhaka City</h3>
                  <p className="text-red-700">
                    Standard delivery within <span className="font-bold text-red-800">up to 3 business days</span>
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 hover:bg-red-100 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Outside Dhaka City</h3>
                  <p className="text-red-700">
                    Standard delivery within <span className="font-bold text-red-800">up to 7 business days</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-red-600 text-white rounded-lg">
                <p className="text-sm font-medium">
                  📅 Business days exclude Fridays and public holidays in Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                Shipping Charges
              </h2>
            </div>
            <div className="p-8">
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-600 rounded-full p-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800">Smart Pricing</h3>
                </div>
                <p className="text-red-700 mb-4">
                  Shipping fees are calculated at checkout based on weight and destination.
                </p>
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block">
                  <span className="font-semibold">🎉 Free shipping inside Dhaka for orders above ৳X</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Partners */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                Logistics Partners
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-6">
                We partner with reputable couriers to ensure reliable delivery across Bangladesh.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center border-2 border-red-100 hover:border-red-300 transition-colors duration-300">
                  <div className="bg-red-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-red-800">Pathao</h4>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center border-2 border-red-100 hover:border-red-300 transition-colors duration-300">
                  <div className="bg-red-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-red-800">SteadFast</h4>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center border-2 border-red-100 hover:border-red-300 transition-colors duration-300">
                  <div className="bg-red-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-red-800">Sundarban Courier</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                Order Tracking
              </h2>
            </div>
            <div className="p-8">
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-600 rounded-full p-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800">Real-Time Updates</h3>
                </div>
                <p className="text-red-700 mb-4">
                  After dispatch, you will receive an email/SMS with your tracking number.
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                  <p className="text-sm text-red-700">
                    💡 You can also view tracking information in your account dashboard for easy access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
                Questions?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Email Support</h3>
                  </div>
                  <a
                    href="mailto:shipping@yourcompany.com"
                    className="text-red-100 hover:text-white transition-colors duration-300 underline decoration-red-300 hover:decoration-white"
                  >
                    shipping@dressexpress.com
                  </a>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Phone Support</h3>
                  </div>
                  <a
                    href="tel:01721665758"
                    className="text-red-100 hover:text-white transition-colors duration-300 underline decoration-red-300 hover:decoration-white"
                  >
                    01721665758

                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}