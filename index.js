var fs     = require('fs');
var mkdirp = require('mkdirp');
var path   = require('path');
var pjson  = require(path.resolve(process.cwd(), "./package.json"));
var paths  = pjson.crossbow.paths;

var ctx = {
    path: {
        make: function (key, type) {
            return path.resolve(paths[key][type]);
        }
    },
    file: {
        write: function (key, type, output) {
            var outpath = ctx.path.make(key, type);
            mkdirp.sync(path.dirname(outpath));
            fs.writeFileSync(outpath, output);
        }
    },
    paths: paths,
    root: process.cwd()
};

module.exports = ctx;