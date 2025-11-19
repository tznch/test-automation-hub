import { useState } from 'react';

export default function Clipboard() {
  const [textToCopy, setTextToCopy] = useState('Hello, Playwright! This is a test text for clipboard operations.');
  const [pastedText, setPastedText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleCopyFromInput = async () => {
    const input = document.getElementById('copy-input') as HTMLInputElement;
    if (input) {
      input.select();
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Clipboard Operations</h2>

      {/* Copy Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Copy to Clipboard</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text to Copy:
          </label>
          <textarea
            value={textToCopy}
            onChange={(e) => setTextToCopy(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            data-testid="copy-textarea"
          />
        </div>

        <button
          onClick={handleCopy}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
          data-testid="copy-button"
        >
          {copySuccess ? '✓ Copied!' : 'Copy Text'}
        </button>

        {copySuccess && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400 text-sm" data-testid="copy-success">
            Text copied to clipboard successfully!
          </div>
        )}
      </div>

      {/* Paste Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📝 Paste from Clipboard</h3>
        
        <button
          onClick={handlePaste}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition mb-4"
          data-testid="paste-button"
        >
          Paste Text
        </button>

        {pasteSuccess && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400 text-sm" data-testid="paste-success">
            Text pasted successfully!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pasted Text:
          </label>
          <textarea
            value={pastedText}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
            rows={3}
            placeholder="Click 'Paste Text' to see clipboard content here"
            data-testid="paste-textarea"
          />
        </div>
      </div>

      {/* Copy from Input Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Copy from Input Field</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            id="copy-input"
            type="text"
            defaultValue="Copy this selected text"
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="copy-input"
          />
          <button
            onClick={handleCopyFromInput}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition"
            data-testid="copy-input-button"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Testing Hints */}
      <div className="bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use <code className="bg-gray-800 px-1 rounded">navigator.clipboard.writeText()</code> in page context</li>
          <li>• Read clipboard with <code className="bg-gray-800 px-1 rounded">navigator.clipboard.readText()</code></li>
          <li>• Test keyboard shortcuts: Ctrl+C / Ctrl+V (or Cmd on Mac)</li>
          <li>• Handle clipboard permissions in headless mode with <code className="bg-gray-800 px-1 rounded">context.grantPermissions(['clipboard-read', 'clipboard-write'])</code></li>
          <li>• Verify clipboard content matches copied text</li>
          <li>• Test success feedback messages appear and disappear</li>
        </ul>
      </div>
    </div>
  );
}
