import { useState, useEffect } from 'react';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const viewportSizes = {
  desktop: { width: 1920, height: 1080, icon: '🖥️' },
  tablet: { width: 768, height: 1024, icon: '📱' },
  mobile: { width: 375, height: 667, icon: '📱' },
};

export default function ResponsiveLayout() {
  const [currentViewport, setCurrentViewport] = useState<Viewport>('desktop');
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = () => {
    if (windowSize.width >= 1024) return 'desktop';
    if (windowSize.width >= 768) return 'tablet';
    return 'mobile';
  };

  const breakpoint = getBreakpoint();

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Responsive Layout Testing</h1>

        {/* Viewport Selector */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-white font-semibold mb-3">Select Viewport Size</h2>
          <div className="flex gap-3 flex-wrap">
            {(Object.keys(viewportSizes) as Viewport[]).map((viewport) => (
              <button
                key={viewport}
                onClick={() => setCurrentViewport(viewport)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentViewport === viewport
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                data-testid={`viewport-${viewport}`}
              >
                {viewportSizes[viewport].icon}{' '}
                {viewport.charAt(0).toUpperCase() + viewport.slice(1)}
                <span className="text-xs ml-2">
                  ({viewportSizes[viewport].width}x{viewportSizes[viewport].height})
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-3">
            Current window: {windowSize.width}x{windowSize.height} ({breakpoint})
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Responsive Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-indigo-600 text-white p-6 rounded-lg text-center"
                data-testid={`grid-item-${item}`}
              >
                <p className="font-bold">Item {item}</p>
                <p className="text-sm mt-2">
                  <span className="lg:inline hidden">Desktop: 4 cols</span>
                  <span className="md:inline lg:hidden hidden">Tablet: 2 cols</span>
                  <span className="md:hidden">Mobile: 1 col</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Navigation */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Responsive Elements</h2>

          {/* Desktop Nav - hidden on mobile */}
          <nav className="hidden md:flex gap-4 mb-4" data-testid="desktop-nav">
            <a href="#" className="text-indigo-400 hover:underline">
              Home
            </a>
            <a href="#" className="text-indigo-400 hover:underline">
              Products
            </a>
            <a href="#" className="text-indigo-400 hover:underline">
              About
            </a>
            <a href="#" className="text-indigo-400 hover:underline">
              Contact
            </a>
          </nav>

          {/* Mobile Indicator - visible only on mobile */}
          <div className="md:hidden bg-gray-700 p-3 rounded mb-4" data-testid="mobile-indicator">
            <p className="text-white">📱 Mobile view active</p>
          </div>

          {/* Tablet Indicator - visible only on tablet */}
          <div
            className="hidden md:block lg:hidden bg-gray-700 p-3 rounded mb-4"
            data-testid="tablet-indicator"
          >
            <p className="text-white">📱 Tablet view active</p>
          </div>

          {/* Desktop Indicator - visible only on desktop */}
          <div
            className="hidden lg:block bg-gray-700 p-3 rounded mb-4"
            data-testid="desktop-indicator"
          >
            <p className="text-white">🖥️ Desktop view active</p>
          </div>
        </div>

        {/* Responsive Text */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
            Responsive Typography
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-300">
            This text scales based on viewport size. On mobile it's smaller (14px), on tablet it's
            medium (16px), and on desktop it's larger (18px).
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className={`bg-gray-700 p-3 rounded text-center text-white ${
                  item > 3 ? 'hidden lg:block' : item > 2 ? 'hidden md:block' : ''
                }`}
                data-testid={`responsive-item-${item}`}
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Items 1-2 always visible • Items 3 visible on tablet+ • Items 4-6 visible on desktop
            only
          </p>
        </div>
      </div>
    </div>
  );
}
