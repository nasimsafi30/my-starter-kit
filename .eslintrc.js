/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/exhaustive-deps": "off"
  },
};
module.exports = config;