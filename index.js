var fs      = require('fs');
var write   = require('fs').writeFileSync;
var read    = require('fs').readFileSync;
var mkdirp  = require('mkdirp');
var path    = require('path');
var resolve = require('path').resolve;
var dirname = require('path').dirname;
var objPath = require('object-path');
var vfs     = require('vinyl-fs');

module.exports = function (opts) {

    opts = opts || {};
    opts.pkg = opts.pkg || require(resolve(process.cwd(), "./package.json"));
    opts.pkg.crossbow = opts.pkg.crossbow || {};
    opts.config = opts.config || opts.pkg.crossbow.config || {};

    var options = Object.keys(opts.config).reduce(function (obj, key) {
        if (!obj[key]) {
            obj[key] = opts.config[key].options;
        }
        return obj;
    }, {});

    var optObj = objPath(options);

    var ctx = {
        options: optObj,
        vfs: vfs,
        path: {
            /**
             * Look up paths such as sass.root
             * @returns {*}
             */
            make: function () {

                var args   = Array.prototype.slice.call(arguments);
                var lookup = args[0];

                if (!lookup.match(/\./) && !Array.isArray(lookup)) {
                    lookup = args;
                }

                return resolve(objPath.get(opts.config, lookup));
            }
        },
        file: {
            /**
             * Write a file using path lookup
             * @param filepath
             * @param content
             */
            write: function (filepath, content) {
                var outpath = ctx.path.make(filepath);
                mkdirp.sync(dirname(outpath));
                write(outpath, content);
            },
            /**
             * Write a file using path lookup
             * @param filepath
             */
            read: function (filepath) {
                var inpath = ctx.path.make(filepath);
                return read(inpath, 'utf-8');
            }
        },
        config: opts.config,
        paths: opts.config,
        root: process.cwd(),
        crossbow: opts.pkg.crossbow,
        mkdirp: mkdirp,
        trigger: {}
    };

    return ctx;
};