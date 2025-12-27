/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "eslint:recommended",
  ],
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

export default config;
