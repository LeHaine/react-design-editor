"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const Path = fabric_1.fabric.util.createClass(fabric_1.fabric.Path, {
    type: 'path',
    superType: 'drawing',
    initialize(path, options) {
        options = options || {};
        this.callSuper('initialize', path, options);
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
    },
});
Path.fromObject = (options, callback) => {
    const { path } = options;
    return callback(new Path(path, options));
};
window.fabric.Path = Path;
exports.default = Path;
