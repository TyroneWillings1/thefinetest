/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ correctly catches your React components
    "./public/index.html"         // ✅ sometimes needed for static classnames
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
