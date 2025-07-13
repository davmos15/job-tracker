/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,scss}",
    "./public/**/*.html",
  ],
  safelist: [
    // Common icon and component sizes
    'w-3', 'h-3', 'w-4', 'h-4', 'w-5', 'h-5', 'w-6', 'h-6', 'w-8', 'h-8', 'w-12', 'h-12', 'w-16', 'h-16',
    // Status colors for dynamic classes
    'bg-blue-100', 'text-blue-800', 'bg-green-100', 'text-green-800',
    'bg-red-100', 'text-red-800', 'bg-purple-100', 'text-purple-800',
    'bg-gray-100', 'text-gray-800', 'bg-orange-100', 'text-orange-800',
    'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600',
    'text-gray-600', 'text-orange-600',
    // Common spacing and layout classes
    'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'px-2', 'px-3', 'py-1', 'py-2', 'px-2.5', 'py-0.5',
    'mr-1', 'ml-1', 'mt-1', 'mb-1', 'mr-2', 'ml-2', 'mt-2', 'mb-2', 'mr-4', 'ml-4',
    'space-x-2', 'space-x-4', 'space-y-2', 'space-y-3',
    // Flex and grid classes
    'flex', 'inline-flex', 'flex-1', 'flex-shrink-0', 'items-center', 'justify-between',
    'min-w-0', 'truncate',
    // Text and typography
    'text-xs', 'text-sm', 'text-lg', 'text-2xl', 'text-3xl', 'font-medium', 'font-semibold', 'font-bold',
    'line-clamp-2', 'whitespace-pre-wrap', 'capitalize',
    // Border and background
    'rounded', 'rounded-lg', 'rounded-full', 'border-t', 'border-gray-200',
    'bg-white', 'bg-gray-50', 'bg-gray-100',
    // Interactive states
    'hover:text-gray-600', 'hover:text-gray-700', 'hover:text-gray-800', 'hover:text-red-600', 'hover:text-blue-800',
    // Loading spinner and animation classes
    'animate-spin', 'animate-pulse',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};