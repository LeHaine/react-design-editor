"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const throttle_1 = __importDefault(require("lodash/throttle"));
class TransactionHandler {
    constructor(handler) {
        this.active = false;
        this.state = [];
        /**
         * Initialize transaction handler
         *
         */
        this.initialize = () => {
            this.redos = [];
            this.undos = [];
            this.state = [];
            this.active = false;
        };
        /**
         * Save transaction
         *
         * @param {TransactionType} type
         * @param {*} [canvasJSON]
         * @param {boolean} [isWorkarea=true]
         */
        this.save = (type, canvasJSON, _isWorkarea = true) => {
            if (!this.handler.keyEvent.transaction) {
                return;
            }
            try {
                if (this.state) {
                    const json = JSON.stringify(this.state);
                    this.redos = [];
                    this.undos.push({
                        type,
                        json,
                    });
                }
                const { objects } = canvasJSON || this.handler.canvas.toJSON(this.handler.propertiesToInclude);
                this.state = objects.filter(obj => {
                    if (obj.id === 'workarea') {
                        return false;
                    }
                    else if (obj.id === 'grid') {
                        return false;
                    }
                    else if (obj.superType === 'port') {
                        return false;
                    }
                    return true;
                });
            }
            catch (error) {
                console.error(error);
            }
        };
        this.updateState = (canvasJSON) => {
            const { objects } = canvasJSON || this.handler.canvas.toJSON(this.handler.propertiesToInclude);
            this.state = objects.filter(obj => {
                if (obj.id === 'workarea') {
                    return false;
                }
                else if (obj.id === 'grid') {
                    return false;
                }
                else if (obj.superType === 'port') {
                    return false;
                }
                return true;
            });
        };
        /**
         * Undo transaction
         *
         */
        this.undo = throttle_1.default(() => {
            const undo = this.undos.pop();
            if (!undo) {
                return;
            }
            this.redos.push({
                type: 'redo',
                json: JSON.stringify(this.state),
            });
            this.replay(undo);
        }, 100);
        /**
         * Redo transaction
         *
         */
        this.redo = throttle_1.default(() => {
            const redo = this.redos.pop();
            if (!redo) {
                return;
            }
            this.undos.push({
                type: 'undo',
                json: JSON.stringify(this.state),
            });
            this.replay(redo);
        }, 100);
        /**
         * Replay transaction
         *
         * @param {TransactionEvent} transaction
         */
        this.replay = (transaction) => {
            const objects = JSON.parse(transaction.json);
            this.state = objects;
            this.active = true;
            this.handler.canvas.renderOnAddRemove = false;
            this.handler.clear();
            this.handler.canvas.discardActiveObject();
            fabric_1.fabric.util.enlivenObjects(objects, (enlivenObjects) => {
                enlivenObjects.forEach(obj => {
                    const targetIndex = this.handler.canvas._objects.length;
                    if (obj.superType === 'node') {
                        this.handler.canvas.insertAt(obj, targetIndex, false);
                        this.handler.portHandler.create(obj);
                    }
                    else if (obj.superType === 'link') {
                        const link = obj;
                        this.handler.objects = this.handler.getObjects();
                        this.handler.linkHandler.create({
                            type: 'curvedLink',
                            fromNodeId: link.fromNode?.id,
                            fromPortId: link.fromPort?.id,
                            toNodeId: link.toNode?.id,
                            toPortId: link.toPort?.id,
                        });
                    }
                    else {
                        this.handler.canvas.insertAt(obj, targetIndex, false);
                    }
                });
                this.handler.canvas.renderOnAddRemove = true;
                this.active = false;
                this.handler.canvas.renderAll();
                this.handler.objects = this.handler.getObjects();
                if (this.handler.onTransaction) {
                    this.handler.onTransaction(transaction);
                }
            }, null);
        };
        this.handler = handler;
        if (this.handler.editable) {
            this.initialize();
        }
    }
}
exports.default = TransactionHandler;
