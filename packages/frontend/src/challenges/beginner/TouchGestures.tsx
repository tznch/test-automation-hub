import { useState } from 'react';

type GestureType = 'tap' | 'long-press' | 'double-tap';

export default function TouchGestures() {
  const [lastGesture, setLastGesture] = useState<GestureType | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);
  const [doubleTapCount, setDoubleTapCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  let pressTimer: NodeJS.Timeout;
  let tapTimer: NodeJS.Timeout;
  let taps = 0;

  const handleTouchStart = () => {
    setIsPressed(true);

    // Long press detection
    pressTimer = setTimeout(() => {
      setLastGesture('long-press');
      setLongPressCount((c) => c + 1);
      setIsPressed(false);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
    setIsPressed(false);

    // Detect tap or double tap
    taps++;

    if (taps === 1) {
      tapTimer = setTimeout(() => {
        // Single tap
        setLastGesture('tap');
        setTapCount((c) => c + 1);
        taps = 0;
      }, 300);
    } else if (taps === 2) {
      // Double tap
      clearTimeout(tapTimer);
      setLastGesture('double-tap');
      setDoubleTapCount((c) => c + 1);
      taps = 0;
    }
  };

  const reset = () => {
    setLastGesture(null);
    setTapCount(0);
    setLongPressCount(0);
    setDoubleTapCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Touch Gestures</h1>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Last Gesture Detected</h2>
          <div className="bg-gray-700 p-8 rounded-lg text-center">
            {lastGesture ? (
              <div>
                <p className="text-4xl mb-2">
                  {lastGesture === 'tap' && '👆'}
                  {lastGesture === 'long-press' && '👇'}
                  {lastGesture === 'double-tap' && '✌️'}
                </p>
                <p className="text-2xl font-bold text-indigo-400">
                  {lastGesture
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-lg">No gesture detected yet</p>
            )}
          </div>
        </div>

        {/* Gesture Counters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-white" data-testid="tap-count">
              {tapCount}
            </p>
            <p className="text-sm text-gray-400">Taps</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-white" data-testid="long-press-count">
              {longPressCount}
            </p>
            <p className="text-sm text-gray-400">Long Presses</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-white" data-testid="double-tap-count">
              {doubleTapCount}
            </p>
            <p className="text-sm text-gray-400">Double Taps</p>
          </div>
        </div>

        {/* Interactive Touch Area */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Touch Area</h2>
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            className={`
              w-full h-64 rounded-lg flex items-center justify-center cursor-pointer
              transition-all duration-200 select-none
              ${isPressed ? 'bg-indigo-700 scale-95' : 'bg-indigo-600 hover:bg-indigo-500'}
            `}
            data-testid="touch-area"
          >
            <div className="text-center text-white">
              <p className="text-2xl font-bold mb-2">Touch Here</p>
              <p className="text-sm">Tap • Long Press (500ms) • Double Tap</p>
            </div>
          </div>
        </div>

        {/* Touch Target Size Test */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Touch Target Sizes</h2>
          <p className="text-gray-300 mb-4 text-sm">
            Minimum recommended touch target: 44x44px (WCAG 2.1)
          </p>
          <div className="flex gap-4 items-end">
            <div className="text-center">
              <button
                className="w-8 h-8 bg-red-600 rounded hover:bg-red-700"
                data-testid="small-target"
              />
              <p className="text-xs text-gray-400 mt-2">32px ❌</p>
            </div>
            <div className="text-center">
              <button
                className="w-11 h-11 bg-green-600 rounded hover:bg-green-700"
                data-testid="recommended-target"
              />
              <p className="text-xs text-gray-400 mt-2">44px ✓</p>
            </div>
            <div className="text-center">
              <button
                className="w-14 h-14 bg-blue-600 rounded hover:bg-blue-700"
                data-testid="large-target"
              />
              <p className="text-xs text-gray-400 mt-2">56px ✓</p>
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset Counters
        </button>

        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-2">Testing Tips</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use mobile device emulation in DevTools</li>
            <li>• Or test on actual mobile device</li>
            <li>• Verify visual feedback on touch</li>
            <li>• Test all three gesture types</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
