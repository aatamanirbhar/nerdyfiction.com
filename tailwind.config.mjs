/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,svelte,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"EB Garamond"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f5f3ee',
          100: '#e8e2d4',
          200: '#cfc4ac',
          300: '#b09f7d',
          400: '#8c7a52',
          500: '#5c4d30',
          600: '#3d321e',
          700: '#251e12',
          800: '#15110a',
          900: '#0a0805',
          950: '#050402',
        },
        ember: {
          400: '#ff6b4a',
          500: '#ff3b1a',
          600: '#d92410',
          700: '#a11608',
        },
      },
      keyframes: {
        'fade-in':       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-up':       { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'breathe':       { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.03)' } },
        'flicker':       { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        'red-streak':    { '0%': { transform: 'translateX(-120%) skewX(-30deg)', opacity: '0' }, '40%': { opacity: '1' }, '100%': { transform: 'translateX(120%) skewX(-30deg)', opacity: '0' } },
        'star-drift':    { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-100vh)' } },
      },
      animation: {
        'fade-in':    'fade-in 600ms ease-out both',
        'fade-up':    'fade-up 700ms cubic-bezier(0.16,1,0.3,1) both',
        'breathe':    'breathe 6s ease-in-out infinite',
        'flicker':    'flicker 3s ease-in-out infinite',
        'red-streak': 'red-streak 700ms cubic-bezier(0.7,0,0.3,1) both',
      },
    },
  },
  plugins: [],
};
