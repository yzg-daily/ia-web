const fabric = require('@umijs/fabric');

module.exports = {
    ...fabric.prettier,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    bracketSpacing: true,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'es5',
    printWidth: 120,
    arrowParens: 'avoid',
    overrides: [
        {
            files: '.prettierrc',
            options: { parser: 'json' },
        },
    ],
};
