import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "eslint.config.mjs",
      "postcss.config.js",
      "next.config.js",
    ],
  },
  ...nextCoreWebVitals,
];
