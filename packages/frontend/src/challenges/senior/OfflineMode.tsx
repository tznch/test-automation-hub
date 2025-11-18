import { useState, useEffect } from 'react';

interface PendingAction {
  id: string;
  action: string;
  data: any;
  timestamp: number;
}

export default function OfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setSwRegistration(registration);
          updateCacheSize();
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Load pending actions from localStorage
    const stored = localStorage.getItem('pendingActions');
    if (stored) {
      setPendingActions(JSON.parse(stored));
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const updateCacheSize = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.cacheSize !== undefined) {
          setCacheSize(event.data.cacheSize);
        }
      };
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );
    }
  };

  const addPendingAction = (action: string, data: any) => {
    const newAction: PendingAction = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: Date.now(),
    };
    const updated = [...pendingActions, newAction];
    setPendingActions(updated);
    localStorage.setItem('pendingActions', JSON.stringify(updated));
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    console.log('Syncing pending actions:', pendingActions);

    // Simulate syncing (in real app, would send to server)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Clear pending actions after sync
    setPendingActions([]);
    localStorage.removeItem('pendingActions');
  };

  const handleManualSync = async () => {
    if (isOnline) {
      await syncPendingActions();
      alert('Sync completed successfully!');
    } else {
      alert('Cannot sync while offline. Please connect to the internet.');
    }
  };

  const handleClearCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          setCacheSize(0);
          alert('Cache cleared successfully!');
        }
      };
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    }
  };

  const handleInstallPWA = async () => {
    if (!installPrompt) {
      alert('PWA install prompt not available');
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  const handleTestAction = () => {
    const action = {
      type: 'POST',
      endpoint: '/api/test',
      payload: { message: 'Test action', timestamp: new Date().toISOString() },
    };
    addPendingAction('Create Test Data', action);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Offline Mode / PWA</h1>
          <p className="text-gray-400">Progressive Web App with offline capabilities</p>
        </div>

        {/* Online/Offline Indicator */}
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            isOnline
              ? 'bg-green-900/20 border-green-600'
              : 'bg-red-900/20 border-red-600'
          }`}
          data-testid="connection-status"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}
            />
            <div>
              <p className={`font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? '✓ Online' : '✗ Offline'}
              </p>
              <p className="text-sm text-gray-400">
                {isOnline
                  ? 'Connected to the internet'
                  : 'No internet connection - Using cached content'}
              </p>
            </div>
          </div>
        </div>

        {/* Service Worker Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Service Worker Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Registration:</span>
              <span
                className={`font-semibold ${swRegistration ? 'text-green-400' : 'text-red-400'}`}
                data-testid="sw-status"
              >
                {swRegistration ? 'Registered ✓' : 'Not Registered ✗'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cache Size:</span>
              <span className="font-semibold text-white" data-testid="cache-size">
                {cacheSize} items
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Support:</span>
              <span className="font-semibold text-white">
                {'serviceWorker' in navigator ? 'Supported ✓' : 'Not Supported ✗'}
              </span>
            </div>
          </div>
        </div>

        {/* PWA Installation */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">PWA Installation</h2>
          <p className="text-gray-400 mb-4">
            Install this application for offline access and a native app experience.
          </p>
          {isInstallable ? (
            <button
              data-testid="install-pwa-button"
              onClick={handleInstallPWA}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
            >
              Install PWA
            </button>
          ) : (
            <p className="text-sm text-gray-500" data-testid="install-status">
              {swRegistration
                ? 'App already installed or install prompt not available'
                : 'Service worker must be registered first'}
            </p>
          )}
        </div>

        {/* Pending Sync Queue */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Pending Sync Queue</h2>
            <button
              data-testid="manual-sync-button"
              onClick={handleManualSync}
              disabled={pendingActions.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition"
            >
              Sync Now
            </button>
          </div>

          {pendingActions.length > 0 ? (
            <div className="space-y-2" data-testid="pending-actions-list">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-gray-700 rounded p-3"
                  data-testid={`pending-action-${action.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{action.action}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-600 text-xs rounded">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4" data-testid="no-pending-actions">
              No pending actions
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Test Actions</h2>
          <p className="text-gray-400 mb-4">
            Test offline functionality by performing actions while offline. They'll be queued and
            synced when back online.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              data-testid="test-action-button"
              onClick={handleTestAction}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
            >
              Add Test Action
            </button>
            <button
              data-testid="clear-cache-button"
              onClick={handleClearCache}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
            >
              Clear Cache
            </button>
            <button
              data-testid="refresh-cache-size-button"
              onClick={updateCacheSize}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition"
            >
              Refresh Cache Size
            </button>
          </div>
        </div>

        {/* Cached Pages */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Cached Resources</h2>
          <p className="text-gray-400 mb-3">
            These pages are cached and available offline:
          </p>
          <ul className="space-y-2" data-testid="cached-pages">
            <li className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Home Page</span>
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Challenge List</span>
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>This Page (Offline Mode)</span>
            </li>
          </ul>
        </div>

        {/* Testing Hints */}
        <div className="p-4 bg-indigo-900/20 border border-indigo-600 rounded">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Verify service worker registration in sw-status</li>
            <li>• Use browser DevTools to simulate offline mode (Network tab)</li>
            <li>• Add test actions and verify they appear in pending queue</li>
            <li>• Go offline, refresh page, and verify cached content loads</li>
            <li>• Go back online and test manual sync with manual-sync-button</li>
            <li>• Test PWA installation with install-pwa-button (if available)</li>
            <li>• Monitor connection-status indicator changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

