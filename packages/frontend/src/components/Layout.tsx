import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Test Automation Hub. Built for QA Engineers.
            </p>
            <div className="flex space-x-6">
              <Link to="/api-docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                API Docs
              </Link>
              <a
                href="https://github.com/tznch/test-automation-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                GitHub
              </a>
              <button
                onClick={() => {
                  if (window.confirm('Found an issue or have a suggestion?\n\nFeel free to report it on GitHub Issues. We appreciate your feedback!')) {
                    window.open('https://github.com/tznch/test-automation-hub/issues', '_blank');
                  }
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
