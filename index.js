const fs = require("fs");
const path = require('path');

const config = require('./webpack-prod.config.js');
const webpack = require('webpack');

const compiler = webpack(config);

async function runWebpack() {
  await new Promise((resolve, reject) => {
    compiler.run((err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}

async function render(resume) {
  await runWebpack();
  const filepath = path.join(__dirname, "public", "index.html")
  return fs.readFileSync(filepath, "utf-8");
}
module.exports = {
	render: render
};