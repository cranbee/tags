module.exports = {
    entry: `${__dirname}/main.js`,
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: "raw-loader"
            }
        ]
    },
    devtool: "#inline-source-map"
};
