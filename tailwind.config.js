/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Flat Design Paint Industry Colors
        paint: {
          primer: {
            DEFAULT: "#2563eb", // Deep blue - foundation/base
            light: "#3b82f6",
            dark: "#1d4ed8",
            foreground: "#ffffff",
          },
          wall: {
            DEFAULT: "#16a34a", // Vibrant green - primary surface
            light: "#22c55e",
            dark: "#15803d",
            foreground: "#ffffff",
          },
          ceiling: {
            DEFAULT: "#6b7280", // Light gray - neutral ceiling
            light: "#9ca3af",
            dark: "#4b5563",
            foreground: "#ffffff",
          },
          trim: {
            DEFAULT: "#ea580c", // Warm orange - accent details
            light: "#f97316",
            dark: "#c2410c",
            foreground: "#ffffff",
          },
        },
        // Business UI Colors (Flat Design)
        business: {
          action: "#1d4ed8", // Professional blue - primary actions
          success: "#059669", // Paint green - completed items
          warning: "#d97706", // Constructor orange - warnings
          error: "#dc2626", // Clear red - errors
        },
        // AdCreative.ai Design System Colors
        adcreative: {
          primary: "#ef2b70", // Main pink brand color
          secondary: "#ff6b9d", // Lighter pink for gradients
          accent: "#ff8fb3", // Softest pink for backgrounds
          purple: "#9333ea", // Complementary purple
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6", 
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          },
        },
        // Flat Design Neutrals
        flat: {
          white: "#ffffff",
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Flat Design rounded corners
        flat: "8px",
        "flat-lg": "12px",
        "flat-xl": "16px",
      },
      fontFamily: {
        // Flat Design Typography - Clean Sans-Serif
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Flat Design Typography Scale
        'flat-xs': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'flat-sm': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'flat-base': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'flat-lg': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'flat-xl': ['20px', { lineHeight: '32px', fontWeight: '600' }],
        'flat-2xl': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'flat-3xl': ['30px', { lineHeight: '36px', fontWeight: '700' }],
        'flat-4xl': ['36px', { lineHeight: '40px', fontWeight: '800' }],
      },
      boxShadow: {
        // Flat Design 2.0 - Subtle shadows for usability
        'flat': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'flat-md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'flat-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'flat-hover': '0 2px 4px rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
      },
      backgroundSize: {
        '200': '200% 100%',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}