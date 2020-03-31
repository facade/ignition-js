const path = require('path');

module.exports = {
    entry: { index: './src/index.ts' },

    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                loaders: ['arraybuffer-loader'],
            },
            {
                test: /\.(js|ts?)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /ignition\.js|dropdown\.js|selector\.js/,
                use: 'raw-loader',
            },
        ],
    },

    resolve: {
        extensions: ['.js', '.ts', '.d.ts'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            ignitionIframeScript$: path.resolve(
                __dirname,
                './node_modules/@facadecompany/ignition-ui/compiled/ignition.js',
            ),
            dropdownIframeScript$: path.resolve(
                __dirname,
                './node_modules/@facadecompany/ignition-dropdown/dist/dropdown.js',
            ),
            selectorIframeScript$: path.resolve(
                __dirname,
                './node_modules/@facadecompany/ignition-dropdown/dist/selector.js',
            ),
        },
    },

    externals: {
        react: 'react',
    },

    stats: 'minimal',

    performance: {
        hints: false,
    },
};
