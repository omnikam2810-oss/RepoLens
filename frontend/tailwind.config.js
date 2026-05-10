export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#172033',
        mist: '#F6F8FB',
        line: '#DDE5F0',
        brand: '#C084FC',
        emerald: '#059669',
        amber: '#D97706',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
