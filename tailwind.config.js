/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0D18',
        console: '#141A2E',
        bakelite: '#5B4B8A',
        violet: '#7A68A8',
        teal: { DEFAULT: '#3F8F8B', shadow: '#2A5F5C' },
        cream: '#E8DFC8',
        phosphor: '#7CFFB2',
        amber: '#FFB347',
        signal: '#FF3B3B',
        muted: '#9AA3C4',
      },
      fontFamily: {
        pixel: ['"Pixelify Sans"', 'monospace'],
        silk: ['Silkscreen', 'monospace'],
        term: ['VT323', 'monospace'],
        body: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
