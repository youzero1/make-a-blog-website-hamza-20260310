import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crown: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f4dab2',
          300: '#ecc07f',
          400: '#e3a24a',
          500: '#d4821e',
          600: '#b86a16',
          700: '#9a5415',
          800: '#7d4418',
          900: '#673918',
          950: '#3a1d0a',
        },
        royal: {
          50: '#f0f0ff',
          100: '#e4e3ff',
          200: '#cccbff',
          300: '#aba8ff',
          400: '#8780fd',
          500: '#6b5cf8',
          600: '#5a3eee',
          700: '#4c2fd4',
          800: '#3f27ac',
          900: '#352489',
          950: '#1f1352',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
