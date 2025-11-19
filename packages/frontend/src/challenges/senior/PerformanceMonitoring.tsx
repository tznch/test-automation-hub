export default function PerformanceMonitoring() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Performance Monitoring</h1>
        import { useState, useEffect, useRef } from 'react';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

export default function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'LCP', value: 1200, rating: 'good', description: 'Largest Contentful Paint' },
    { name: 'FID', value: 100, rating: 'good', description: 'First Input Delay' },
    { name: 'CLS', value: 0.05, rating: 'good', description: 'Cumulative Layout Shift' },
  ]);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [layoutShiftCount, setLayoutShiftCount] = useState(0);
  const heavyTaskRef = useRef<number>(0);

  // Simulate heavy computation (blocking main thread)
  const blockMainThread = (duration: number) => {
    const start = Date.now();
    while (Date.now() - start < duration) {
      // Busy wait
      Math.random();
    }
    
    setMetrics(prev => prev.map(m => 
      m.name === 'FID' 
        ? { ...m, value: duration + Math.random() * 50, rating: duration > 300 ? 'poor' : duration > 100 ? 'needs-improvement' : 'good' }
        : m
    ));
  };

  // Simulate Layout Shift
  const triggerLayoutShift = () => {
    setLayoutShiftCount(prev => prev + 1);
    const shiftAmount = 0.1 + Math.random() * 0.2;
    
    setMetrics(prev => prev.map(m => 
      m.name === 'CLS' 
        ? { ...m, value: Math.min(0.8, m.value + shiftAmount), rating: (m.value + shiftAmount) > 0.25 ? 'poor' : (m.value + shiftAmount) > 0.1 ? 'needs-improvement' : 'good' }
        : m
    ));
  };

  // Simulate Slow Network/LCP
  const simulateSlowLoad = async () => {
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setMetrics(prev => prev.map(m => 
      m.name === 'LCP' 
        ? { ...m, value: 3000 + Math.random() * 1000, rating: 'poor' }
        : m
    ));
    setIsSimulating(false);
  };

  const resetMetrics = () => {
    setMetrics([
      { name: 'LCP', value: 1200, rating: 'good', description: 'Largest Contentful Paint' },
      { name: 'FID', value: 18, rating: 'good', description: 'First Input Delay' },
      { name: 'CLS', value: 0.02, rating: 'good', description: 'Cumulative Layout Shift' },
    ]);
    setLayoutShiftCount(0);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'poor': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Monitoring</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ This dashboard simulates Web Vitals metrics. Use the controls to artificially degrade performance and verify if your monitoring tools detect the changes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <div 
            key={metric.name}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
            data-testid={`metric-card-${metric.name}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getRatingColor(metric.rating)}`}>
                {metric.rating}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {metric.name === 'CLS' ? '' : 'ms'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LCP Control */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Simulate Slow Load (LCP)</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 h-10">
              Delays content rendering to spike Largest Contentful Paint.
            </p>
            <button
              onClick={simulateSlowLoad}
              disabled={isSimulating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
              data-testid="trigger-lcp"
            >
              {isSimulating ? (
                <>
                  <span className="animate-spin">⏳</span> Loading...
                </>
              ) : (
                'Trigger Slow Load'
              )}
            </button>
          </div>

          {/* FID Control */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Block Main Thread (FID)</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 h-10">
              Freezes the UI for 500ms to degrade First Input Delay.
            </p>
            <button
              onClick={() => blockMainThread(500)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition-colors"
              data-testid="trigger-fid"
            >
              Freeze UI (500ms)
            </button>
          </div>

          {/* CLS Control */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Shift Layout (CLS)</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 h-10">
              Injects dynamic content to cause Cumulative Layout Shift.
            </p>
            <button
              onClick={triggerLayoutShift}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
              data-testid="trigger-cls"
            >
              Shift Layout
            </button>
          </div>
        </div>
      </div>

      {/* Shifting Content Area */}
      {layoutShiftCount > 0 && (
        <div className="mb-8 space-y-4 animate-pulse" data-testid="shifting-content">
          {Array.from({ length: layoutShiftCount }).map((_, i) => (
            <div 
              key={i}
              className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded text-yellow-800 dark:text-yellow-200"
            >
              ⚠️ Dynamic content injection #{i + 1} causing layout shift!
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={resetMetrics}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white underline"
          data-testid="reset-metrics"
        >
          Reset All Metrics
        </button>
      </div>

      {/* Testing Hints */}
      <div className="mt-8 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Test CLS: <code className="bg-gray-800 px-1 rounded">await page.getByTestId('trigger-cls').click()</code> then check metric value</li>
          <li>• Test Blocking: Click FID trigger and try to interact with other elements immediately</li>
          <li>• Verify ratings: Check if class names change from 'text-green-600' to 'text-red-600'</li>
        </ul>
      </div>
    </div>
  );
}
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400">Web Vitals dashboard implementation coming soon...</p>
        </div>
      </div>
    </div>
  );
}
