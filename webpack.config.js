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
                test: /\.(js|ts?)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
    },

    stats: 'minimal',

    performance: {
        hints: false,
    },
};
