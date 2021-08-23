"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const Port = fabric_1.fabric.util.createClass(fabric_1.fabric.Rect, {
    type: 'port',
    superType: 'port',
    initialize(options) {
        options = options || {};
        this.callSuper('initialize', options);
    },
    toObject() {
        return fabric_1.fabric.util.object.extend(this.callSuper('toObject'), {
            id: this.get('id'),
            superType: this.get('superType'),
            enabled: this.get('enabled'),
            nodeId: this.get('nodeId'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
    },
});
Port.fromObject = (options, callback) => {
    return callback(new Port(options));
};
// @ts-ignore
window.fabric.Port = Port;
exports.default = Port;
