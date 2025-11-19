import { useState, useEffect, useRef } from 'react';

interface RequestLog {
  id: number;
  timestamp: string;
  status: number;
  message: string;
}

export default function ApiRateLimiting() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [requestsLeft, setRequestsLeft] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const [autoRequestActive, setAutoRequestActive] = useState(false);
  
  const autoRequestRef = useRef<NodeJS.Timeout | null>(null);

  // Reset rate limit every 10 seconds
  useEffect(() => {
    if (resetTime === null) {
      setResetTime(Date.now() + 10000);
    }

    const interval = setInterval(() => {
      if (resetTime && Date.now() >= resetTime) {
        setRequestsLeft(5);
        setIsBlocked(false);
        setResetTime(Date.now() + 10000);
        addLog(200, 'Rate limit window reset');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [resetTime]);

  // Handle auto-requests
  useEffect(() => {
    if (autoRequestActive) {
      autoRequestRef.current = setInterval(() => {
        makeRequest();
      }, 500);
    } else {
      if (autoRequestRef.current) {
        clearInterval(autoRequestRef.current);
      }
    }
    return () => {
      if (autoRequestRef.current) clearInterval(autoRequestRef.current);
    };
  }, [autoRequestActive, requestsLeft, isBlocked]);

  const addLog = (status: number, message: string) => {
    setLogs(prev => [{
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      status,
      message
    }, ...prev].slice(0, 10));
  };

  const makeRequest = () => {
    if (isBlocked) {
      addLog(429, 'Too Many Requests - Blocked');
      return;
    }

    if (requestsLeft > 0) {
      setRequestsLeft(prev => prev - 1);
      addLog(200, 'Request successful');
    } else {
      setIsBlocked(true);
      addLog(429, 'Rate limit exceeded! Try again later.');
    }
  };

  const getStatusColor = (status: number) => {
    if (status === 200) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (status === 429) return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">API Rate Limiting</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ This component simulates an API with a strict rate limit (5 requests / 10 seconds). 
          Test your ability to handle 429 errors and implement exponential backoff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Control Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Client</h3>
            
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Requests Remaining</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="requests-left">
                  {requestsLeft} / 5
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Reset In</div>
                <div className="text-xl font-mono text-indigo-600 dark:text-indigo-400">
                  {resetTime ? Math.max(0, Math.ceil((resetTime - Date.now()) / 1000)) : 10}s
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => makeRequest()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                data-testid="make-request-btn"
              >
                <span>🚀</span> Make Single Request
              </button>

              <button
                onClick={() => setAutoRequestActive(!autoRequestActive)}
                className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border-2 ${
                  autoRequestActive 
                    ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20' 
                    : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                }`}
                data-testid="spam-requests-btn"
              >
                <span>{autoRequestActive ? '⏹️' : '⚡'}</span>
                {autoRequestActive ? 'Stop Spamming' : 'Start Spamming (2 req/s)'}
              </button>
            </div>
          </div>

          {/* Testing Hints */}
          <div className="bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Handle 429s: Check for "Too Many Requests" text or status code</li>
              <li>• Wait for reset: <code className="bg-gray-800 px-1 rounded">await page.waitForTimeout(10000)</code></li>
              <li>• Verify recovery: Ensure requests succeed again after the reset window</li>
            </ul>
          </div>
        </div>

        {/* Request Log */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Log</h3>
            <button 
              onClick={() => setLogs([])}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2" data-testid="request-log">
            {logs.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No requests logged yet</div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{log.message}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
