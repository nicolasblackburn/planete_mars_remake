const path = require('path');

const phaserModule = path.join(__dirname, '/node_modules/phaser/');

module.exports = {
    entry: {
      app: './src/app.ts',
      cli: './src/cli.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
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
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'dist')
    }
};
