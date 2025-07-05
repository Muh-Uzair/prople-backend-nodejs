import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base JS/TS rules
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json", // optional but recommended for TS
      },
      globals: globals.node, // 👈 for Node.js apps
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      // ✅ Warn on unused variables (already present)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // ✅ Warn on console.log (this is new)
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Optional: Enable eslint:recommended for JavaScript files
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
  },
]);
