import { useState } from 'react';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: '🏠', path: '#home' },
    { name: 'Products', icon: '📦', path: '#products' },
    { name: 'Services', icon: '⚙️', path: '#services' },
    { name: 'About', icon: 'ℹ️', path: '#about' },
    { name: 'Contact', icon: '📧', path: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white">Mobile Nav</h1>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex gap-6" data-testid="desktop-navigation">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="text-gray-300 hover:text-indigo-400 transition-colors"
              >
                {item.icon} {item.name}
              </a>
            ))}
          </nav>

          {/* Hamburger Button - visible on mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            data-testid="hamburger-button"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="mobile-menu-drawer"
      >
        <nav className="flex flex-col p-4 pt-20">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
              data-testid={`menu-item-${item.name.toLowerCase()}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          data-testid="menu-overlay"
        />
      )}

      {/* Main Content */}
      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Mobile Navigation Testing</h2>
          <p className="text-gray-300 mb-4">
            This challenge tests mobile navigation patterns. Resize your browser or use mobile
            emulation to see the hamburger menu.
          </p>

          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-white mb-2">📱 Mobile (&lt; 768px)</h3>
              <p className="text-sm text-gray-300">
                Hamburger menu visible, drawer navigation opens from left
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-white mb-2">🖥️ Desktop (≥ 768px)</h3>
              <p className="text-sm text-gray-300">
                Horizontal navigation bar in header, hamburger hidden
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Test Instructions</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Set viewport to mobile size (375x667)</li>
            <li>Click hamburger button to open menu</li>
            <li>Verify drawer slides in from left</li>
            <li>Click menu item or overlay to close</li>
            <li>Test on desktop viewport (menu should be in header)</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
