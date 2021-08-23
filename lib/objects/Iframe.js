"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const utils_1 = require("../utils");
const Iframe = fabric_1.fabric.util.createClass(fabric_1.fabric.Rect, {
    type: 'iframe',
    superType: 'element',
    hasRotatingPoint: false,
    initialize(src = '', options) {
        options = options || {};
        this.callSuper('initialize', options);
        this.set({
            src,
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        });
    },
    setSource(source) {
        this.setSrc(source);
    },
    setSrc(src) {
        this.set({
            src,
        });
        this.iframeElement.src = src;
    },
    toObject(propertiesToInclude) {
        return utils_1.toObject(this, propertiesToInclude, {
            src: this.get('src'),
            container: this.get('container'),
            editable: this.get('editable'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        if (!this.element) {
            const { id, scaleX, scaleY, width, height, angle, editable, src } = this;
            const zoom = this.canvas.getZoom();
            const left = this.calcCoords().tl.x;
            const top = this.calcCoords().tl.y;
            const padLeft = (width * scaleX * zoom - width) / 2;
            const padTop = (height * scaleY * zoom - height) / 2;
            this.iframeElement = fabric_1.fabric.util.makeElement('iframe', {
                id,
                src,
                width: '100%',
                height: '100%',
            });
            this.element = fabric_1.fabric.util.wrapElement(this.iframeElement, 'div', {
                id: `${id}_container`,
                style: `transform: rotate(${angle}deg) scale(${scaleX * zoom}, ${scaleY * zoom});
                        width: ${width}px;
                        height: ${height}px;
                        left: ${left + padLeft}px;
                        top: ${top + padTop}px;
                        position: absolute;
                        user-select: ${editable ? 'none' : 'auto'};
                        pointer-events: ${editable ? 'none' : 'auto'};`,
            });
            const container = document.getElementById(this.container);
            container.appendChild(this.element);
        }
    },
});
Iframe.fromObject = (options, callback) => {
    return callback(new Iframe(options.src, options));
};
window.fabric.Iframe = Iframe;
exports.default = Iframe;
