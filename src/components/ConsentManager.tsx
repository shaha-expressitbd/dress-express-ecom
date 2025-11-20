// components/ConsentManager.tsx
"use client";
import { useEffect, useState } from "react";
import {
  getUserContext,
  hasTrackingConsent,
  setTrackingConsent,
  storeUtmParams,
  trackEvent,
} from "@/utils/gtm";

const ConsentManager = () => {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [consentSettings, setConsentSettings] = useState({
    analytics: true,
    advertising: true,
    functional: true,
  });

  // Check for existing consent on component mount
  useEffect(() => {
    storeUtmParams();
    const storedConsent = hasTrackingConsent();
    setConsentGiven(storedConsent);

    // Only show banner if no consent decision has been made
    if (storedConsent === null) {
      setShowBanner(true);

      // Track the initial consent banner view
      trackEvent("consent_banner_view", {}, false);
    }
  }, []);

  // Handle consent acceptance with optional settings
  const handleAccept = (settings = consentSettings) => {
    const success = setTrackingConsent(true, settings);
    if (success) {
      getUserContext();
      setConsentGiven(true);
      setShowBanner(false);
      setShowSettings(false);
    }
  };

  // Handle consent rejection
  const handleReject = () => {
    const success = setTrackingConsent(false);
    if (success) {
      setConsentGiven(false);
      setShowBanner(false);
      setShowSettings(false);
    }
  };

  return (
    <div>
      {" "}
      {!consentGiven && showBanner && (
        <div className="fixed bottom-0 w-full bg-white  md:p-4 p-1 z-50 border-t border-gray-200 animate-fade-in-up ">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                We value your privacy
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                We use cookies to enhance your browsing experience, serve
                personalized content, and analyze our traffic. By clicking
                "Accept All", you consent to our use of cookies.
              </p>

              {showSettings && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="analytics-consent"
                      checked={consentSettings.analytics}
                      onChange={() =>
                        setConsentSettings((prev) => ({
                          ...prev,
                          analytics: !prev.analytics,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="analytics-consent"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Analytics Cookies
                      <span className="block text-xs text-gray-500">
                        Allow us to analyze website usage to improve performance
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="advertising-consent"
                      checked={consentSettings.advertising}
                      onChange={() =>
                        setConsentSettings((prev) => ({
                          ...prev,
                          advertising: !prev.advertising,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="advertising-consent"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Advertising Cookies
                      <span className="block text-xs text-gray-500">
                        Allow personalized advertising based on your browsing
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="functional-consent"
                      checked={consentSettings.functional}
                      onChange={() =>
                        setConsentSettings((prev) => ({
                          ...prev,
                          functional: !prev.functional,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="functional-consent"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Functional Cookies
                      <span className="block text-xs text-gray-500">
                        Essential for the website to function properly
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Learn more in our Privacy Policy
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showSettings ? "Hide Settings" : "Customize"}
              </button>

              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reject All
              </button>

              <button
                onClick={() => handleAccept()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Accept All
              </button>

              {showSettings && (
                <button
                  onClick={() => handleAccept(consentSettings)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Preferences
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentManager;
