"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const Link_1 = __importDefault(require("./Link"));
const CurvedLink = fabric_1.fabric.util.createClass(Link_1.default, {
    type: 'curvedLink',
    superType: 'link',
    initialize(fromNode, fromPort, toNode, toPort, options) {
        options = options || {};
        this.callSuper('initialize', fromNode, fromPort, toNode, toPort, options);
    },
    _render(ctx) {
        // Drawing curved link
        const { x1, y1, x2, y2 } = this;
        ctx.strokeStyle = this.stroke;
        const fp = { x: (x1 - x2) / 2, y: (y1 - y2) / 2 };
        const sp = { x: (x2 - x1) / 2, y: (y2 - y1) / 2 };
        ctx.beginPath();
        ctx.moveTo(fp.x, fp.y);
        ctx.bezierCurveTo(fp.x, sp.y, sp.x, fp.y, sp.x, sp.y);
        ctx.stroke();
        ctx.save();
        const xDiff = x2 - x1;
        const yDiff = y2 - y1;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate((x2 - x1) / 2, (y2 - y1) / 2);
        ctx.rotate(angle >= 0 ? 1.57 : -1.57);
        ctx.beginPath();
        if (this.arrow) {
            // Move 5px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
            ctx.moveTo(5, 0);
            ctx.lineTo(-5, 5);
            ctx.lineTo(-5, -5);
        }
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();
        ctx.restore();
    },
});
CurvedLink.fromObject = (options, callback) => {
    const { fromNode, fromPort, toNode, toPort } = options;
    return callback(new CurvedLink(fromNode, fromPort, toNode, toPort, options));
};
window.fabric.CurvedLink = CurvedLink;
exports.default = CurvedLink;
