// postcss.config.mjs (ESM version)
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ Required for Tailwind in Next.js 15
    autoprefixer: {},
  },
};
