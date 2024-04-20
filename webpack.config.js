const path = require('path');
const address = require('address');

const ip_adress = address.ip(); // your ip for convenient test on mobile

const commonConfig = {
	entry: ['./js/index.js'],

	resolve: {
		extensions: ['.js'],
	},

	externals: {
		anime: 'anime',
	},
};

const devConfig = {
	...commonConfig,

	name: 'development',

	mode: 'development',

	output: {
		path: path.join(__dirname, '/dist/'),
		filename: 'app.js',
	},

	devServer: {
		static: path.join(__dirname, '/dist/'),
		host: ip_adress,
		compress: true,
		port: 9004,
		open: {
			app: {
				name: 'Chrome',
			},
		},
	},

	devtool: 'source-map',
};

const prodConfig = {
	...commonConfig,

	name: 'production',

	mode: 'production',

	output: {
		path: path.join(__dirname, '/dist/'),
		filename: 'app.js',
		publicPath: './',
	},

	optimization: {
		minimize: true,
	},
};

module.exports = [devConfig, prodConfig];
