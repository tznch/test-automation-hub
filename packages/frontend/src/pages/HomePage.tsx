import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Master Test Automation</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          A comprehensive open-source training platform with 63 hands-on challenges. Practice with
          real applications and master testing frameworks - completely free!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/challenges"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            Start Learning
          </Link>
          <a
            href="https://github.com/tznch/test-automation-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-white border-2 border-gray-500 dark:border-gray-600 px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">63 Challenges</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Progress from beginner to senior with realistic testing scenarios
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Real Applications</h3>
          <p className="text-gray-700 dark:text-gray-300">Test against actual frontend and backend implementations</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">API Documentation</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">Complete API reference with schemas and examples</p>
          <Link
            to="/api-docs"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium text-sm"
          >
            View API Docs →
          </Link>
        </div>
      </div>

      {/* Difficulty Levels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Learning Path</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-2 border-green-600 rounded-lg p-6 bg-green-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Beginner</h3>
              <span className="bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                20 challenges
              </span>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Basic selectors & locators</li>
              <li>• Form interactions</li>
              <li>• Navigation & assertions</li>
              <li>• Simple UI components</li>
            </ul>
          </div>
          <div className="border-2 border-yellow-600 rounded-lg p-6 bg-yellow-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400">Intermediate</h3>
              <span className="bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">
                23 challenges
              </span>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• API mocking & interception</li>
              <li>• WebSocket & real-time data</li>
              <li>• File uploads & downloads</li>
              <li>• Drag-and-drop interactions</li>
            </ul>
          </div>
          <div className="border-2 border-red-600 rounded-lg p-6 bg-red-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">Senior</h3>
              <span className="bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm">
                20 challenges
              </span>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Complex workflows</li>
              <li>• Multi-user scenarios</li>
              <li>• Performance testing</li>
              <li>• Advanced patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
