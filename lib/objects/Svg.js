"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const utils_1 = require("../utils");
const Svg = fabric_1.fabric.util.createClass(fabric_1.fabric.Group, {
    type: 'svg',
    initialize(option = {}) {
        const { svg, loadType } = option;
        this.callSuper('initialize', [], option);
        this.loadSvg(svg, loadType);
    },
    addSvgElements(objects, options, path) {
        const createdObj = fabric_1.fabric.util.groupSVGElements(objects, options, path);
        this.set(options);
        if (createdObj.getObjects) {
            createdObj.getObjects().forEach(obj => this.add(obj));
        }
        else {
            createdObj.set({
                originX: 'center',
                originY: 'center',
            });
            this.add(createdObj);
        }
        this.setCoords();
        if (this.canvas) {
            this.canvas.requestRenderAll();
        }
    },
    loadSvg(svg, loadType) {
        return new Promise(resolve => {
            if (loadType === 'svg') {
                fabric_1.fabric.loadSVGFromString(svg, (objects, options) => {
                    resolve(this.addSvgElements(objects, options, svg));
                });
            }
            else {
                fabric_1.fabric.loadSVGFromURL(svg, (objects, options) => {
                    resolve(this.addSvgElements(objects, options, svg));
                });
            }
        });
    },
    toObject(propertiesToInclude) {
        return utils_1.toObject(this, propertiesToInclude, {
            svg: this.get('svg'),
            loadType: this.get('loadType'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
    },
});
Svg.fromObject = (option, callback) => {
    return callback(new Svg(option));
};
// @ts-ignore
window.fabric.Svg = Svg;
exports.default = Svg;
