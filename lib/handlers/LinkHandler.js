"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const warning_1 = __importDefault(require("warning"));
const objects_1 = require("../objects");
/**
 * Link Handler Class
 * @author salgum1114
 * @class LinkHandler
 */
class LinkHandler {
    constructor(handler) {
        this.port = null;
        /**
         * On source port click, start link
         * @param {PortObject} port
         */
        this.init = (port) => {
            if (this.isDrawing()) {
                return;
            }
            if (this.isConnected(port)) {
                return;
            }
            this.port = port;
            this.port.set({
                fill: port.selectFill,
            });
            this.handler.interactionHandler.linking();
            const { left, top, nodeId, id } = port;
            const fromPort = { left, top, id };
            const toPort = { left, top };
            const fromNode = this.handler.objectMap[nodeId];
            this.handler.activeLine = new objects_1.CurvedLink(fromNode, fromPort, null, toPort, {
                strokeWidth: 2,
                fill: '#999999',
                stroke: '#999999',
                class: 'line',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.canvas.add(this.handler.activeLine);
        };
        /**
         * End drawing link.
         */
        this.finish = (link) => {
            if (!link) {
                this.port.set({
                    fill: this.port.originFill,
                });
            }
            this.handler.interactionHandler.selection();
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
        };
        /**
         * On dest port click, finish link
         * @param {PortObject} port
         */
        this.generate = (port) => {
            if (!port) {
                warning_1.default(!port, 'Does not exist target port.');
                return;
            }
            if (this.isDuplicate(port)) {
                return;
            }
            if (this.isSameNode(port)) {
                return;
            }
            const link = {
                type: 'curvedLink',
                fromNodeId: this.handler.activeLine.fromNode.id,
                fromPortId: this.handler.activeLine.fromPort.id,
                toNodeId: port.nodeId,
                toPortId: port.id,
            };
            const createdLink = this.create(link);
            this.finish(createdLink);
            // TODO...
            // Save transactions unconditionally
            if (!this.handler.transactionHandler.active) {
                this.handler.transactionHandler.save('add');
            }
        };
        /**
         * Add link in Canvas
         * @param {LinkOption} link
         * @param {boolean} [loaded=false]
         * @returns
         */
        this.create = (link, loaded = false) => {
            const fromNode = this.handler.objectMap[link.fromNodeId];
            const fromPort = fromNode.fromPort.filter(port => port.id === link.fromPortId || !port.id)[0];
            const toNode = this.handler.objectMap[link.toNodeId];
            const { toPort } = toNode;
            const createdObj = this.handler.fabricObjects[link.type].create(fromNode, fromPort, toNode, toPort, {
                ...link,
            });
            this.handler.canvas.add(createdObj);
            this.handler.objects = this.handler.getObjects();
            const { editable } = this.handler;
            if (this.handler.onAdd && editable && !loaded) {
                this.handler.onAdd(createdObj);
            }
            this.handler.canvas.renderAll();
            createdObj.setPort(fromNode, fromPort, toNode, toPort);
            this.handler.portHandler.setCoords(fromNode);
            this.handler.portHandler.setCoords(toNode);
            this.handler.canvas.requestRenderAll();
            return createdObj;
        };
        /**
         * Set coordinate of link
         * @param {number} x1
         * @param {number} y1
         * @param {number} x2
         * @param {number} y2
         * @param {LinkObject} link
         */
        this.setCoords = (x1, y1, x2, y2, link) => {
            link.set({
                x1,
                y1,
                x2,
                y2,
            });
            link.setCoords();
        };
        /**
         * When the link is deleted, linked FromNode delete
         * @param {LinkObject} link
         */
        this.removeFrom = (link) => {
            if (link.fromPort) {
                let index = -1;
                if (link.fromPort.links.length) {
                    link.fromPort.links.some((portLink, i) => {
                        if (link.id === portLink.id) {
                            index = i;
                            return true;
                        }
                        return false;
                    });
                    if (index > -1) {
                        link.fromPort.links.splice(index, 1);
                    }
                }
                link.setPortEnabled(link.fromNode, link.fromPort, true);
            }
        };
        /**
         * When the link is deleted, linked ToNode delete
         * @param {LinkObject} link
         */
        this.removeTo = (link) => {
            if (link.toNode.toPort.links.length) {
                let index = -1;
                link.toNode.toPort.links.some((portLink, i) => {
                    if (link.id === portLink.id) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                if (index > -1) {
                    link.toNode.toPort.links.splice(index, 1);
                }
                link.setPortEnabled(link.toNode, link.toNode.toPort, true);
            }
        };
        /**
         * When the link is deleted, linked node delete
         * @param {LinkObject} link
         */
        this.removeAll = (link) => {
            this.removeFrom(link);
            this.removeTo(link);
        };
        /**
         * Remove link in canvas
         * @param {LinkObject} link
         * @param {string} [type]
         */
        this.remove = (link, type) => {
            if (type === 'from') {
                this.removeFrom(link);
            }
            else if (type === 'to') {
                this.removeTo(link);
            }
            else {
                this.removeAll(link);
            }
            this.handler.canvas.remove(link);
            this.handler.objects = this.handler.getObjects();
        };
        /**
         * Check if there is a port connected
         * @param {PortObject} port
         * @returns
         */
        this.isConnected = (port) => {
            warning_1.default(port.enabled, 'A connected node already exists.');
            return !port.enabled;
        };
        /**
         * Check if select same node
         * @param {PortObject} port
         * @returns
         */
        this.isSameNode = (port) => {
            const validate = port.nodeId === this.handler.activeLine.fromNode.id;
            warning_1.default(!validate, 'Cannot select the same node.');
            return validate;
        };
        /**
         * Check if select same node
         * @param {PortObject} port
         * @returns
         */
        this.isDuplicate = (port) => {
            const validate = port.links.some(link => link.fromNode.id === this.handler.activeLine.fromNode.id);
            warning_1.default(!validate, 'Duplicate connections cannot be made.');
            return validate;
        };
        /**
         * Check if draw the link
         * @returns
         */
        this.isDrawing = () => {
            const validate = this.handler.interactionMode === 'link' && this.handler.activeLine;
            warning_1.default(!validate, 'Already drawing links.');
            return validate;
        };
        this.handler = handler;
    }
}
exports.default = LinkHandler;
