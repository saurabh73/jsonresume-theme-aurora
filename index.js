const fs = require("fs");
const Path = require('path');

const config = require('./webpack-prod.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const PATHS = {
	src: Path.join(__dirname, "src"),
	dest: Path.join(__dirname, "public")
};


async function runWebpack(compiler) {
  await new Promise((resolve, reject) => {
    compiler.run((err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}

// TODO: return index.html with inline template
async function render(resume) {
  // extract and replace HtmlWebpackPlugin with provided resume
  const plugins = config.plugins.filter(i => (((i instanceof HtmlWebpackPlugin) == false) && ((i instanceof ScriptExtHtmlWebpackPlugin) == false)) && ((i instanceof HTMLInlineCSSWebpackPlugin) == false));
  plugins.push(
    new HtmlWebpackPlugin({
      template: "./src/resume.hbs", 
      filename: "index.html",
      templateParameters: resume
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: [/\.js$/],
    }),
    new HTMLInlineCSSWebpackPlugin()
  );
  config.plugins = plugins;
  const compiler = webpack(config);
  await runWebpack(compiler);
  const filepath = Path.join(PATHS.dest, "index.html")
  return fs.readFileSync(filepath, "utf-8");
}
module.exports = {
  render: render
};