import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
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
  {
    rules: {
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
