const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HappyPack = require('happypack');
const path = require('path');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');

module.exports = {
    entry: {
      app: './src/app.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        pathinfo: true
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'happypack/loader?id=ts', exclude: /node_modules/ },
            { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: ['expose-loader?Phaser'] },
            { test: /p2\.js/, loader: ['expose-loader?p2'] }
        ]
    },
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ],
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'assets'),
        'node_modules'
      ],
      alias: {
        'phaser': path.join(phaserModule, 'build/custom/phaser-split.js'),
        'pixi': path.join(phaserModule, 'build/custom/pixi.js'),
        'p2': path.join(phaserModule, 'build/custom/p2.js')
      }
    },
    plugins: [
      new HappyPack({
        id: 'ts',
        threads: 1,
        loaders: [
          {
            path: 'ts-loader',
            query: { happyPackMode: true }
          }
        ]
      }),
      new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
    ],
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'dist')
    }
};
