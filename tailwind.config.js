/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        display: ['28px', { fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.03em' }],
        h1: ['22px', { fontWeight: '700', lineHeight: '1.20', letterSpacing: '-0.02em' }],
        h2: ['18px', { fontWeight: '700', lineHeight: '1.25', letterSpacing: '-0.015em' }],
        h3: ['15px', { fontWeight: '600', lineHeight: '1.30', letterSpacing: '-0.01em' }],
        h4: ['14px', { fontWeight: '600', lineHeight: '1.35' }],
        'body-lg': ['14px', { fontWeight: '400', lineHeight: '1.65' }],
        body: ['13px', { fontWeight: '400', lineHeight: '1.60' }],
        'body-sm': ['12px', { fontWeight: '400', lineHeight: '1.55' }],
        caption: ['11px', { fontWeight: '400', lineHeight: '1.50', letterSpacing: '0.01em' }],
        micro: ['10px', { fontWeight: '500', lineHeight: '1.40', letterSpacing: '0.02em' }],
      },
    },
  },
  plugins: [],
};
