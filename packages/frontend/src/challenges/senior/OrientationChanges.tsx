import { useState } from 'react';

type Orientation = 'portrait-primary' | 'landscape-primary';

export default function OrientationChanges() {
  const [orientation, setOrientation] = useState<Orientation>('portrait-primary');
  const [windowSize, setWindowSize] = useState({ width: 375, height: 812 });

  // Simulate orientation change
  const toggleOrientation = () => {
    const newOrientation = orientation === 'portrait-primary' ? 'landscape-primary' : 'portrait-primary';
    setOrientation(newOrientation);
    setWindowSize({
      width: windowSize.height,
      height: windowSize.width
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Device Orientation</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ This component simulates device orientation changes. The layout adapts based on whether the device is in portrait or landscape mode.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Controls</h3>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600 dark:text-gray-300">Current Orientation:</span>
              <span 
                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium"
                data-testid="current-orientation"
              >
                {orientation}
              </span>
            </div>

            <button
              onClick={toggleOrientation}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              data-testid="rotate-device"
            >
              <span className="text-xl">🔄</span>
              Rotate Device
            </button>
          </div>

          {/* Testing Hints */}
          <div className="bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Verify layout adaptation: Check if elements stack in portrait and align side-by-side in landscape</li>
              <li>• Test viewport resize: <code className="bg-gray-800 px-1 rounded">await page.setViewportSize(&#123; width: 800, height: 600 &#125;)</code></li>
              <li>• Check hidden elements: Some UI elements might only be visible in specific orientations</li>
            </ul>
          </div>
        </div>

        {/* Device Simulator */}
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <div 
            className={`bg-white dark:bg-gray-800 border-8 border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 ease-in-out relative`}
            style={{
              width: orientation === 'portrait-primary' ? '300px' : '500px',
              height: orientation === 'portrait-primary' ? '500px' : '300px',
            }}
            data-testid="device-frame"
          >
            {/* Notch/Camera */}
            <div className={`absolute bg-gray-800 rounded-b-xl z-10 ${
              orientation === 'portrait-primary' 
                ? 'top-0 left-1/2 -translate-x-1/2 w-32 h-6' 
                : 'left-0 top-1/2 -translate-y-1/2 h-32 w-6 rounded-r-xl rounded-b-none'
            }`}></div>

            {/* Screen Content */}
            <div className="h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pt-6">
                <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              {/* Adaptive Content */}
              <div className={`flex gap-4 ${orientation === 'portrait-primary' ? 'flex-col' : 'flex-row'}`}>
                {/* Hero Card */}
                <div className={`bg-indigo-600 rounded-xl p-4 text-white ${orientation === 'portrait-primary' ? 'w-full h-32' : 'w-1/2 h-full'}`}>
                  <div className="h-4 w-2/3 bg-white/30 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-white/30 rounded"></div>
                </div>

                {/* Grid Items */}
                <div className={`grid gap-3 ${orientation === 'portrait-primary' ? 'grid-cols-2' : 'grid-cols-1 w-1/2'}`}>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm h-24"></div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm h-24"></div>
                  <div className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm h-24 ${orientation === 'landscape-primary' ? 'hidden' : ''}`}></div>
                  <div className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm h-24 ${orientation === 'landscape-primary' ? 'hidden' : ''}`}></div>
                </div>
              </div>

              {/* Landscape-only content */}
              {orientation === 'landscape-primary' && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm" data-testid="landscape-message">
                  ✨ Optimized landscape view active
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full ${
              orientation === 'landscape-primary' ? 'hidden' : ''
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
