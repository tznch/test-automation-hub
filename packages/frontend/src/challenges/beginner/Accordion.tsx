import { useState } from 'react';

interface AccordionItem {
  id: number;
  title: string;
  content: string;
}

export default function Accordion() {
  const [openItems, setOpenItems] = useState<number[]>([1]);

  const items: AccordionItem[] = [
    {
      id: 1,
      title: 'Getting Started with Playwright',
      content:
        'Playwright is a powerful end-to-end testing framework that allows you to test web applications across multiple browsers. Start by installing Playwright using npm or yarn, then create your first test file to begin automating browser interactions.',
    },
    {
      id: 2,
      title: 'Writing Your First Test',
      content:
        'A basic Playwright test includes importing the test framework, defining a test case, navigating to a page, interacting with elements, and making assertions. Use page.goto() to navigate, page.click() for interactions, and expect() for assertions.',
    },
    {
      id: 3,
      title: 'Locators and Selectors',
      content:
        'Playwright offers various locator strategies including text, role, test IDs, and CSS selectors. Role-based locators are recommended as they align with accessibility best practices and are more resilient to UI changes.',
    },
    {
      id: 4,
      title: 'Handling Async Operations',
      content:
        'Modern web applications involve many asynchronous operations. Playwright automatically waits for elements to be ready, but you can also use explicit waits with waitForSelector(), waitForLoadState(), and other wait methods for specific scenarios.',
    },
    {
      id: 5,
      title: 'Running Tests in CI/CD',
      content:
        'Integrate Playwright tests into your CI/CD pipeline using GitHub Actions, GitLab CI, or other platforms. Configure parallel execution, capture screenshots on failures, and generate HTML reports to track test results over time.',
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenItems(items.map((item) => item.id));
  };

  const collapseAll = () => {
    setOpenItems([]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Playwright Guide</h2>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
            data-testid="expand-all"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
            data-testid="collapse-all"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openItems.includes(item.id);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              data-testid={`accordion-item-${item.id}`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                data-testid={`accordion-button-${item.id}`}
              >
                <span className="font-semibold text-gray-900 dark:text-white text-left">{item.title}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isOpen && (
                <div
                  className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                  data-testid={`accordion-content-${item.id}`}
                >
                  <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {openItems.length} of {items.length} sections expanded
      </div>
    </div>
  );
}
