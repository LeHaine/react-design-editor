"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const Link_1 = __importDefault(require("./Link"));
const OrthogonalLink = fabric_1.fabric.util.createClass(Link_1.default, {
    type: 'OrthogonalLink',
    superType: 'link',
    initialize(fromNode, fromPort, toNode, toPort, options) {
        options = options || {};
        this.callSuper('initialize', fromNode, fromPort, toNode, toPort, options);
    },
    _render(ctx) {
        // Drawing orthogonal link
        const { x1, y1, x2, y2 } = this;
        ctx.strokeStyle = this.stroke;
        const fp = { x: (x1 - x2) / 2, y: (y1 - y2) / 2 };
        const sp = { x: (x2 - x1) / 2, y: (y2 - y1) / 2 };
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(fp.x, fp.y);
        ctx.lineTo(fp.x, sp.y / 2);
        ctx.lineTo(sp.x, sp.y / 2);
        ctx.lineTo(sp.x, sp.y);
        ctx.stroke();
        ctx.save();
        const xDiff = this.x2 - this.x1;
        const yDiff = this.y2 - this.y1;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
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
OrthogonalLink.fromObject = (options, callback) => {
    const { fromNode, fromPort, toNode, toPort } = options;
    return callback(new OrthogonalLink(fromNode, fromPort, toNode, toPort, options));
};
window.fabric.OrthogonalLink = OrthogonalLink;
exports.default = OrthogonalLink;
