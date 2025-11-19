import { useState, useEffect } from 'react';

interface Shortcut {
  id: string;
  key: string;
  description: string;
  action: () => void;
}

export default function KeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const shortcuts: Shortcut[] = [
    {
      id: 'search',
      key: 'Ctrl+K',
      description: 'Open search',
      action: () => {
        setSearchOpen(true);
        addOutput('Opened search (Ctrl+K)');
      },
    },
    {
      id: 'help',
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => {
        setHelpOpen(true);
        addOutput('Opened help (?)');
      },
    },
    {
      id: 'new',
      key: 'Ctrl+N',
      description: 'Create new item',
      action: () => addOutput('New item created (Ctrl+N)'),
    },
    {
      id: 'save',
      key: 'Ctrl+S',
      description: 'Save',
      action: () => addOutput('Saved (Ctrl+S)'),
    },
    {
      id: 'undo',
      key: 'Ctrl+Z',
      description: 'Undo',
      action: () => addOutput('Undo (Ctrl+Z)'),
    },
    {
      id: 'redo',
      key: 'Ctrl+Shift+Z',
      description: 'Redo',
      action: () => addOutput('Redo (Ctrl+Shift+Z)'),
    },
  ];

  const addOutput = (message: string) => {
    setOutput((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Escape to close dialogs
      if (e.key === 'Escape') {
        setHelpOpen(false);
        setSearchOpen(false);
        return;
      }

      // Question mark for help
      if (e.key === '?' && !e.shiftKey && !ctrlKey && !searchOpen) {
        e.preventDefault();
        setHelpOpen(true);
        addOutput('Opened help (?)');
        return;
      }

      // Ctrl+K for search
      if (e.key === 'k' && ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
        addOutput('Opened search (Ctrl+K)');
        return;
      }

      // Ctrl+N for new
      if (e.key === 'n' && ctrlKey) {
        e.preventDefault();
        addOutput('New item created (Ctrl+N)');
        return;
      }

      // Ctrl+S for save
      if (e.key === 's' && ctrlKey) {
        e.preventDefault();
        addOutput('Saved (Ctrl+S)');
        return;
      }

      // Ctrl+Z for undo
      if (e.key === 'z' && ctrlKey && !e.shiftKey) {
        e.preventDefault();
        addOutput('Undo (Ctrl+Z)');
        return;
      }

      // Ctrl+Shift+Z for redo
      if (e.key === 'z' && ctrlKey && e.shiftKey) {
        e.preventDefault();
        addOutput('Redo (Ctrl+Shift+Z)');
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Keyboard Shortcuts</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">?</kbd> to view all keyboard shortcuts or <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Ctrl+K</kbd> to open search
        </p>
      </div>

      {/* Action Output Log */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Action Log</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 h-64 overflow-y-auto font-mono text-sm" data-testid="output-log">
          {output.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Press keyboard shortcuts to see actions...</p>
          ) : (
            output.map((line, i) => (
              <div key={i} className="text-gray-700 dark:text-gray-300" data-testid={`output-${i}`}>
                {line}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setOutput([])}
          className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
          data-testid="clear-log"
        >
          Clear Log
        </button>
      </div>

      {/* Help Dialog */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="help-dialog">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
              <button
                onClick={() => setHelpOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                data-testid="close-help"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700"
                  data-testid={`shortcut-${shortcut.id}`}
                >
                  <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border rounded">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50" data-testid="search-dialog">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full mx-4 p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              data-testid="search-input"
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border rounded">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}

      {/* Testing Hints */}
      <div className="bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use <code className="bg-gray-800 px-1 rounded">page.keyboard.press('Control+K')</code></li>
          <li>• Test Meta key for Mac: <code className="bg-gray-800 px-1 rounded">page.keyboard.press('Meta+K')</code></li>
          <li>• Verify focus changes after shortcuts trigger</li>
          <li>• Test Escape key closes dialogs</li>
          <li>• Verify action log updates on shortcut press</li>
        </ul>
      </div>
    </div>
  );
}
