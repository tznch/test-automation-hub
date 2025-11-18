import { useState } from 'react';

type Tab = 'overview' | 'features' | 'pricing' | 'faq';

export default function TabsComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);

    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      setActiveTab(tabs[prevIndex].id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Information</h2>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-8" role="tablist" data-testid="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleKeyDown}
              className={`py-3 px-1 border-b-2 font-medium transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div data-testid="panel-overview" role="tabpanel">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Overview</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our platform provides comprehensive Playwright testing training through interactive
              mini-app challenges. Learn by doing with real-world scenarios.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Each challenge simulates common web application patterns and testing scenarios you'll
              encounter in production environments.
            </p>
          </div>
        )}

        {activeTab === 'features' && (
          <div data-testid="panel-features" role="tabpanel">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <strong className="text-gray-900 dark:text-white">30+ Interactive Challenges</strong>
                  <p className="text-gray-600 dark:text-gray-400">
                    Beginner, intermediate, and senior-level scenarios
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <strong className="text-gray-900 dark:text-white">Real-Time Testing</strong>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test your Playwright scripts against live mini-apps
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <strong className="text-gray-900 dark:text-white">Progress Tracking</strong>
                  <p className="text-gray-600 dark:text-gray-400">Monitor your learning journey and achievements</p>
                </div>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div data-testid="panel-pricing" role="tabpanel">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pricing Plans</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free</h4>
                <div className="text-3xl font-bold text-indigo-600 mb-4">$0</div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ 10 Beginner Challenges</li>
                  <li>✓ Basic Progress Tracking</li>
                  <li>✓ Community Support</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 border-2 border-indigo-600 rounded-lg p-6 relative">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro</h4>
                <div className="text-3xl font-bold text-indigo-600 mb-4">$29/mo</div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ All 63 Challenges</li>
                  <li>✓ Advanced Analytics</li>
                  <li>✓ Priority Support</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Team</h4>
                <div className="text-3xl font-bold text-indigo-600 mb-4">$99/mo</div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ Everything in Pro</li>
                  <li>✓ Team Dashboard</li>
                  <li>✓ Custom Challenges</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div data-testid="panel-faq" role="tabpanel">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What is Playwright?</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Playwright is a modern end-to-end testing framework for web applications that
                  supports multiple browsers and provides powerful automation capabilities.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do I need prior testing experience?
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  No! Our beginner challenges are designed for newcomers. You'll progress from basic
                  concepts to advanced patterns.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I use this for team training?
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Yes! Our Team plan includes features specifically designed for training multiple
                  team members and tracking their progress.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
