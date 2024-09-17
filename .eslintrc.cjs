module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:storybook/recommended",
    "prettier",
  ],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    projectService: true,
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "no-unused-vars": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
      },
    ],
  },
};
