var ctx = require('./index');
var assert = require('assert');

var _ctx = ctx({
    pkg: {
        crossbow: {
            config: {
                html: {
                    index: 'test/fixtures/index.html'
                },
                sass: {
                    root: {
                        sass: {
                            input: 'test/awyeah'
                        }
                    }
                }
            }
        }
    }
});

assert(_ctx.path.make('sass.root.sass.input').indexOf('test/awyeah') > -1);
assert(_ctx.file.read('html.index').indexOf('<html') > -1);
assert(typeof _ctx.mkdirp.sync === 'function');
