module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:storybook/recommended",
    "prettier",
  ],
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
