/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Medical Navy — primary brand, nav, headings on light bg
        navy: {
          50: "#EEF2F6",
          100: "#D7E1EA",
          200: "#AFC3D6",
          300: "#8CA4BC",
          400: "#4F7096",
          500: "#1B3A5C",
          600: "#14304C",
          700: "#0F253C",
          800: "#0B1C2E",
          900: "#081524",
        },
        // Muted Teal — secondary accent, links, active nav
        teal: {
          50: "#EAF4F2",
          100: "#CDE6E1",
          200: "#A4D0C7",
          300: "#7FB8AF",
          400: "#4E9A8F",
          500: "#2E7D74",
          600: "#256660",
          700: "#1C4F4B",
          800: "#153C39",
        },
        // Warm White — page background
        warm: {
          50: "#FFFFFF",
          100: "#FAF8F3",
          200: "#F3EFE6",
          300: "#EAE4D6",
        },
        // Soft Gray — borders, muted text, dividers
        stone: {
          50: "#F6F5F2",
          100: "#EDEBE6",
          200: "#E1DED6",
          300: "#C9C5BB",
          400: "#A6A29A",
          500: "#847F76",
          600: "#66625B",
          700: "#4A4741",
          800: "#322F2B",
        },
        // Controlled Emergency Red — reserved for true emergency states
        emred: {
          50: "#FBEAEA",
          100: "#F3CFCF",
          300: "#DD8E8A",
          500: "#B3261E",
          600: "#942019",
          700: "#7A1A15",
        },
        // Natural Green — normal / safe status
        leaf: {
          50: "#EAF4EC",
          100: "#CFE6D4",
          500: "#3F7D53",
          600: "#336745",
        },
        // Amber — urgent / caution status
        amber: {
          50: "#FBF1E1",
          100: "#F3DCB0",
          500: "#C98A2C",
          600: "#A96F1D",
        },
      },
      fontFamily: {
        display: ["'Newsreader'", "'Noto Serif Bengali'", "Georgia", "serif"],
        sans: ["'Manrope'", "'Noto Sans Bengali'", "'Segoe UI'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 28, 46, 0.06), 0 1px 3px rgba(11, 28, 46, 0.08)",
        raised: "0 4px 14px rgba(11, 28, 46, 0.10)",
      },
      borderRadius: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};
