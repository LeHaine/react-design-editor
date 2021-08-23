"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const uuid_1 = require("uuid");
const Node_1 = require("./Node");
const Link = fabric_1.fabric.util.createClass(fabric_1.fabric.Line, {
    type: 'link',
    superType: 'link',
    initialize(fromNode, fromPort, toNode, toPort, options) {
        options = options || {};
        const coords = [fromPort.left, fromPort.top, toPort.left, toPort.top];
        this.callSuper('initialize', coords, options);
        this.set({
            strokeWidth: 4,
            id: options.id || uuid_1.v4(),
            originX: 'center',
            originY: 'center',
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasRotatingPoint: false,
            hasControls: false,
            hasBorders: false,
            perPixelTargetFind: true,
            lockMovementX: true,
            lockMovementY: true,
            selectable: false,
            fromNode,
            fromPort,
            toNode,
            toPort,
        });
    },
    setPort(fromNode, fromPort, _toNode, toPort) {
        if (fromNode.type === 'BroadcastNode') {
            fromPort = fromNode.fromPort[0];
        }
        fromPort.links.push(this);
        toPort.links.push(this);
        this.setPortEnabled(fromNode, fromPort, false);
    },
    setPortEnabled(node, port, enabled) {
        if (node.descriptor.outPortType !== Node_1.OUT_PORT_TYPE.BROADCAST) {
            port.set({
                enabled,
                fill: enabled ? port.originFill : port.selectFill,
            });
        }
        else {
            if (node.toPort.id === port.id) {
                return;
            }
            port.links.forEach((link, index) => {
                link.set({
                    fromPort: port,
                    fromPortIndex: index,
                });
            });
            node.set({
                configuration: {
                    outputCount: port.links.length,
                },
            });
        }
    },
    toObject() {
        return fabric_1.fabric.util.object.extend(this.callSuper('toObject'), {
            id: this.get('id'),
            name: this.get('name'),
            superType: this.get('superType'),
            configuration: this.get('configuration'),
            fromNode: this.get('fromNode'),
            fromPort: this.get('fromPort'),
            toNode: this.get('toNode'),
            toPort: this.get('toPort'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        ctx.save();
        const xDiff = this.x2 - this.x1;
        const yDiff = this.y2 - this.y1;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);
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
Link.fromObject = (options, callback) => {
    const { fromNode, fromPort, toNode, toPort } = options;
    return callback(new Link(fromNode, fromPort, toNode, toPort, options));
};
window.fabric.Link = Link;
exports.default = Link;
