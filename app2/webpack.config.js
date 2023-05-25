const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultWebpackSplit = {
  chunks: 'async',
  minSize: 20000,
  minRemainingSize: 0,
  minChunks: 1,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  enforceSizeThreshold: 50000,
  cacheGroups: {
      'vendor-core-components': {
        // test: /[\\/]node_modules[\\/](@mui\/material)[\\/]/,
        test: (te) =>{
          console.log('test', te.resource)

          return te.resource?.includes('@mui')
        },
        chunks: 'all',
        priority: 10,
        name: 'vendor-core-components'
      },
      'vendor-core-components': {
        // test: /[\\/]node_modules[\\/](@mui\/material)[\\/]/,
        test: (te) =>{
          console.log('test', te.resource)

          return te.resource?.includes('@mui')
        },
        chunks: 'all',
        priority: 10,
        name: 'vendor-core-components'
      },
      defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
      },
      default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
      },
  },
};

module.exports = {
  entry: './src/index',
  mode: 'development',
  // mode: 'production',
  target: 'web',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  output: {
    publicPath: 'auto',
  },
  optimization: {
    splitChunks: defaultWebpackSplit
    // splitChunks: undefined
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/Widget',
      },
      shared: {
        moment: deps.moment,
        react: {
          requiredVersion: deps.react,
          version: deps.react,
          import: 'react', // the "react" package will be used a provided and fallback module
          shareKey: 'react', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
        'react-dom': {
          requiredVersion: deps['react-dom'],
          version: deps['react-dom'],
          singleton: true, // only a single version of the shared module is allowed
        },
        '@mui/material/': {
          requiredVersion: deps['@mui/material'],
          version: deps['@mui/material'],
          singleton: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // new BundleAnalyzerPlugin({analyzerHost: '127.0.0.1', analyzerPort: 8080})
  ],
};
