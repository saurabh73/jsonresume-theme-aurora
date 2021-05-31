const path = require("path");
module.exports = require('./webpack.config-helper')({
	isProduction: false,
	devtool: 'cheap-eval-source-map',
	devServer: {
		contentBase: path.join(__dirname, "src"),
		publicPath: '/assets/'
	},
	port: 8081
});
