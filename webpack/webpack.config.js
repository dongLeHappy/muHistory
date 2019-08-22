const path = require('path');

module.exports = {
    mode: 'development',
    entry:"./src/index.js",
    output: {
        // 可以加个hash
        // filename: "[hash:8]-bundle.js",
        filename: "bundle.js",
        path: path.join(__dirname,'dist')
    }
}