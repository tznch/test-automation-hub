import { useState, useEffect } from 'react';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleReset = () => {
    localStorage.removeItem('cookie-consent');
    setShowBanner(true);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const currentConsent = localStorage.getItem('cookie-consent');

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Cookie Consent Banner</h1>
        <p className="text-gray-300 mb-8">
          Test GDPR-compliant cookie consent with accept, reject, and customize options.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Status</h2>
          {currentConsent ? (
            <div className="space-y-2">
              <p className="text-green-400">✓ Cookie preferences saved</p>
              <pre className="bg-gray-700 p-3 rounded text-sm text-gray-300 overflow-auto">
                {JSON.stringify(JSON.parse(currentConsent), null, 2)}
              </pre>
              <button
                onClick={handleReset}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Reset Consent
              </button>
            </div>
          ) : (
            <p className="text-gray-400">No cookie consent given yet</p>
          )}
        </div>

        {/* Cookie Banner */}
        {showBanner && (
          <div
            role="dialog"
            aria-labelledby="cookie-banner-title"
            className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-indigo-600 p-6 shadow-lg z-50"
          >
            {!showCustomize ? (
              <div className="max-w-6xl mx-auto">
                <h2 id="cookie-banner-title" className="text-xl font-bold text-white mb-2">
                  🍪 We use cookies
                </h2>
                <p className="text-gray-300 mb-4">
                  We use cookies to enhance your browsing experience, serve personalized content,
                  and analyze our traffic. By clicking "Accept All", you consent to our use of
                  cookies.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowCustomize(true)}
                    className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Customize
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-4">Customize Cookie Preferences</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Necessary Cookies</h3>
                      <p className="text-sm text-gray-400">Required for basic site functionality</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Analytics Cookies</h3>
                      <p className="text-sm text-gray-400">Help us improve our website</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Marketing Cookies</h3>
                      <p className="text-sm text-gray-400">Used for personalized advertising</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="h-5 w-5"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePreferences}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
