/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ainabi: {
          dark: "#050505",       // 가장 깊은 다크 배경 (Obsidian)
          surface: "#0D0D10",    // 카드 및 모달 배경
          yellow: "#F7FF00",     // 네온 옐로
          lime: "#CCFF00",       // 일렉트릭 라임
          green: "#00FF66",      // 사이버 그린
          silver: "#E5E5E5",     // 메탈릭 실버 (Chrome)
          gold: "#FFD700",       // 프리미엄 골드 (Highlight)
          blue: "#00E5FF",       // 사이버 블루
          pink: "#FF00FF",       // 네온 핑크
        }
      },
      backgroundImage: {
        'metallic-silver': 'linear-gradient(135deg, #E5E5E5 0%, #A3A3A3 50%, #666666 100%)',
        'cyber-gradient': 'linear-gradient(90deg, #00E5FF 0%, #FF00FF 50%, #00FF66 100%)',
        'obsidian-glass': 'linear-gradient(180deg, rgba(20, 20, 25, 0.9) 0%, rgba(5, 5, 5, 0.95) 100%)',
        'chrome-finish': 'linear-gradient(135deg, rgba(229, 229, 229, 0.2) 0%, rgba(163, 163, 163, 0.1) 50%, rgba(102, 102, 102, 0.2) 100%)',
      },
      boxShadow: {
        'neon-glow': '0 0 15px rgba(0, 229, 255, 0.4)',
        'chrome-shine': '0 0 20px rgba(229, 229, 229, 0.15)',
        'gold-bloom': '0 0 30px rgba(255, 215, 0, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
