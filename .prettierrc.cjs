// Heads up: This file should be renamed to `.cjs`, however if we did that, changesets wouldn't be able to load it
module.exports = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: true,
  importOrder: ['^components/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['./node_modules/prettier-plugin-astro', './node_modules/prettier-plugin-svelte'],
  overrides: [
    {
      files: ['.*', '*.json', '*.md', '*.toml', '*.yml'],
      options: {
        useTabs: false,
      },
    },
    {
      files: ['**/*.astro'],
      options: {
        parser: 'astro',
      },
    },
    {
      files: ['**/*.svelte'],
      options: {
        parser: 'svelte',
      },
    },
  ],
};
