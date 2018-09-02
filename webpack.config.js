const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        app: "./src/app.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        pathinfo: true
    },
    module: {
        rules: [
            {
                test: /pixi\.js$/,
                use: [
                    {
                        loader: "expose-loader",
                        options: "PIXI"
                    }
                ]
            },
            {
                test: /phaser-split\.js$/,
                use: [
                    {
                        loader: "expose-loader",
                        options: "Phaser"
                    }
                ]
            },
            {
                test: /p2\.js$/,
                use: [
                    {
                        loader: "expose-loader",
                        options: "p2"
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        modules: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "assets"),
            "node_modules"
        ],
        alias: {
            phaser: path.join(__dirname, "node_modules/phaser-ce/build/custom/phaser-split.js"),
            pixi: path.join(__dirname,  "node_modules/phaser-ce/build/custom/pixi.js"),
            p2: path.join(__dirname,  "node_modules/phaser-ce/build/custom/p2.js")
        }
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                { from: "src/assets/html", to: "./" },
                {
                    from: "src/assets",
                    to: "assets",
                    ignore: ["src/assets/html/*"]
                }
            ],
            {}
        )
    ],
    devtool: "source-map",
    //devtool: 'cheap-module-eval-source-map',
    devServer: {
        //host: "192.168.1.107",
        contentBase: path.resolve(__dirname, "dist")
    }
};
