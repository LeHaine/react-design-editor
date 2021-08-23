"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
class ZoomHandler {
    constructor(handler) {
        /**
         * Zoom to point
         *
         * @param {fabric.Point} point
         * @param {number} zoom ex) 0 ~ 1. Not percentage value.
         */
        this.zoomToPoint = (point, zoom) => {
            const { minZoom, maxZoom } = this.handler;
            let zoomRatio = zoom;
            if (zoom <= minZoom / 100) {
                zoomRatio = minZoom / 100;
            }
            else if (zoom >= maxZoom / 100) {
                zoomRatio = maxZoom / 100;
            }
            this.handler.canvas.zoomToPoint(point, zoomRatio);
            this.handler.getObjects().forEach(obj => {
                if (obj.superType === 'element') {
                    const { id, width, height, player } = obj;
                    const el = this.handler.elementHandler.findById(id);
                    // update the element
                    this.handler.elementHandler.setScaleOrAngle(el, obj);
                    this.handler.elementHandler.setSize(el, obj);
                    this.handler.elementHandler.setPosition(el, obj);
                    if (player) {
                        player.setPlayerSize(width, height);
                    }
                }
            });
            if (this.handler.onZoom) {
                this.handler.onZoom(zoomRatio);
            }
            this.handler.canvas.requestRenderAll();
        };
        /**
         * Zoom one to one
         *
         */
        this.zoomOneToOne = () => {
            const center = this.handler.canvas.getCenter();
            this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            this.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), 1);
        };
        /**
         * Zoom to fit
         *
         */
        this.zoomToFit = () => {
            let scaleX = this.handler.canvas.getWidth() / this.handler.workarea.width;
            const scaleY = this.handler.canvas.getHeight() / this.handler.workarea.height;
            if (this.handler.workarea.height >= this.handler.workarea.width) {
                scaleX = scaleY;
                if (this.handler.canvas.getWidth() < this.handler.workarea.width * scaleX) {
                    scaleX = scaleX * (this.handler.canvas.getWidth() / (this.handler.workarea.width * scaleX));
                }
            }
            else {
                if (this.handler.canvas.getHeight() < this.handler.workarea.height * scaleX) {
                    scaleX = scaleX * (this.handler.canvas.getHeight() / (this.handler.workarea.height * scaleX));
                }
            }
            const center = this.handler.canvas.getCenter();
            this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            this.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), scaleX);
        };
        /**
         * Zoom in
         *
         */
        this.zoomIn = () => {
            let zoomRatio = this.handler.canvas.getZoom();
            zoomRatio += 0.05;
            const center = this.handler.canvas.getCenter();
            this.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), zoomRatio);
        };
        /**
         * Zoom out
         *
         */
        this.zoomOut = () => {
            let zoomRatio = this.handler.canvas.getZoom();
            zoomRatio -= 0.05;
            const center = this.handler.canvas.getCenter();
            this.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), zoomRatio);
        };
        /**
         * Zoom to center with object
         *
         * @param {FabricObject} target If zoomFit true, rescaled canvas zoom.
         */
        this.zoomToCenterWithObject = (target, zoomFit) => {
            const { left: canvasLeft, top: canvasTop } = this.handler.canvas.getCenter();
            const { left, top, width, height } = target;
            const diffTop = canvasTop - (top + height / 2);
            const diffLeft = canvasLeft - (left + width / 2);
            if (zoomFit) {
                let scaleX;
                let scaleY;
                scaleX = this.handler.canvas.getWidth() / width;
                scaleY = this.handler.canvas.getHeight() / height;
                if (height > width) {
                    scaleX = scaleY;
                    if (this.handler.canvas.getWidth() < width * scaleX) {
                        scaleX = scaleX * (this.handler.canvas.getWidth() / (width * scaleX));
                    }
                }
                else {
                    scaleY = scaleX;
                    if (this.handler.canvas.getHeight() < height * scaleX) {
                        scaleX = scaleX * (this.handler.canvas.getHeight() / (height * scaleX));
                    }
                }
                this.handler.canvas.setViewportTransform([1, 0, 0, 1, diffLeft, diffTop]);
                this.zoomToPoint(new fabric_1.fabric.Point(canvasLeft, canvasTop), scaleX);
            }
            else {
                const zoom = this.handler.canvas.getZoom();
                this.handler.canvas.setViewportTransform([1, 0, 0, 1, diffLeft, diffTop]);
                this.zoomToPoint(new fabric_1.fabric.Point(canvasLeft, canvasTop), zoom);
            }
        };
        /**
         * Zoom to center with objects
         *
         * @param {boolean} [zoomFit] If zoomFit true, rescaled canvas zoom.
         * @returns
         */
        this.zoomToCenter = (zoomFit) => {
            const activeObject = this.handler.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            this.zoomToCenterWithObject(activeObject, zoomFit);
        };
        this.handler = handler;
    }
}
exports.default = ZoomHandler;
