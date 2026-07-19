/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/immutability": "off",
    "react/no-unescaped-entities": "off",
    "prefer-const": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off"
  },
};

module.exports = config;