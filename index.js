var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var objPath = require('object-path');
var vfs = require('vinyl-fs');

module.exports = function (opts) {

    opts = opts || {};
    opts.pkg = opts.pkg || require(path.resolve(process.cwd(), "./package.json"));
    opts.config = opts.config || opts.pkg.crossbow.config;

    var options = Object.keys(opts.config).reduce(function (obj, key) {
        if (!obj[key]) {
            obj[key] = opts.config[key].options;
        }

        return obj;
    }, {});


    var optObj = objPath(options);


    var ctx = {
        options: optObj,
        relPath: function (optPath) {
            return path.resolve(optObj.get(optPath));
        },
        vfs: vfs,
        path: {
            make: function (key, type) {
                return path.resolve(opts.config[key][type]);
            }
        },
        file: {
            write: function (key, type, output) {
                var outpath = ctx.path.make(key, type);
                mkdirp.sync(path.dirname(outpath));
                fs.writeFileSync(outpath, output);
            }
        },
        config: opts.config,
        paths: opts.config,
        root: process.cwd()
    };

    return ctx;
};