import { useState, useEffect } from 'react';

const themes = {
  dark: {
    name: 'Dark',
    icon: '🌙',
    class: 'dark',
    colors: {
      primary: '#10b981',
      background: '#000000',
      surface: '#111827',
      text: '#ffffff'
    }
  },
  light: {
    name: 'Light',
    icon: '☀️',
    class: 'light',
    colors: {
      primary: '#10b981',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#111827'
    }
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    class: 'ocean',
    colors: {
      primary: '#06b6d4',
      background: '#083344',
      surface: '#0f4c75',
      text: '#e0f2fe'
    }
  },
  forest: {
    name: 'Forest',
    icon: '🌲',
    class: 'forest',
    colors: {
      primary: '#22c55e',
      background: '#14532d',
      surface: '#166534',
      text: '#dcfce7'
    }
  },
  sunset: {
    name: 'Sunset',
    icon: '🌅',
    class: 'sunset',
    colors: {
      primary: '#f97316',
      background: '#431407',
      surface: '#7c2d12',
      text: '#fed7aa'
    }
  },
  galaxy: {
    name: 'Galaxy',
    icon: '🌌',
    class: 'galaxy',
    colors: {
      primary: '#a855f7',
      background: '#1e1b4b',
      surface: '#312e81',
      text: '#e9d5ff'
    }
  }
};

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [isInHeader, setIsInHeader] = useState(false);

  useEffect(() => {
    // Check if saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
    
    // Check if ThemeToggle is in header (left side) or hero page (right side)
    const checkPosition = () => {
      const element = document.querySelector('[data-theme-toggle-position]');
      if (element) {
        setIsInHeader(element.getAttribute('data-theme-toggle-position') === 'header');
      } else {
        // Fallback: check if parent has header-like structure
        const parent = document.querySelector('.header') || document.querySelector('header');
        setIsInHeader(!!parent);
      }
    };
    
    checkPosition();
    // Recheck on window resize
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    
    // Remove all theme classes from document
    Object.values(themes).forEach(t => {
      document.documentElement.classList.remove(t.class);
      document.body.classList.remove(t.class);
    });
    
    // Add current theme class to both document and body
    document.documentElement.classList.add(theme.class);
    document.body.classList.add(theme.class);
    
    // Apply CSS custom properties with fallback
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--bg-color', theme.colors.background);
    root.style.setProperty('--surface-color', theme.colors.surface);
    root.style.setProperty('--text-color', theme.colors.text);
    
    // Apply direct styles for immediate effect
    root.style.backgroundColor = theme.colors.background;
    root.style.color = theme.colors.text;
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    
    // Force re-render on all elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      // Background classes
      if (el.classList.contains('bg-surface') || el.classList.contains('bg-background') || 
          el.classList.contains('bg-darker') || el.classList.contains('bg-gray-800') || 
          el.classList.contains('bg-gray-900') || el.classList.contains('bg-slate-800') || 
          el.classList.contains('bg-slate-900')) {
        el.style.backgroundColor = theme.colors.surface;
      }
      
      // Text classes - primary
      if (el.classList.contains('text-text-primary') || el.classList.contains('text-white') || 
          el.classList.contains('text-gray-100') || el.classList.contains('text-slate-100') || 
          el.classList.contains('text-slate-200') || el.classList.contains('text-slate-300') ||
          el.classList.contains('text-text.primary')) {
        el.style.color = theme.colors.text;
      }
      
      // Text classes - secondary/muted
      if (el.classList.contains('text-text-secondary') || el.classList.contains('text-text-muted') ||
          el.classList.contains('text-gray-400') || el.classList.contains('text-gray-500') || 
          el.classList.contains('text-slate-400') || el.classList.contains('text-slate-500') ||
          el.classList.contains('text-text.secondary') || el.classList.contains('text-text.muted')) {
        el.style.color = theme.colors.text;
        el.style.opacity = '0.7';
      }
      
      // Border classes
      if (el.classList.contains('border-border') || el.classList.contains('border-gray-600') ||
          el.classList.contains('border-gray-700') || el.classList.contains('border-slate-600') ||
          el.classList.contains('border-slate-700') || el.classList.contains('border-slate-800')) {
        el.style.borderColor = theme.colors.border || theme.colors.surface;
      }
      
      // Primary color classes
      if (el.classList.contains('bg-primary') || el.classList.contains('bg-green-600') ||
          el.classList.contains('bg-emerald-600') || el.classList.contains('bg-blue-600')) {
        el.style.backgroundColor = theme.colors.primary;
      }
      
      if (el.classList.contains('text-primary') || el.classList.contains('text-green-600') ||
          el.classList.contains('text-emerald-600') || el.classList.contains('text-blue-600')) {
        el.style.color = theme.colors.primary;
      }
      
      // Status colors
      if (el.classList.contains('text-status-success') || el.classList.contains('text-green-500')) {
        el.style.color = theme.colors.primary;
      }
    });
    
    // Update Tailwind CSS classes dynamically
    updateTailwindClasses(theme);
    
    // Save preference
    localStorage.setItem('theme', themeName);
    
    // Trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName, colors: theme.colors } }));
  };

  const updateTailwindClasses = (theme) => {
    // Update CSS custom properties that Tailwind uses
    const root = document.documentElement;
    
    // Map theme colors to Tailwind color variables
    const colorMap = {
      primary: theme.colors.primary,
      background: theme.colors.background,
      surface: theme.colors.surface,
      text: theme.colors.text
    };
    
    // Apply to root element for Tailwind to pick up
    Object.entries(colorMap).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };

  const currentThemeData = themes[currentTheme];

  return (
    <div className="relative" data-theme-toggle-position={isInHeader ? "header" : "hero"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-surface hover:bg-surfaceLight transition-all duration-200 border border-border flex items-center space-x-2 min-w-[100px] justify-center relative z-10"
        aria-label="Select theme"
      >
        <span className="text-lg">{currentThemeData.icon}</span>
        <span className="text-sm text-text-primary font-medium hidden sm:inline">{currentThemeData.name}</span>
        <svg 
          className={`w-4 h-4 text-text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <div className={`absolute top-full mt-2 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px] max-w-[250px] ${
          isInHeader ? 'left-0' : 'right-0'
        }`}>
          <div className="p-2">
            <div className="text-xs text-text-muted font-semibold px-2 py-1 mb-2">SELECT THEME</div>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => changeTheme(key)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentTheme === key 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-surfaceLight text-text-primary'
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{theme.name}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    <div 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.background }}
                    ></div>
                    <div 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.surface }}
                    ></div>
                  </div>
                </div>
                {currentTheme === key && (
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* Theme Preview */}
          <div className="border-t border-border p-3 bg-surfaceLight">
            <div className="text-xs text-text-muted mb-2">PREVIEW</div>
            <div 
              className="h-16 rounded-md border-2 border-border p-2"
              style={{ 
                backgroundColor: currentThemeData.colors.background,
                borderColor: currentThemeData.colors.primary
              }}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: currentThemeData.colors.primary }}
                ></div>
                <div 
                  className="flex-1 h-2 rounded"
                  style={{ backgroundColor: currentThemeData.colors.surface }}
                ></div>
              </div>
              <div 
                className="text-xs mt-2 font-medium"
                style={{ color: currentThemeData.colors.text }}
              >
                Sample Text
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
