import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Golden Rule 8: enable the React Compiler lint rules (recommended-latest).
  // eslint-config-next already registers the `react-hooks` plugin, so we apply
  // only the rule set to avoid redefining the plugin in flat config.
  {
    name: "react-compiler/recommended-latest",
    rules: reactHooks.configs["recommended-latest"].rules,
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
