const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './src/index.js',

    entry: {
        dropdown: './src/dropdown.js',
        selector: './src/selector.js'
    },

    resolve: {
        extensions: ['.vue', '.js', '.css'],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
        ],
    },

    plugins: [new VueLoaderPlugin()],
};
