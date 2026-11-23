module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#0A0A0A', accent: '#FF3D00', mist: '#F5F5F5' },
      fontFamily: { sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '22px' }
    }
  },
  plugins: []
};
