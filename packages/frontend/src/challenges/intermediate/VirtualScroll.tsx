import { useState, useRef } from 'react';

interface Item {
  id: number;
  text: string;
}

export default function VirtualScroll() {
  const [items] = useState<Item[]>(() =>
    Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `Item ${i + 1}` }))
  );
  
  const ITEM_HEIGHT = 50;
  const CONTAINER_HEIGHT = 400;
  const BUFFER_SIZE = 5;
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const visibleStart = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
  const visibleEnd = Math.min(
    items.length,
    Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER_SIZE
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * ITEM_HEIGHT;
  const offsetY = visibleStart * ITEM_HEIGHT;
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Virtual Scrolling List</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ This list contains 1,000 items but only renders ~{visibleItems.length} visible items at a time using virtual scrolling.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="total-items">{items.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Rendered Items</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="rendered-items">{visibleItems.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Scroll Position</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400" data-testid="scroll-position">{Math.round(scrollTop)}px</p>
        </div>
      </div>

      {/* Virtual Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
        data-testid="scroll-container"
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                style={{ height: `${ITEM_HEIGHT}px` }}
                data-testid={`item-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">#{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testing Hints */}
      <div className="mt-6 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Count rendered DOM elements with <code className="bg-gray-800 px-1 rounded">.count()</code> - should be much less than 1000</li>
          <li>• Use <code className="bg-gray-800 px-1 rounded">page.evaluate()</code> to scroll to specific positions</li>
          <li>• Verify items update as you scroll (check data-testid attributes)</li>
          <li>• Test scroll to specific item by index</li>
          <li>• Verify only visible + buffer items are in the DOM</li>
        </ul>
      </div>
    </div>
  );
}
