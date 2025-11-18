import { useState } from 'react';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export default function LoadingStates() {
  const [spinnerState, setSpinnerState] = useState<LoadingState>('idle');
  const [skeletonState, setSkeletonState] = useState<LoadingState>('idle');
  const [progressState, setProgressState] = useState<LoadingState>('idle');
  const [progress, setProgress] = useState(0);

  const simulateLoading = (setState: (state: LoadingState) => void, withProgress = false) => {
    setState('loading');

    if (withProgress) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }

    setTimeout(() => {
      setState(Math.random() > 0.3 ? 'success' : 'error');
      if (withProgress) setProgress(100);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Loading States</h1>
        <p className="text-gray-300 mb-8">Test various loading indicators and skeleton screens.</p>

        <div className="space-y-8">
          {/* Spinner */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Loading Spinner</h2>
            <button
              onClick={() => simulateLoading(setSpinnerState)}
              disabled={spinnerState === 'loading'}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors mb-4"
            >
              Load Data
            </button>

            <div className="mt-4 h-32 flex items-center justify-center bg-gray-700 rounded-lg">
              {spinnerState === 'loading' && (
                <div role="status" aria-label="Loading" className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-300">Loading...</span>
                </div>
              )}
              {spinnerState === 'success' && (
                <div className="text-green-400">✓ Data loaded successfully</div>
              )}
              {spinnerState === 'error' && (
                <div className="text-red-400">✕ Failed to load data</div>
              )}
              {spinnerState === 'idle' && (
                <div className="text-gray-400">Click button to load data</div>
              )}
            </div>
          </div>

          {/* Skeleton Screen */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Skeleton Screen</h2>
            <button
              onClick={() => simulateLoading(setSkeletonState)}
              disabled={skeletonState === 'loading'}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors mb-4"
            >
              Load Content
            </button>

            <div className="mt-4 space-y-4">
              {skeletonState === 'loading' && (
                <div data-testid="skeleton" className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-600 rounded"></div>
                </div>
              )}
              {skeletonState === 'success' && (
                <div className="text-gray-300">
                  <h3 className="font-bold text-lg mb-2">Article Title</h3>
                  <p className="mb-2">
                    This is the actual content that was loaded. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit.
                  </p>
                  <div className="bg-gray-700 h-32 rounded flex items-center justify-center">
                    Image Placeholder
                  </div>
                </div>
              )}
              {skeletonState === 'error' && (
                <div className="text-red-400">Failed to load content</div>
              )}
              {skeletonState === 'idle' && (
                <div className="text-gray-400">Click button to load content</div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Progress Indicator</h2>
            <button
              onClick={() => simulateLoading(setProgressState, true)}
              disabled={progressState === 'loading'}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors mb-4"
            >
              Start Upload
            </button>

            {progressState === 'loading' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}
            {progressState === 'success' && (
              <div className="text-green-400">✓ Upload completed</div>
            )}
            {progressState === 'error' && <div className="text-red-400">✕ Upload failed</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
