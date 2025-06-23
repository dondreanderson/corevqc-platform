/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        construction: {
          orange: '#ff6b35',
          yellow: '#ffd23f',
          blue: '#4a90e2',
          green: '#3ddc84',
        },
        quality: {
          excellent: '#10b981',
          good: '#f59e0b',
          poor: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'construction': '0 4px 16px rgba(255, 107, 53, 0.2)',
      }
    },
  },
  plugins: [],
}
