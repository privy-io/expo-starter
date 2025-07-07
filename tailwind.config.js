/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: '#f1f5f9',
        border: '#e2e8f0',
        destructive: '#ef4444',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};