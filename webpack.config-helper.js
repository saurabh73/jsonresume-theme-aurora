"use strict";

const Path = require("path");
const Webpack = require("webpack");
const Glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractSASS = new ExtractTextPlugin("./[name].[hash].css");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackInlineStylePlugin = require('html-webpack-inline-style-plugin');

const PATHS = {
	src: Path.join(__dirname, "src"),
	dest: Path.join(__dirname, "public")
};


module.exports = (options) => {

	let webpackConfig = {
		devtool: options.devtool,
		entry: [Path.join(PATHS.src, "scripts", "script.js")],
		output: {
			path: PATHS.dest,
			filename: "./scripts/[name].[hash].js"
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/resume.hbs',
				filename: "index.html",
				templateParameters:require('./resume.json')
			}),
			new CopyWebpackPlugin([
				{
					from: Path.join(PATHS.src, "assets"),
					to: "./assets"
				},
				{
					from: Path.join(PATHS.src, "favicon.ico"),
					to: "./"
				}
			]),
			new Webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify(options.isProduction ? "production" : "development")
				}
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
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: [/images/],
				use: [{
					loader: "file-loader",
					options: {
						name: "[name].[ext]",
						outputPath: "./assets/fonts"
					}
				}]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				loader: "file-loader",
				exclude: [/fonts/],
				options: {
					name: "[name].[ext]",
					outputPath: "./assets/images"
				}
			},
			{
				test: /\.(ico)$/,
				loader: "file-loader",
				exclude: [/fonts/],
				options: {
					name: "[name].[ext]",
					outputPath: "./"
				}
			}
			]
		}
	};

	// Production Only
	if (options.isProduction) {
		webpackConfig.plugins.push(
			ExtractSASS,
			new PurgecssPlugin({
				paths: Glob.sync(`${PATHS.src}/**/*`, {
					nodir: true
				})
			})
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
