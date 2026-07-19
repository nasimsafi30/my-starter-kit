/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unsafe-function-type": "warn",
    "react-hooks/set-state-in-effect": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/immutability": "warn",
    "react/no-unescaped-entities": "warn",
    "prefer-const": "warn",
    "@next/next/no-html-link-for-pages": "warn"
  },
};

module.exports = config;