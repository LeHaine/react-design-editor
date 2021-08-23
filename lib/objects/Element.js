"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const utils_1 = require("../utils");
const initialCode = {
    html: '',
    css: '',
    js: '',
};
const Element = fabric_1.fabric.util.createClass(fabric_1.fabric.Rect, {
    type: 'element',
    superType: 'element',
    hasRotatingPoint: false,
    initialize(code = initialCode, options) {
        options = options || {};
        this.callSuper('initialize', options);
        this.set({
            code,
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        });
    },
    setSource(source) {
        this.setCode(source);
    },
    setCode(code = initialCode) {
        this.set({
            code,
        });
        const { css, js, html } = code;
        this.styleEl.innerHTML = css;
        this.scriptEl.innerHTML = js;
        this.element.innerHTML = html;
    },
    toObject(propertiesToInclude) {
        return utils_1.toObject(this, propertiesToInclude, {
            code: this.get('code'),
            container: this.get('container'),
            editable: this.get('editable'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        if (!this.element) {
            const { id, scaleX, scaleY, width, height, angle, editable, code } = this;
            const zoom = this.canvas.getZoom();
            const left = this.calcCoords().tl.x;
            const top = this.calcCoords().tl.y;
            const padLeft = (width * scaleX * zoom - width) / 2;
            const padTop = (height * scaleY * zoom - height) / 2;
            this.element = fabric_1.fabric.util.makeElement('div', {
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
            const { html, css, js } = code;
            this.styleEl = document.createElement('style');
            this.styleEl.id = `${id}_style`;
            this.styleEl.type = 'text/css';
            this.styleEl.innerHTML = css;
            document.head.appendChild(this.styleEl);
            this.scriptEl = document.createElement('script');
            this.scriptEl.id = `${id}_script`;
            this.scriptEl.type = 'text/javascript';
            this.scriptEl.innerHTML = js;
            document.head.appendChild(this.scriptEl);
            const container = document.getElementById(this.container);
            container.appendChild(this.element);
            this.element.innerHTML = html;
        }
    },
});
Element.fromObject = (options, callback) => {
    return callback(new Element(options.code, options));
};
window.fabric.Element = Element;
exports.default = Element;
