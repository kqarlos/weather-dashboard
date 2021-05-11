const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        app: "./assets/js/script.js",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    mode: 'development'
};