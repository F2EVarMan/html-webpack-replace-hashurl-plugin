/**
 * 替换html中静态资源的url
 */
'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
// 默认配置
// mainFilePrefix: 文件名前缀，用来正则匹配待替换文件名
// vendor：如果需要插入vendor文件请务必配置此项，value是需插入的文件名，与webpack配置保持一致
var DEFAULT_OPTIONS = {
    mainFilePrefix: {
        js: 'main',
        css: 'main'
    },
    vendor: 'vendor.js'
};

var HtmlWebpackReplaceurlPlugin = function (options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
}

HtmlWebpackReplaceurlPlugin.prototype.apply = function (compiler) {
    var _this = this;
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
            _this.replaceUrl(compilation, htmlPluginData.plugin.options, htmlPluginData, callback);
        });
    });
}

HtmlWebpackReplaceurlPlugin.prototype.replaceUrl = function (compilation, htmlWebpackPluginOptions, htmlPluginData,
    callback) {
    var _this = this;
    var REG_JS_FILENAME = new RegExp('.*' + this.options.mainFilePrefix.js + '.js.*');
    var REG_CSS_FILENAME = new RegExp(_this.options.mainFilePrefix.css + '[\\.\\w-]+\\.css');

    var _html = htmlPluginData.html;
    var _assets = htmlPluginData.assets;
    var _chunks = Object.keys(_assets.chunks);

    // 替换js url
    for (var i = 0, len = _assets.js.length; i < len; i++) {
        var jsFile = _assets.js[i];
        var _filename = _.takeRight(jsFile.split('/'))[0];
        var _regJsSrc = null;

        if (REG_JS_FILENAME.test(jsFile)) {
            var _originName = '';
            console.log(_.indexOf(_chunks, _filename.split(/\.js$/)[0]))

            if (_.indexOf(_chunks, _filename.split(/\.js$/)[0]) !== -1) {
                _originName = _filename;
            } else {
                _originName = _filename.split(/\.[a-z0-9]+\.js$/.exec(_filename))[0] + '\.\\S*\.js';
            }
            _originName = _originName.substring(0, _originName.indexOf('?'))
            _regJsSrc = new RegExp('src\\s?=\\s?(\'|\")' + '[\.A-Za-z0-9_\/]*' + _originName.split('.').join('\\.') + '.*(\'|\")', 'g');
        }
        console.log("这是正则")

        console.log(_regJsSrc)
        console.log('src = \"' + jsFile + '\"')
        _html = _html.replace(_regJsSrc, 'src = \"' + jsFile + '\"');
    }

    htmlPluginData.html = _html;

    callback(null, htmlPluginData);
}

module.exports = HtmlWebpackReplaceurlPlugin;
