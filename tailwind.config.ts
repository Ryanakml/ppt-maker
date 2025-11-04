import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🌈 Gradient utama — pink → orange
        vivid: '#F55C7A',
        'vivid-secondary': '#F8A07D',
        'creative-ai-gradient':
          'linear-gradient(90deg, #F55C7A 0%, #F8A07D 100%)',

        // 🌒 Background dan foreground gelap
        background: {
          DEFAULT: '#0C0C0C', // gelap dasar
          90: '#111111',
          80: '#1A1A1A',
        },
        foreground: '#E4E4E7',

        // 🩶 Warna muted untuk teks deskripsi
        'muted-foreground': '#9CA3AF',

        // 🧱 Border tipis halus
        border: '#262626',

        // 🎨 Tombol & elemen interaktif
        primary: {
          DEFAULT: '#F55C7A',
          foreground: '#FFFFFF',
        },
      },

      // 🌅 Background image utilities
      backgroundImage: {
        'vivid-gradient': 'linear-gradient(90deg, #F55C7A 0%, #F8A07D 100%)',
      },

      // 🧭 Border radius konsisten
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
