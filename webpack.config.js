const path = require('path');

module.exports = {
    entry: { index: './src/app.ts' },

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
                test: /ignition\.js$/,
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
        },
    },

    stats: 'minimal',

    performance: {
        hints: false,
    },
};
