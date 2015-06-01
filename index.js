var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var vfs = require('vfs');

module.exports = function (opts) {

    opts = opts || {};
    opts.pkg = opts.pkg || require(path.resolve(process.cwd(), "./package.json"));
    opts.paths = opts.paths || opts.pkg.paths;


    var ctx = {
        vfs: vfs,
        path: {
            make: function (key, type) {
                return path.resolve(opts.paths[key][type]);
            }
        },
        file: {
            write: function (key, type, output) {
                var outpath = ctx.path.make(key, type);
                mkdirp.sync(path.dirname(outpath));
                fs.writeFileSync(outpath, output);
            }
        },
        paths: opts.paths,
        root: process.cwd()
    };

    return ctx;
};