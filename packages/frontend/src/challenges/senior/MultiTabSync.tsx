import { useState, useEffect } from 'react';

interface TabState {
  id: string;
  name: string;
  lastUpdated: number;
}

export default function MultiTabSync() {
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [activeTabs, setActiveTabs] = useState<TabState[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register this tab
    const registerTab = () => {
      const tabs = JSON.parse(localStorage.getItem('active_tabs') || '[]');
      const newTab: TabState = {
        id: sessionId,
        name: `Tab ${tabs.length + 1}`,
        lastUpdated: Date.now(),
      };
      localStorage.setItem('active_tabs', JSON.stringify([...tabs, newTab]));
      updateActiveTabs();
    };

    // Update tab heartbeat
    const heartbeat = setInterval(() => {
      const tabs = JSON.parse(localStorage.getItem('active_tabs') || '[]');
      const updated = tabs.map((tab: TabState) =>
        tab.id === sessionId ? { ...tab, lastUpdated: Date.now() } : tab
      );
      localStorage.setItem('active_tabs', JSON.stringify(updated));

      // Remove stale tabs (older than 5 seconds)
      const now = Date.now();
      const active = updated.filter((tab: TabState) => now - tab.lastUpdated < 5000);
      localStorage.setItem('active_tabs', JSON.stringify(active));
      updateActiveTabs();
    }, 2000);

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shared_message' && e.newValue) {
        const data = JSON.parse(e.newValue);
        if (data.sender !== sessionId) {
          setReceivedMessages((prev) => [...prev, `${data.sender}: ${data.message}`]);
        }
      } else if (e.key === 'active_tabs') {
        updateActiveTabs();
      }
    };

    // Listen for online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    registerTab();

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      // Unregister tab
      const tabs = JSON.parse(localStorage.getItem('active_tabs') || '[]');
      const filtered = tabs.filter((tab: TabState) => tab.id !== sessionId);
      localStorage.setItem('active_tabs', JSON.stringify(filtered));
    };
  }, [sessionId]);

  const updateActiveTabs = () => {
    const tabs = JSON.parse(localStorage.getItem('active_tabs') || '[]');
    setActiveTabs(tabs);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      sender: sessionId,
      message: message.trim(),
      timestamp: Date.now(),
    };

    localStorage.setItem('shared_message', JSON.stringify(data));
    setReceivedMessages((prev) => [...prev, `You: ${message}`]);
    setMessage('');

    // Trigger storage event manually for same tab
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'shared_message',
        newValue: JSON.stringify(data),
      })
    );
  };

  const broadcastAction = (action: string) => {
    const data = {
      sender: sessionId,
      action,
      timestamp: Date.now(),
    };

    localStorage.setItem('broadcast_action', JSON.stringify(data));
    setReceivedMessages((prev) => [
      ...prev,
      `System: Broadcast "${action}" sent to ${activeTabs.length} tabs`,
    ]);
  };

  const syncData = () => {
    const syncData = {
      userId: 123,
      theme: 'dark',
      preferences: { notifications: true },
      timestamp: Date.now(),
    };

    localStorage.setItem('sync_data', JSON.stringify(syncData));
    setReceivedMessages((prev) => [...prev, 'System: Data synced across all tabs']);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Multi-Tab Synchronization</h2>

      {/* Status Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            data-testid="online-status"
          ></div>
          <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Session ID:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-testid="session-id">
            {sessionId.slice(0, 20)}...
          </code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active Tabs:</span>
          <span className="text-sm font-semibold text-indigo-600" data-testid="tab-count">
            {activeTabs.length}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Message Sync */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cross-Tab Messaging</h3>
          <div
            className="mb-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-3 space-y-2"
            data-testid="messages-list"
          >
            {receivedMessages.map((msg, i) => (
              <div key={i} className="text-sm text-gray-700 dark:text-gray-300" data-testid={`message-${i}`}>
                {msg}
              </div>
            ))}
            {receivedMessages.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                No messages yet. Open another tab to test sync!
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              data-testid="message-input"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              data-testid="send-message"
            >
              Send
            </button>
          </div>
        </div>

        {/* Active Tabs */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Tabs</h3>
          <div className="space-y-2 mb-4" data-testid="tabs-list">
            {activeTabs.map((tab) => (
              <div
                key={tab.id}
                className={`p-3 border rounded-lg flex items-center justify-between ${
                  tab.id === sessionId
                    ? 'bg-indigo-50 border-indigo-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tab.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tab.id === sessionId ? 'This tab' : `ID: ${tab.id.slice(0, 15)}...`}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-4">
            💡 Open this page in multiple tabs to see real-time synchronization
          </p>
        </div>
      </div>

      {/* Broadcast Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Broadcast Actions</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <button
            onClick={() => broadcastAction('refresh')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            data-testid="broadcast-refresh"
          >
            Refresh All
          </button>
          <button
            onClick={() => broadcastAction('logout')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            data-testid="broadcast-logout"
          >
            Logout All
          </button>
          <button
            onClick={syncData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            data-testid="sync-data"
          >
            Sync Data
          </button>
          <button
            onClick={() => {
              setReceivedMessages([]);
              localStorage.removeItem('shared_message');
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            data-testid="clear-messages"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Testing Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Open this page in multiple browser tabs</li>
          <li>2. Send messages from one tab and watch them appear in others</li>
          <li>3. Broadcast actions to all tabs simultaneously</li>
          <li>4. Close tabs to see the active count update</li>
        </ul>
      </div>
    </div>
  );
}
