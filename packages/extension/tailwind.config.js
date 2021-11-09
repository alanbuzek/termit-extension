module.exports = {
  purge: ['./src/**/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        // mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      },
      colors: {
        primary: {
          300: '#89BEFE',
          400: '#71a5e3',
          500: '#024ba3',
          600: '#FFFFFF',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
