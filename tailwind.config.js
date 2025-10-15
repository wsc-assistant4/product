// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3f545f',
        'brand-secondary': '#5f788e',
        'brand-accent': '#e8c458',
        'neutral-dark': '#1c2120',
        'neutral-medium': '#665b4f',
        'neutral-light': '#e9e9e9',
      },
    },
  },
  plugins: [],
}