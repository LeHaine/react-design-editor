"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
class GuidelineHandler {
    constructor(handler) {
        this.aligningLineOffset = 5;
        this.aligningLineMargin = 4;
        this.aligningLineWidth = 1;
        this.aligningLineColor = 'rgb(255, 0, 0)';
        this.zoom = 1;
        /**
         * Before the render
         *
         * @param {FabricEvent} _opt
         */
        this.beforeRender = (_opt) => {
            this.handler.canvas.clearContext(this.handler.guidelineHandler.ctx);
        };
        /**
         * After the render
         *
         * @param {FabricEvent} _opt
         */
        this.afterRender = (_opt) => {
            for (let i = this.handler.guidelineHandler.verticalLines.length; i--;) {
                this.handler.guidelineHandler.drawVerticalLine(this.handler.guidelineHandler.verticalLines[i]);
            }
            for (let i = this.handler.guidelineHandler.horizontalLines.length; i--;) {
                this.handler.guidelineHandler.drawHorizontalLine(this.handler.guidelineHandler.horizontalLines[i]);
            }
            this.handler.guidelineHandler.verticalLines.length = 0;
            this.handler.guidelineHandler.horizontalLines.length = 0;
        };
        this.drawVerticalLine = (coords) => {
            this.drawLine(coords.x + 0.5, coords.y1 > coords.y2 ? coords.y2 : coords.y1, coords.x + 0.5, coords.y2 > coords.y1 ? coords.y2 : coords.y1);
        };
        this.drawHorizontalLine = (coords) => {
            this.drawLine(coords.x1 > coords.x2 ? coords.x2 : coords.x1, coords.y + 0.5, coords.x2 > coords.x1 ? coords.x2 : coords.x1, coords.y + 0.5);
        };
        this.drawLine = (x1, y1, x2, y2) => {
            const { ctx, aligningLineWidth, aligningLineColor, viewportTransform, zoom } = this;
            ctx.save();
            ctx.lineWidth = aligningLineWidth;
            ctx.strokeStyle = aligningLineColor;
            ctx.beginPath();
            ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5]);
            ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5]);
            ctx.stroke();
            ctx.restore();
        };
        this.isInRange = (v1, v2) => {
            const { aligningLineMargin } = this;
            v1 = Math.round(v1);
            v2 = Math.round(v2);
            for (let i = v1 - aligningLineMargin, len = v1 + aligningLineMargin; i <= len; i++) {
                if (i === v2) {
                    return true;
                }
            }
            return false;
        };
        this.movingGuidelines = (target) => {
            const canvasObjects = this.handler.canvas.getObjects();
            const activeObjectCenter = target.getCenterPoint();
            const activeObjectLeft = activeObjectCenter.x;
            const activeObjectTop = activeObjectCenter.y;
            const activeObjectBoundingRect = target.getBoundingRect();
            const activeObjectHeight = activeObjectBoundingRect.height / this.viewportTransform[3];
            const activeObjectWidth = activeObjectBoundingRect.width / this.viewportTransform[0];
            let horizontalInTheRange = false;
            let verticalInTheRange = false;
            const { _currentTransform: transform } = this.handler.canvas;
            if (!transform) {
                return;
            }
            // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
            // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move
            for (let i = canvasObjects.length; i--;) {
                if (canvasObjects[i] === target ||
                    canvasObjects[i].superType === 'port' ||
                    canvasObjects[i].superType === 'link' ||
                    !canvasObjects[i].evented) {
                    continue;
                }
                const objectCenter = canvasObjects[i].getCenterPoint();
                const objectLeft = objectCenter.x;
                const objectTop = objectCenter.y;
                const objectBoundingRect = canvasObjects[i].getBoundingRect();
                const objectHeight = objectBoundingRect.height / this.viewportTransform[3];
                const objectWidth = objectBoundingRect.width / this.viewportTransform[0];
                // snap by the horizontal center line
                if (this.isInRange(objectLeft, activeObjectLeft)) {
                    verticalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const y1 = -5000;
                        const y2 = 5000;
                        this.verticalLines.push({
                            x: objectLeft,
                            y1,
                            y2,
                        });
                    }
                    else {
                        this.verticalLines.push({
                            x: objectLeft,
                            y1: objectTop < activeObjectTop
                                ? objectTop - objectHeight / 2 - this.aligningLineOffset
                                : objectTop + objectHeight / 2 + this.aligningLineOffset,
                            y2: activeObjectTop > objectTop
                                ? activeObjectTop + activeObjectHeight / 2 + this.aligningLineOffset
                                : activeObjectTop - activeObjectHeight / 2 - this.aligningLineOffset,
                        });
                    }
                    target.setPositionByOrigin(new fabric_1.fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
                }
                // snap by the left edge
                if (this.isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                    verticalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const workarea = canvasObjects[i];
                        const y1 = -5000;
                        const y2 = 5000;
                        let x = objectLeft - objectWidth / 2;
                        if (workarea.layout === 'fullscreen') {
                            x = 0;
                        }
                        this.verticalLines.push({
                            x,
                            y1,
                            y2,
                        });
                    }
                    else {
                        this.verticalLines.push({
                            x: objectLeft - objectWidth / 2,
                            y1: objectTop < activeObjectTop
                                ? objectTop - objectHeight / 2 - this.aligningLineOffset
                                : objectTop + objectHeight / 2 + this.aligningLineOffset,
                            y2: activeObjectTop > objectTop
                                ? activeObjectTop + activeObjectHeight / 2 + this.aligningLineOffset
                                : activeObjectTop - activeObjectHeight / 2 - this.aligningLineOffset,
                        });
                    }
                    target.setPositionByOrigin(new fabric_1.fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
                }
                // snap by the right edge
                if (this.isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                    verticalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const workarea = canvasObjects[i];
                        const y1 = -5000;
                        const y2 = 5000;
                        let x = objectLeft + objectWidth / 2;
                        if (workarea.layout === 'fullscreen') {
                            x = this.handler.canvas.getWidth();
                        }
                        this.verticalLines.push({
                            x,
                            y1,
                            y2,
                        });
                    }
                    else {
                        this.verticalLines.push({
                            x: objectLeft + objectWidth / 2,
                            y1: objectTop < activeObjectTop
                                ? objectTop - objectHeight / 2 - this.aligningLineOffset
                                : objectTop + objectHeight / 2 + this.aligningLineOffset,
                            y2: activeObjectTop > objectTop
                                ? activeObjectTop + activeObjectHeight / 2 + this.aligningLineOffset
                                : activeObjectTop - activeObjectHeight / 2 - this.aligningLineOffset,
                        });
                    }
                    target.setPositionByOrigin(new fabric_1.fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
                }
                // snap by the vertical center line
                if (this.isInRange(objectTop, activeObjectTop)) {
                    horizontalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const x1 = -5000;
                        const x2 = 5000;
                        this.horizontalLines.push({
                            y: objectTop,
                            x1,
                            x2,
                        });
                    }
                    else {
                        this.horizontalLines.push({
                            y: objectTop,
                            x1: objectLeft < activeObjectLeft
                                ? objectLeft - objectWidth / 2 - this.aligningLineOffset
                                : objectLeft + objectWidth / 2 + this.aligningLineOffset,
                            x2: activeObjectLeft > objectLeft
                                ? activeObjectLeft + activeObjectWidth / 2 + this.aligningLineOffset
                                : activeObjectLeft - activeObjectWidth / 2 - this.aligningLineOffset,
                        });
                    }
                    target.setPositionByOrigin(new fabric_1.fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
                }
                // snap by the top edge
                if (this.isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                    horizontalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const workarea = canvasObjects[i];
                        const x1 = -5000;
                        const x2 = 5000;
                        let y = objectTop - objectHeight / 2;
                        if (workarea.layout === 'fullscreen') {
                            y = 0;
                        }
                        this.horizontalLines.push({
                            y,
                            x1,
                            x2,
                        });
                    }
                    else {
                        this.horizontalLines.push({
                            y: objectTop - objectHeight / 2,
                            x1: objectLeft < activeObjectLeft
                                ? objectLeft - objectWidth / 2 - this.aligningLineOffset
                                : objectLeft + objectWidth / 2 + this.aligningLineOffset,
                            x2: activeObjectLeft > objectLeft
                                ? activeObjectLeft + activeObjectWidth / 2 + this.aligningLineOffset
                                : activeObjectLeft - activeObjectWidth / 2 - this.aligningLineOffset,
                        });
                    }
                    target.setPositionByOrigin(new fabric_1.fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
                }
                // snap by the bottom edge
                if (this.isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                    horizontalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const workarea = canvasObjects[i];
                        const x1 = -5000;
                        const x2 = 5000;
                        let y = objectTop + objectHeight / 2;
                        if (workarea.layout === 'fullscreen') {
                            y = this.handler.canvas.getHeight();
                        }
                        this.horizontalLines.push({
                            y,
                            x1,
                            x2,
                        });
                    }
                    else {
                        this.horizontalLines.push({
                            y: objectTop + objectHeight / 2,
                            x1: objectLeft < activeObjectLeft
                                ? objectLeft - objectWidth / 2 - this.aligningLineOffset
                                : objectLeft + objectWidth / 2 + this.aligningLineOffset,
                            x2: activeObjectLeft > objectLeft
                                ? activeObjectLeft + activeObjectWidth / 2 + this.aligningLineOffset
                                : activeObjectLeft - activeObjectWidth / 2 - this.aligningLineOffset,
                        });
                    }
                    target.setPositionByOrigin(new fabric_1.fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
                }
            }
            if (!horizontalInTheRange) {
                this.horizontalLines.length = 0;
            }
            if (!verticalInTheRange) {
                this.verticalLines.length = 0;
            }
        };
        this.scalingGuidelines = (_target) => {
            // TODO... object scaling guideline
        };
        this.handler = handler;
        this.initialize();
    }
    /**
     * Initialize guideline handler
     *
     */
    initialize() {
        if (this.handler.guidelineOption.enabled) {
            this.handler.canvas.on({
                'before:render': this.beforeRender,
                'after:render': this.afterRender,
            });
        }
        else {
            this.handler.canvas.off({
                'before:render': this.beforeRender,
                'after:render': this.afterRender,
            });
        }
        this.ctx = this.handler.canvas.getSelectionContext();
        this.aligningLineOffset = 5;
        this.aligningLineMargin = 4;
        this.aligningLineWidth = 1;
        this.aligningLineColor = 'rgb(255, 0, 0)';
        this.viewportTransform = this.handler.canvas.viewportTransform;
        this.zoom = 1;
        this.verticalLines = [];
        this.horizontalLines = [];
    }
    /**
     * Destroy guideline handler
     *
     * @author salgum1114
     */
    destroy() {
        this.handler.canvas.off({
            'before:render': this.beforeRender,
            'after:render': this.afterRender,
        });
    }
}
exports.default = GuidelineHandler;
