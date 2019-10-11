const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: { index: './src/js/app.js' },

    output: {
        path: `${__dirname}/compiled`,
        filename: '[name].js',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                test: /\.(js|tsx?)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { url: false } },
                    'postcss-loader',
                ],
            },
        ],
    },

    plugins: [new VueLoaderPlugin()],

    resolve: {
        extensions: ['.css', '.js', '.ts', '.vue'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
    },

    stats: 'minimal',

    performance: {
        hints: false,
    },
};
