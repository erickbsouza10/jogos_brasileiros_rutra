module.exports = {
  content: [
    "./pages/*.{html,js}",
    "./index.html",
    "./js/**/*.js",
    "./components/**/*.{html,js}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors - Deep sports blue
        primary: {
          DEFAULT: '#1B4B8C', // blue-900
          50: '#EBF2F9',
          100: '#D7E5F3',
          200: '#AFCBE7',
          300: '#87B1DB',
          400: '#5F97CF',
          500: '#377DC3',
          600: '#2D6AA0',
          700: '#1B4B8C',
          800: '#163A6A',
          900: '#102948',
        },
        // Secondary Colors - Lighter blue
        secondary: {
          DEFAULT: '#2D5AA0', // blue-700
          50: '#EDF4FB',
          100: '#DBE9F7',
          200: '#B7D3EF',
          300: '#93BDE7',
          400: '#6FA7DF',
          500: '#4B91D7',
          600: '#3C74AC',
          700: '#2D5AA0',
          800: '#244775',
          900: '#1B354A',
        },
        // Accent Colors - Brazilian green
        accent: {
          DEFAULT: '#00A859', // green-600
          50: '#E6F7F0',
          100: '#CCEFE1',
          200: '#99DFC3',
          300: '#66CFA5',
          400: '#33BF87',
          500: '#00AF69',
          600: '#00A859',
          700: '#008647',
          800: '#006435',
          900: '#004223',
        },
        // Background Colors
        background: '#FAFBFC', // gray-50
        surface: '#FFFFFF', // white
        // Text Colors
        'text-primary': '#1A1D23', // gray-900
        'text-secondary': '#64748B', // slate-500
        // Status Colors
        success: {
          DEFAULT: '#059669', // emerald-600
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          DEFAULT: '#D97706', // amber-600
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          DEFAULT: '#DC2626', // red-600
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        // Border Colors
        border: 'rgba(100, 116, 139, 0.2)', // slate-500 with opacity
        'border-hover': 'rgba(27, 75, 140, 0.4)', // primary with opacity
      },
      fontFamily: {
        heading: ['Merriweather', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.4' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
      },
      spacing: {
        'xs': '0.5rem', // 8px
        'sm': '1rem', // 16px
        'md': '1.25rem', // 20px
        'lg': '2rem', // 32px
        'xl': '5rem', // 80px
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'base': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'xl': '0 20px 40px -8px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        '250': '250ms',
        '150': '150ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      ringWidth: {
        '3': '3px',
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      scale: {
        '98': '0.98',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      height: {
        '12': '48px',
        '14': '56px',
      },
      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}