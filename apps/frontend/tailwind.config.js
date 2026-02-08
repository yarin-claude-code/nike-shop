/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm beige/cream luxury palette
        primary: {
          DEFAULT: '#2C2520',
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#E8DFD6',
          300: '#D4C5B2',
          400: '#B8A898',
          500: '#9C8B7A',
          600: '#7A6B5D',
          700: '#5C4F44',
          800: '#3D352E',
          900: '#2C2520',
          950: '#1A1714',
        },
        accent: {
          DEFAULT: '#8B7355',
          50: '#FAF7F3',
          100: '#F0E8DD',
          200: '#E0D0BB',
          300: '#CDB494',
          400: '#B8996E',
          500: '#8B7355',
          600: '#725E45',
          700: '#5A4A37',
          800: '#43382A',
          900: '#2F271E',
        },
        surface: {
          dark: '#EDE6DD',
          DEFAULT: '#F5F0EB',
          light: '#FAF8F5',
          elevated: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.04em', fontWeight: '900' }],
        'display-lg': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['4rem', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-sm': ['2.5rem', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(44, 37, 32, 0.08)',
        'soft-md': '0 4px 30px rgba(44, 37, 32, 0.12)',
        'soft-lg': '0 8px 40px rgba(44, 37, 32, 0.16)',
        'warm': '0 4px 20px rgba(139, 115, 85, 0.15)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
