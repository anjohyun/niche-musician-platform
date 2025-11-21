import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f9f4',
          100: '#daf2e4',
          200: '#b0e4ca',
          300: '#7dcfa8',
          400: '#4db888',
          500: '#2d9d6e',
          600: '#1e7d57',
          700: '#186548',
          800: '#15503a',
          900: '#124231',
        },
        sage: {
          50: '#f6f8f6',
          100: '#e3e9e3',
          200: '#c7d3c8',
          300: '#a3b5a5',
          400: '#7d9580',
          500: '#5f7963',
          600: '#4a614d',
          700: '#3d4f40',
          800: '#344136',
          900: '#2c372e',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f5ede0',
          300: '#ede0cc',
          400: '#e3cfb3',
          500: '#d4b896',
        },
        mystic: {
          50: '#f5f7fa',
          100: '#e9eef5',
          600: '#44658d',
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0,0,0,0.07)',
        nature: '0 4px 20px -2px rgba(45,157,110,0.1)',
        glow: '0 0 15px rgba(45,157,110,0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
