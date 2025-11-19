import { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export default function ThemeSwitcher() {
  const defaultThemes: Theme[] = [
    {
      id: 'light',
      name: 'Light Mode',
      colors: {
        primary: '#4f46e5',
        secondary: '#e0e7ff',
        background: '#ffffff',
        text: '#111827',
      },
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      colors: {
        primary: '#818cf8',
        secondary: '#312e81',
        background: '#1f2937',
        text: '#f9fafb',
      },
    },
    {
      id: 'forest',
      name: 'Forest',
      colors: {
        primary: '#059669',
        secondary: '#d1fae5',
        background: '#ecfdf5',
        text: '#064e3b',
      },
    },
  ];

  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [customTheme, setCustomTheme] = useState<Theme>({
    id: 'custom',
    name: 'Custom Theme',
    colors: {
      primary: '#ec4899',
      secondary: '#fce7f3',
      background: '#fff1f2',
      text: '#881337',
    },
  });

  useEffect(() => {
    const savedThemeId = localStorage.getItem('theme_id');
    if (savedThemeId) {
      const theme = defaultThemes.find((t) => t.id === savedThemeId);
      if (theme) setCurrentTheme(theme);
      else if (savedThemeId === 'custom') {
        const savedCustom = localStorage.getItem('custom_theme');
        if (savedCustom) {
          const parsed = JSON.parse(savedCustom);
          setCustomTheme(parsed);
          setCurrentTheme(parsed);
        }
      }
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme_id', theme.id);
    if (theme.id === 'custom') {
      localStorage.setItem('custom_theme', JSON.stringify(theme));
    }
  };

  const handleCustomColorChange = (key: keyof Theme['colors'], value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Theme Switcher</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ Switch between predefined themes or create a custom one. Changes are persisted to localStorage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Selection */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {defaultThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                  data-testid={`theme-${theme.id}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{theme.name}</span>
                  </div>
                  <div className="h-12 rounded bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                    <div className="absolute inset-0" style={{ backgroundColor: theme.colors.background }}></div>
                    <div className="absolute top-2 left-2 right-2 h-2 rounded" style={{ backgroundColor: theme.colors.secondary }}></div>
                    <div className="absolute top-6 left-2 w-1/2 h-2 rounded" style={{ backgroundColor: theme.colors.text, opacity: 0.5 }}></div>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => applyTheme(customTheme)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentTheme.id === 'custom'
                    ? 'border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
                data-testid="theme-custom"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎨</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Custom</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Configure below
                </div>
              </button>
            </div>
          </div>

          {/* Custom Theme Editor */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom Theme Editor</h3>
            <div className="space-y-4">
              {Object.entries(customTheme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key} Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleCustomColorChange(key as keyof Theme['colors'], e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                      data-testid={`color-picker-${key}`}
                    />
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-16">{value}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => applyTheme(customTheme)}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                data-testid="save-custom-theme"
              >
                Apply Custom Theme
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h3>
          
          <div 
            className="rounded-xl shadow-lg overflow-hidden border transition-colors duration-300"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              borderColor: currentTheme.colors.secondary 
            }}
            data-testid="preview-area"
          >
            {/* Preview Header */}
            <div 
              className="p-4 border-b transition-colors duration-300"
              style={{ 
                backgroundColor: currentTheme.colors.secondary,
                borderColor: `${currentTheme.colors.primary}20`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 rounded bg-white/50"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/50"></div>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6 space-y-4">
              <h1 
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: currentTheme.colors.text }}
              >
                Theme Preview
              </h1>
              <p 
                className="transition-colors duration-300"
                style={{ color: currentTheme.colors.text, opacity: 0.8 }}
              >
                This component demonstrates how the selected theme colors are applied to various UI elements.
              </p>
              
              <div className="flex gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary,
                    color: '#ffffff'
                  }}
                >
                  Primary Action
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium border transition-colors duration-300"
                  style={{ 
                    borderColor: currentTheme.colors.primary,
                    color: currentTheme.colors.primary
                  }}
                >
                  Secondary
                </button>
              </div>

              <div className="mt-6 p-4 rounded-lg border border-dashed" style={{ borderColor: currentTheme.colors.text, opacity: 0.3 }}>
                <div className="h-2 w-2/3 rounded mb-2" style={{ backgroundColor: currentTheme.colors.text }}></div>
                <div className="h-2 w-1/2 rounded" style={{ backgroundColor: currentTheme.colors.text }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                localStorage.removeItem('theme_id');
                localStorage.removeItem('custom_theme');
                setCurrentTheme(defaultThemes[0]);
              }}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              data-testid="reset-themes"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Testing Hints */}
      <div className="mt-6 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Verify theme application: <code className="bg-gray-800 px-1 rounded">await expect(page.getByTestId('preview-area')).toHaveCSS('background-color', 'rgb(31, 41, 55)')</code></li>
          <li>• Test persistence: Reload page and check if theme remains selected</li>
          <li>• Test custom theme: Change color input and verify preview updates</li>
          <li>• Check localStorage: <code className="bg-gray-800 px-1 rounded">await page.evaluate(() =&gt; localStorage.getItem('theme_id'))</code></li>
        </ul>
      </div>
    </div>
  );
}
