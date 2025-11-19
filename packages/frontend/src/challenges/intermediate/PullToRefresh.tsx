import { useState, useRef, useEffect } from 'react';

interface ContentItem {
  id: number;
  title: string;
  timestamp: string;
}

export default function PullToRefresh() {
  const [items, setItems] = useState<ContentItem[]>([
    { id: 1, title: 'Initial Content 1', timestamp: new Date().toLocaleTimeString() },
    { id: 2, title: 'Initial Content 2', timestamp: new Date().toLocaleTimeString() },
    { id: 3, title: 'Initial Content 3', timestamp: new Date().toLocaleTimeString() },
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);
  
  const THRESHOLD = 75;
  const MAX_PULL = 150;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      // Add resistance
      const newPull = Math.min(diff * 0.5, MAX_PULL);
      setPullDistance(newPull);
      
      // Prevent default scrolling if pulling down
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (pullDistance > THRESHOLD) {
      refresh();
    } else {
      setPullDistance(0);
    }
  };

  const refresh = () => {
    setIsRefreshing(true);
    setPullDistance(THRESHOLD); // Snap to threshold
    
    // Simulate API call
    setTimeout(() => {
      const newItems = [
        { 
          id: Date.now(), 
          title: `New Content ${Math.floor(Math.random() * 100)}`, 
          timestamp: new Date().toLocaleTimeString() 
        },
        ...items
      ].slice(0, 10);
      
      setItems(newItems);
      setLastRefresh(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      setPullDistance(0);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pull to Refresh</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ On mobile devices (or using DevTools device mode), pull down from the top of the list to refresh content.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: <span data-testid="last-refresh">{lastRefresh || 'Never'}</span>
        </span>
        <button 
          onClick={refresh}
          disabled={isRefreshing}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline md:hidden"
        >
          Manual Refresh
        </button>
      </div>

      {/* Mobile Container Simulator */}
      <div className="mx-auto max-w-sm bg-gray-900 rounded-[3rem] p-4 border-4 border-gray-800 shadow-2xl overflow-hidden relative h-[600px]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
        
        {/* Screen */}
        <div 
          className="bg-white dark:bg-gray-800 w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-testid="refresh-container"
        >
          {/* Pull Indicator */}
          <div 
            className="w-full flex items-center justify-center transition-all duration-200 absolute top-0 left-0 right-0 z-10"
            style={{ 
              height: `${pullDistance}px`,
              opacity: pullDistance > 0 ? 1 : 0
            }}
            data-testid="pull-indicator"
          >
            {isRefreshing ? (
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" data-testid="refresh-spinner"></div>
            ) : (
              <span className={`text-gray-500 transform transition-transform ${pullDistance > THRESHOLD ? 'rotate-180' : ''}`}>
                ⬇️ {pullDistance > THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            )}
          </div>

          {/* Content List */}
          <div 
            className="flex-1 overflow-y-auto pt-4 px-4 transition-transform duration-200"
            style={{ transform: `translateY(${pullDistance}px)` }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-2">Latest Updates</h3>
            <div className="space-y-3 pb-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600"
                  data-testid={`content-item-${item.id}`}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testing Hints */}
      <div className="mt-6 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use CDP to simulate touch: <code className="bg-gray-800 px-1 rounded">await page.touchscreen.tap(x, y)</code> isn't enough for drag</li>
          <li>• Simulate drag gesture: <code className="bg-gray-800 px-1 rounded">await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x, y+200); await page.mouse.up()</code></li>
          <li>• Verify spinner appears: <code className="bg-gray-800 px-1 rounded">await expect(page.getByTestId('refresh-spinner')).toBeVisible()</code></li>
          <li>• Check content updates after refresh completes</li>
        </ul>
      </div>
    </div>
  );
}
