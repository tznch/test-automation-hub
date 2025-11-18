import { useState } from 'react';

export default function Tooltip() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const tooltips = [
    {
      id: 'click',
      label: 'Click Action',
      tooltip: 'Use page.click() to simulate mouse clicks on elements',
      position: 'top' as const,
    },
    {
      id: 'type',
      label: 'Type Action',
      tooltip: 'Use page.fill() or page.type() to enter text into input fields',
      position: 'right' as const,
    },
    {
      id: 'wait',
      label: 'Wait Action',
      tooltip:
        'Playwright automatically waits, but you can use page.waitForSelector() for specific cases',
      position: 'bottom' as const,
    },
    {
      id: 'assert',
      label: 'Assert Action',
      tooltip: 'Use expect() assertions to verify element states and content',
      position: 'left' as const,
    },
  ];

  const getTooltipPosition = (position: 'top' | 'right' | 'bottom' | 'left') => {
    const positions = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    };
    return positions[position];
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tooltip Examples</h2>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <div className="grid grid-cols-2 gap-8 place-items-center min-h-[300px]">
          {tooltips.map((item) => (
            <div key={item.id} className="relative">
              <button
                onMouseEnter={() => setActiveTooltip(item.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                onFocus={() => setActiveTooltip(item.id)}
                onBlur={() => setActiveTooltip(null)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition"
                data-testid={`tooltip-trigger-${item.id}`}
              >
                {item.label}
              </button>

              {activeTooltip === item.id && (
                <div
                  className={`absolute ${getTooltipPosition(item.position)} z-10 w-64`}
                  data-testid={`tooltip-${item.id}`}
                >
                  <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md shadow-lg">
                    {item.tooltip}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inline Tooltips */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Testing Tips</h3>
        <p className="text-blue-800 dark:text-blue-200">
          Playwright provides powerful{' '}
          <span
            className="relative inline-block cursor-help border-b-2 border-dotted border-blue-600"
            onMouseEnter={() => setActiveTooltip('selectors')}
            onMouseLeave={() => setActiveTooltip(null)}
            data-testid="tooltip-trigger-selectors"
          >
            selector strategies
            {activeTooltip === 'selectors' && (
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-normal"
                data-testid="tooltip-selectors"
              >
                Choose from text, role, test ID, CSS, and XPath selectors
              </span>
            )}
          </span>{' '}
          for locating elements. You can use{' '}
          <span
            className="relative inline-block cursor-help border-b-2 border-dotted border-blue-600"
            onMouseEnter={() => setActiveTooltip('auto-wait')}
            onMouseLeave={() => setActiveTooltip(null)}
            data-testid="tooltip-trigger-auto-wait"
          >
            auto-waiting
            {activeTooltip === 'auto-wait' && (
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-normal"
                data-testid="tooltip-auto-wait"
              >
                Playwright waits for elements to be actionable before performing actions
              </span>
            )}
          </span>{' '}
          to make tests more reliable, and leverage{' '}
          <span
            className="relative inline-block cursor-help border-b-2 border-dotted border-blue-600"
            onMouseEnter={() => setActiveTooltip('assertions')}
            onMouseLeave={() => setActiveTooltip(null)}
            data-testid="tooltip-trigger-assertions"
          >
            web-first assertions
            {activeTooltip === 'assertions' && (
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-normal"
                data-testid="tooltip-assertions"
              >
                Assertions that automatically retry until the expected condition is met
              </span>
            )}
          </span>{' '}
          for robust test validation.
        </p>
      </div>

      {/* Keyboard Instructions */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
        Hover over or focus (Tab key) on elements to see tooltips
      </div>
    </div>
  );
}
