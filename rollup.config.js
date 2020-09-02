import { terser } from "rollup-plugin-terser";

const minify = process.env.prod ? terser() : null;

export default [
    {
        input: 'src/background.js',
        output: {
            file: 'dist/background.js',
            format: 'esm'
        },
        plugins: [minify]
    },
    {
        input: 'src/popup.js',
        output: {
            file: 'dist/popup.js',
            format: 'esm'
        },
        plugins: [minify]
    },
    {
        input: 'src/options.js',
        output: {
            file: 'dist/options.js',
            format: 'esm'
        },
        plugins: [minify]
    },
    {
        input: 'src/content.js',
        output: {
            file: 'dist/content.js',
            format: 'esm'
        },
        plugins: [minify]
    },
    {
        input: 'src/feed.js',
        output: {
            file: 'dist/feed.js',
            format: 'esm'
        },
        plugins: [minify]
    },
    {
        input: 'src/iframe.js',
        output: {
            file: 'dist/iframe.js',
            format: 'esm'
        },
        plugins: [minify]
    }
];