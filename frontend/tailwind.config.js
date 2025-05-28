/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
      colors: {
        primary: '#3B82F6', // You can change this to match your app's theme
        'primary-dark': '#2563EB',
      },
    },
  },
  plugins: [],
};