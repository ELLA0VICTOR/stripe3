/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"SUSE Mono"', '"SFMono-Regular"', '"Cascadia Code"', "Consolas", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        base: "var(--bg-base)",
        app: "var(--bg-app)",
        sidebar: "var(--bg-sidebar)",
        card: "var(--bg-card)",
        elevated: "var(--bg-elevated)",
        hover: "var(--bg-hover)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
}
