// Webpack v4
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const conf = {
	entry: {
		main: './js/app.js',
	},
	output: {
		path: path.resolve(__dirname, './dist/js'),
		filename: 'app.js',
		publicPath: 'dist/js',
	},
	devServer: {
		overlay: true,
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader', // drive js through babel
			},
		}],
	},
	plugins: [
		new CleanWebpackPlugin(['dist']), // clean folder 'dist'
	],

};

module.exports = (env, options) => {
	const production = options.mode === 'production';
	conf.devtool = production ? false : 'eval-sourcemap';
	return conf;
};
