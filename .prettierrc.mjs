// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
    plugins: ['prettier-plugin-astro'],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
    singleQuote: true,
    semi: false,
    trailingComma: 'es5',
    tabWidth: 4,
}
