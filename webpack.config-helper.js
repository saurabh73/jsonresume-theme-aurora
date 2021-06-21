"use strict";

const Path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractSASS = new ExtractTextPlugin("./[name].[hash].css");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const PATHS = {
	src: Path.join(__dirname, "src"),
	dest: Path.join(__dirname, "public")
};

module.exports = (options) => {


	let webpackConfig = {
		devtool: options.devtool,
		entry: [Path.join(PATHS.src, "scripts", "script.js")],
		context: __dirname,
		output: {
			path: PATHS.dest,
			filename: "./scripts/[name].[hash].js"
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/resume.hbs',
				filename: "index.html",
				cache: false,
				templateParameters: require('./resume.json')
			}),
			new ScriptExtHtmlWebpackPlugin({
				inline: [/\.js$/],
			}),
			new HTMLInlineCSSWebpackPlugin(),
			new Webpack.EnvironmentPlugin({
					NODE_ENV: options.isProduction ? "production" : "development",
					THEME_NO: options.THEME_NO || process.env.THEME_NO || '0',	
			})
		],
		module: {
			rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.hbs$/,
				loader: "handlebars-loader",
				query: {
					helperDirs: [Path.join(PATHS.src, "helpers")],
					partialDirs: [
						Path.join(PATHS.src, "partials"),
						Path.join(PATHS.src, "components"),
						Path.join(PATHS.src, "pages")
					]
				}
			}
			]
		}
	};

	// Production Only
	if (options.isProduction) {
		webpackConfig.plugins.push(
			ExtractSASS
		);

		webpackConfig.module.rules.push({
			test: /\.scss$/i,
			use: ExtractSASS.extract(["css-loader", "sass-loader"])
		}, {
			test: /\.css$/i,
			use: ExtractSASS.extract(["css-loader"])
		});

	} else {
		webpackConfig.plugins.push(
			new Webpack.HotModuleReplacementPlugin()
		);

		webpackConfig.module.rules.push({
			test: /\.scss$/i,
			use: ["style-loader?sourceMap", "css-loader?sourceMap", "sass-loader?sourceMap"]
		}, {
			test: /\.css$/i,
			use: ["style-loader", "css-loader"]
		}, {
			test: /\.js$/,
			use: "eslint-loader",
			exclude: /node_modules/
		});

		webpackConfig.devServer = {
			port: options.port,
			contentBase: PATHS.dest,
			historyApiFallback: true,
			compress: options.isProduction,
			inline: !options.isProduction,
			hot: !options.isProduction,
			watchContentBase: !options.isProduction,
			stats: {
				chunks: false
			}
		};
	}
	return webpackConfig;
};
