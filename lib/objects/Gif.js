"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
require("gifler");
const Gif = fabric_1.fabric.util.createClass(fabric_1.fabric.Object, {
    type: 'gif',
    superType: 'image',
    gifCanvas: null,
    isStarted: false,
    initialize(options) {
        options = options || {};
        this.callSuper('initialize', options);
        this.gifCanvas = document.createElement('canvas');
    },
    drawFrame(ctx, frame) {
        // update canvas size
        this.gifCanvas.width = frame.width;
        this.gifCanvas.height = frame.height;
        // update canvas that we are using for fabric.js
        ctx.drawImage(frame.buffer, -frame.width / 2, -frame.height / 2, frame.width, frame.height);
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        if (!this.isStarted) {
            this.isStarted = true;
            window.gifler('./images/sample/earth.gif')
                .frames(this.gifCanvas, (_c, frame) => {
                this.isStarted = true;
                this.drawFrame(ctx, frame);
            });
        }
    },
});
Gif.fromObject = (options, callback) => {
    return callback(new Gif(options));
};
window.fabric.Gif = Gif;
exports.default = Gif;
