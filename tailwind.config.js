/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1a1a1a',
        surface: '#2a2a2a',
        border: '#3a3a3a',
        text: '#e0e0e0',
        muted: '#888888',
        accent: '#00cc66',
        success: '#00cc66',
        warning: '#ffaa00',
        danger: '#ff4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
