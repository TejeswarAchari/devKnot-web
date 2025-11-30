// tailwind.config.mjs
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  // You can put other tailwind `theme.extend` here if you need later
  theme: {
    extend: {},
  },

  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        devknotdark: {
          primary: "#facc15",
          "primary-focus": "#eab308",
          "primary-content": "#020617",

          secondary: "#f97316",
          "secondary-focus": "#ea580c",
          "secondary-content": "#020617",

          accent: "#22c55e",
          "accent-focus": "#16a34a",
          "accent-content": "#020617",

          neutral: "#020617",
          "neutral-focus": "#020617",
          "neutral-content": "#e5e7eb",

          "base-100": "#020617",
          "base-200": "#020617",
          "base-300": "#0b1120",
          "base-content": "#e5e7eb",

          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#ef4444",
        },
      },
      {
        devknotlight: {
          primary: "#eab308",
          "primary-focus": "#ca8a04",
          "primary-content": "#111827",

          secondary: "#f97316",
          "secondary-focus": "#ea580c",
          "secondary-content": "#111827",

          accent: "#22c55e",
          "accent-focus": "#16a34a",
          "accent-content": "#111827",

          neutral: "#0f172a",
          "neutral-focus": "#020617",
          "neutral-content": "#f9fafb",

          "base-100": "#f9fafb",
          "base-200": "#e5e7eb",
          "base-300": "#d1d5db",
          "base-content": "#020617",

          info: "#0ea5e9",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#ef4444",
        },
      },
    ],
  },
};
