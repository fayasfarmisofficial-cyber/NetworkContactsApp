/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'page-bg': 'var(--color-page-bg)',
        'surface': 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border': 'var(--color-border)',
        'accent': 'var(--color-accent)',
        'red-50': 'var(--color-red-50)',
        'red-100': 'var(--color-red-100)',
        'red-600': 'var(--color-red-600)',
      },
    },
  },
  plugins: [],
}

