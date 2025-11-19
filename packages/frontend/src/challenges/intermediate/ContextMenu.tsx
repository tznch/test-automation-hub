import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: () => void;
  submenu?: MenuItem[];
  divider?: boolean;
}

export default function ContextMenu() {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ x: number; y: number; id: string } | null>(null);
  const [selectedText, setSelectedText] = useState('');

  const menuItems: MenuItem[] = [
    {
      id: 'cut',
      label: 'Cut',
      icon: '✂️',
      action: () => {
        alert('Cut action');
        setMenuPosition(null);
      },
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      action: () => {
        alert('Copy action');
        setMenuPosition(null);
      },
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📄',
      action: () => {
        alert('Paste action');
        setMenuPosition(null);
      },
    },
    { id: 'divider-1', label: '', divider: true },
    {
      id: 'format',
      label: 'Format',
      icon: '🎨',
      submenu: [
        { id: 'bold', label: 'Bold', icon: '**B**', action: () => alert('Bold') },
        { id: 'italic', label: 'Italic', icon: '*I*', action: () => alert('Italic') },
        { id: 'underline', label: 'Underline', icon: '_U_', action: () => alert('Underline') },
      ],
    },
    {
      id: 'share',
      label: 'Share',
      icon: '🔗',
      submenu: [
        { id: 'email', label: 'Email', icon: '📧', action: () => alert('Share via Email') },
        { id: 'social', label: 'Social Media', icon: '📱', action: () => alert('Share on Social') },
        { id: 'link', label: 'Copy Link', icon: '🔗', action: () => alert('Link Copied') },
      ],
    },
    { id: 'divider-2', label: '', divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      action: () => {
        alert('Delete action');
        setMenuPosition(null);
      },
    },
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection()?.toString() || '';
    setSelectedText(selection);
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setSubmenuPosition(null);
  };

  const handleSubmenuHover = (e: React.MouseEvent, itemId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSubmenuPosition({
      x: rect.right,
      y: rect.top,
      id: itemId,
    });
  };

  useEffect(() => {
    const handleClick = () => {
      setMenuPosition(null);
      setSubmenuPosition(null);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuPosition(null);
        setSubmenuPosition(null);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Context Menu</h2>

      {/* Context Menu Area */}
      <div
        onContextMenu={handleContextMenu}
        className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 min-h-[400px] cursor-context-menu flex items-center justify-center"
        data-testid="context-menu-area"
      >
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Right-click anywhere here</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Try selecting some text and right-clicking!</p>
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              This is some selectable text. Select part of it and right-click to see the context menu with
              additional options.
            </p>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {menuPosition && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[200px] z-50"
          style={{ top: menuPosition.y, left: menuPosition.x }}
          data-testid="context-menu"
          role="menu"
        >
          {selectedText && (
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Selected: "{selectedText.substring(0, 20)}..."
            </div>
          )}
          {menuItems.map((item) => {
            if (item.divider) {
              return (
                <div key={item.id} className="h-px bg-gray-200 dark:bg-gray-700 my-2" data-testid={`divider-${item.id}`} />
              );
            }

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={(e) => item.submenu && handleSubmenuHover(e, item.id)}
              >
                <button
                  onClick={item.action}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                  data-testid={`menu-item-${item.id}`}
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                  {item.submenu && <span className="text-gray-400">▶</span>}
                </button>

                {/* Submenu */}
                {item.submenu && submenuPosition?.id === item.id && (
                  <div
                    className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[180px] z-50"
                    style={{ top: submenuPosition.y, left: submenuPosition.x }}
                    data-testid={`submenu-${item.id}`}
                    role="menu"
                  >
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          subItem.action?.();
                          setMenuPosition(null);
                          setSubmenuPosition(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        data-testid={`submenu-item-${subItem.id}`}
                        role="menuitem"
                      >
                        {subItem.icon && <span>{subItem.icon}</span>}
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use <code className="bg-gray-800 px-1 rounded">page.click(selector, {'{'} button: 'right' {'}'})</code> for right-click</li>
          <li>• Use <code className="bg-gray-800 px-1 rounded">page.getByRole('menu')</code> and <code className="bg-gray-800 px-1 rounded">page.getByRole('menuitem')</code></li>
          <li>• Test keyboard navigation with arrow keys</li>
          <li>• Verify menu position relative to click coordinates</li>
          <li>• Test menu closes on Escape key or click outside</li>
          <li>• Test nested submenus appear on hover</li>
        </ul>
      </div>
    </div>
  );
}
