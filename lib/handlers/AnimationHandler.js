"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const animejs_1 = __importDefault(require("animejs"));
class AnimationHandler {
    constructor(handler) {
        /**
         * Play the animation
         * @param {string} id
         * @param {boolean} [hasControls]
         * @returns
         */
        this.play = (id, hasControls) => {
            const findObject = this.handler.findById(id);
            if (!findObject) {
                return;
            }
            if (findObject.anime) {
                findObject.anime.restart();
                return;
            }
            if (findObject.animation.type === 'none') {
                return;
            }
            const instance = this.getAnime(findObject, hasControls);
            if (instance) {
                findObject.set('anime', instance);
                findObject.set({
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    hoverCursor: 'pointer',
                });
                this.handler.canvas.requestRenderAll();
                instance.play();
            }
        };
        /**
         * Pause the animation
         * @param {string} id
         * @returns
         */
        this.pause = (id) => {
            const findObject = this.handler.findById(id);
            if (!findObject) {
                return;
            }
            findObject.anime.pause();
        };
        /**
         * Stop the animation
         * @param {string} id
         * @param {boolean} [hasControls=true]
         * @returns
         */
        this.stop = (id, hasControls = true) => {
            const findObject = this.handler.findById(id);
            if (!findObject) {
                return;
            }
            this.resetAnimation(findObject, hasControls);
        };
        /**
         * Restart the animation
         * @param {string} id
         * @returns
         */
        this.restart = (id) => {
            const findObject = this.handler.findById(id);
            if (!findObject) {
                return;
            }
            if (!findObject.anime) {
                return;
            }
            this.stop(id);
            this.play(id);
        };
        /**
         * Reset animation
         *
         * @param {FabricObject} obj
         * @param {boolean} [hasControls=true]
         * @returns
         */
        this.resetAnimation = (obj, hasControls = true) => {
            if (!obj.anime) {
                return;
            }
            let option;
            if (this.handler.editable) {
                option = {
                    anime: null,
                    hasControls,
                    lockMovementX: !hasControls,
                    lockMovementY: !hasControls,
                    hoverCursor: hasControls ? 'move' : 'pointer',
                };
            }
            else {
                option = {
                    anime: null,
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    hoverCursor: 'pointer',
                };
            }
            animejs_1.default.remove(obj);
            const { type } = obj.animation;
            if (type === 'fade') {
                Object.assign(option, {
                    opacity: obj.originOpacity,
                    originOpacity: null,
                });
            }
            else if (type === 'bounce') {
                if (obj.animation.bounce === 'vertical') {
                    Object.assign(option, {
                        top: obj.originTop,
                        originTop: null,
                    });
                }
                else {
                    Object.assign(option, {
                        left: obj.originLeft,
                        originLeft: null,
                    });
                }
            }
            else if (type === 'shake') {
                if (obj.animation.shake === 'vertical') {
                    Object.assign(option, {
                        top: obj.originTop,
                        originTop: null,
                    });
                }
                else {
                    Object.assign(option, {
                        left: obj.originLeft,
                        originLeft: null,
                    });
                }
            }
            else if (type === 'scaling') {
                Object.assign(option, {
                    scaleX: obj.originScaleX,
                    scaleY: obj.originScaleY,
                    originScaleX: null,
                    originScaleY: null,
                });
            }
            else if (type === 'rotation') {
                Object.assign(option, {
                    angle: obj.originAngle,
                    rotation: obj.originAngle,
                    left: obj.originLeft,
                    top: obj.originTop,
                    originLeft: null,
                    originTop: null,
                    originAngle: null,
                });
            }
            else if (type === 'flash') {
                Object.assign(option, {
                    fill: obj.originFill,
                    stroke: obj.originStroke,
                    originFill: null,
                    origniStroke: null,
                });
            }
            else {
                console.warn('Not supported type.');
            }
            obj.set(option);
            this.handler.canvas.renderAll();
        };
        /**
         * Get animation option
         *
         * @param {FabricObject} obj
         * @param {boolean} [hasControls]
         * @returns
         */
        this.getAnime = (obj, hasControls) => {
            const { delay = 0, duration = 100, autoplay = true, loop = true, type, ...other } = obj.animation;
            const option = {
                targets: obj,
                delay,
                loop,
                autoplay,
                duration,
                direction: 'alternate',
                begin: () => {
                    obj.set({
                        hasControls: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        hoverCursor: 'pointer',
                    });
                    this.handler.canvas.requestRenderAll();
                },
                update: (e) => {
                    if (type === 'flash') {
                        // I don't know why it works. Magic code...
                        const fill = e.animations[0].currentValue;
                        const stroke = e.animations[1].currentValue;
                        obj.set('fill', '');
                        obj.set('fill', fill);
                        obj.set('stroke', stroke);
                    }
                    else if (type === 'rotation') {
                        const angle = e.animations[0].currentValue;
                        obj.rotate(angle);
                        this.handler.canvas.requestRenderAll();
                        return;
                    }
                    obj.setCoords();
                    this.handler.canvas.requestRenderAll();
                },
                complete: () => {
                    this.resetAnimation(obj, hasControls);
                },
            };
            if (type === 'fade') {
                const { opacity = 0 } = other;
                obj.set('originOpacity', obj.opacity);
                Object.assign(option, {
                    opacity,
                    easing: 'easeInQuad',
                });
            }
            else if (type === 'bounce') {
                const { offset = 1 } = other;
                if (other.bounce === 'vertical') {
                    obj.set('originTop', obj.top);
                    Object.assign(option, {
                        top: obj.top + offset,
                        easing: 'easeInQuad',
                    });
                }
                else {
                    obj.set('originLeft', obj.left);
                    Object.assign(option, {
                        left: obj.left + offset,
                        easing: 'easeInQuad',
                    });
                }
            }
            else if (type === 'shake') {
                const { offset = 1 } = other;
                if (other.shake === 'vertical') {
                    obj.set('originTop', obj.top);
                    Object.assign(option, {
                        top: obj.top + offset,
                        delay: 0,
                        elasticity: 1000,
                        duration: 500,
                    });
                }
                else {
                    obj.set('originLeft', obj.left);
                    Object.assign(option, {
                        left: obj.left + offset,
                        delay: 0,
                        elasticity: 1000,
                        duration: 500,
                    });
                }
            }
            else if (type === 'scaling') {
                const { scale = 2 } = other;
                obj.set('originScaleX', obj.scaleX);
                obj.set('originScaleY', obj.scaleY);
                obj.set({
                    originScaleX: obj.scaleX,
                    originScaleY: obj.scaleY,
                });
                const scaleX = obj.scaleX * scale;
                const scaleY = obj.scaleY * scale;
                Object.assign(option, {
                    scaleX,
                    scaleY,
                    easing: 'easeInQuad',
                });
            }
            else if (type === 'rotation') {
                const { angle = 360 } = other;
                obj.set('rotation', obj.angle);
                obj.set('originAngle', obj.angle);
                obj.set('originLeft', obj.left);
                obj.set('originTop', obj.top);
                Object.assign(option, {
                    rotation: angle,
                    easing: 'linear',
                    direction: 'normal',
                });
            }
            else if (type === 'flash') {
                const { fill = obj.fill, stroke = obj.stroke } = other;
                obj.set('originFill', obj.fill);
                obj.set('originStroke', obj.stroke);
                Object.assign(option, {
                    fill,
                    stroke,
                    easing: 'easeInQuad',
                });
            }
            else {
                console.warn('Not supported type.');
                return null;
            }
            return animejs_1.default(option);
        };
        this.handler = handler;
    }
}
exports.default = AnimationHandler;
