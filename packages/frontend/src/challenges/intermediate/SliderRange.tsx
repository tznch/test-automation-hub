import { useState } from 'react';

export default function SliderRange() {
  const [singleValue, setSingleValue] = useState(50);
  const [rangeMin, setRangeMin] = useState(25);
  const [rangeMax, setRangeMax] = useState(75);
  const [stepValue, setStepValue] = useState(50);

  const handleRangeMinChange = (value: number) => {
    if (value <= rangeMax - 5) {
      setRangeMin(value);
    }
  };

  const handleRangeMaxChange = (value: number) => {
    if (value >= rangeMin + 5) {
      setRangeMax(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Slider / Range Input</h1>

        <div className="space-y-8">
          {/* Single Slider */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Single Value Slider</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Value:</span>
                <span className="font-mono font-bold">{singleValue}</span>
              </div>
              <input
                type="range"
                id="single-slider"
                min="0"
                max="100"
                value={singleValue}
                onChange={(e) => setSingleValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Dual-Handle Range Slider */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Dual-Handle Range</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Range:</span>
                <span className="font-mono font-bold">
                  {rangeMin} - {rangeMax}
                </span>
              </div>

              <div className="relative pt-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="range-min" className="text-sm text-gray-400">
                    Min: {rangeMin}
                  </label>
                  <label htmlFor="range-max" className="text-sm text-gray-400">
                    Max: {rangeMax}
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    id="range-min"
                    min="0"
                    max="100"
                    value={rangeMin}
                    onChange={(e) => handleRangeMinChange(Number(e.target.value))}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer accent-indigo-600 z-10"
                  />
                  <input
                    type="range"
                    id="range-max"
                    min="0"
                    max="100"
                    value={rangeMax}
                    onChange={(e) => handleRangeMaxChange(Number(e.target.value))}
                    className="absolute w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-8">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Step Increment Slider */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Step Increment Slider</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Value (step: 10):</span>
                <span className="font-mono font-bold">{stepValue}</span>
              </div>
              <input
                type="range"
                id="step-slider"
                min="0"
                max="100"
                step="10"
                value={stepValue}
                onChange={(e) => setStepValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((mark) => (
                  <span key={mark} className="text-center">
                    |
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 -mt-2">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Keyboard Controls Info */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">Keyboard Controls</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Arrow Left/Right: Adjust value</p>
              <p>• Home: Set to minimum</p>
              <p>• End: Set to maximum</p>
              <p>• Page Up/Down: Large increment/decrement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
