import { useState } from 'react';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  };

  const rgb = hexToRgb(color);
  const [r, setR] = useState(rgb.r);
  const [g, setG] = useState(rgb.g);
  const [b, setB] = useState(rgb.b);

  const presetColors = [
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#000000',
    '#ffffff',
  ];

  const handleHexChange = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setColor(hex);
      const newRgb = hexToRgb(hex);
      setR(newRgb.r);
      setG(newRgb.g);
      setB(newRgb.b);
    }
  };

  const handleRgbChange = (newR: number, newG: number, newB: number) => {
    setR(newR);
    setG(newG);
    setB(newB);
    setColor(rgbToHex(newR, newG, newB));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Color Picker</h1>

        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
          {/* Color Preview */}
          <div className="text-center">
            <div
              className="w-full h-32 rounded-lg mb-4 border-2 border-gray-600"
              style={{ backgroundColor: color }}
              data-testid="color-preview"
            />
            <p className="text-white font-mono text-lg">{color.toUpperCase()}</p>
            <p className="text-gray-400 font-mono">
              RGB({r}, {g}, {b})
            </p>
          </div>

          {/* Hex Input */}
          <div>
            <label htmlFor="hex-input" className="block text-sm font-medium text-gray-300 mb-2">
              Hex Color Code
            </label>
            <input
              type="text"
              id="hex-input"
              value={color}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="#000000"
            />
          </div>

          {/* RGB Sliders */}
          <div className="space-y-4">
            <div>
              <label htmlFor="red-slider" className="block text-sm font-medium text-gray-300 mb-2">
                Red: {r}
              </label>
              <input
                type="range"
                id="red-slider"
                min="0"
                max="255"
                value={r}
                onChange={(e) => handleRgbChange(Number(e.target.value), g, b)}
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="green-slider"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Green: {g}
              </label>
              <input
                type="range"
                id="green-slider"
                min="0"
                max="255"
                value={g}
                onChange={(e) => handleRgbChange(r, Number(e.target.value), b)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="blue-slider" className="block text-sm font-medium text-gray-300 mb-2">
                Blue: {b}
              </label>
              <input
                type="range"
                id="blue-slider"
                min="0"
                max="255"
                value={b}
                onChange={(e) => handleRgbChange(r, g, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Native Color Picker */}
          <div>
            <label htmlFor="native-picker" className="block text-sm font-medium text-gray-300 mb-2">
              Native Color Picker
            </label>
            <input
              type="color"
              id="native-picker"
              value={color}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full h-12 rounded-md cursor-pointer"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Preset Colors</h3>
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => handleHexChange(presetColor)}
                  className="w-full h-10 rounded-md border-2 hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: presetColor,
                    borderColor: color === presetColor ? '#fff' : '#4b5563',
                  }}
                  title={presetColor}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
