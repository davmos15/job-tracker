import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
              ${theme === value 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }
            `}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;