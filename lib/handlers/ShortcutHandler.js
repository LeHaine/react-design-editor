"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
/**
 * Shortcut Handler Class
 *
 * @author salgum1114
 * @class ShortcutHandler
 */
class ShortcutHandler {
    constructor(handler) {
        /**
         * Whether keydown Escape
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isEscape = (e) => {
            return e.code === constants_1.code.ESCAPE && this.keyEvent.esc;
        };
        /**
         * Whether keydown Q
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isQ = (e) => {
            return e.code === constants_1.code.KEY_Q;
        };
        /**
         * Whether keydown W
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isW = (e) => {
            return e.code === constants_1.code.KEY_W;
        };
        /**
         * Whether keydown Delete or Backpsace
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isDelete = (e) => {
            return (e.code === constants_1.code.BACKSPACE || e.code === constants_1.code.DELETE) && this.keyEvent.del;
        };
        /**
         * Whether keydown Arrow
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isArrow = (e) => {
            return e.code.includes('Arrow') && this.keyEvent.move;
        };
        /**
         * Whether keydown Ctrl + A
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isCtrlA = (e) => {
            return (e.ctrlKey || e.metaKey) && e.code === constants_1.code.KEY_A && this.keyEvent.all;
        };
        /**
         * Whether keydown Ctrl + C
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isCtrlC = (e) => {
            return (e.ctrlKey || e.metaKey) && e.code === constants_1.code.KEY_C && this.keyEvent.copy;
        };
        /**
         * Whether keydown Ctrl + V
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isCtrlV = (e) => {
            return (e.ctrlKey || e.metaKey) && e.code === constants_1.code.KEY_V && this.keyEvent.paste;
        };
        /**
         * Whether keydown Ctrl + Z
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isCtrlZ = (e) => {
            return (e.ctrlKey || e.metaKey) && e.code === constants_1.code.KEY_Z && this.keyEvent.transaction;
        };
        /**
         * Whether keydown Ctrl + Y
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isCtrlY = (e) => {
            return (e.ctrlKey || e.metaKey) && e.code === constants_1.code.KEY_Y && this.keyEvent.transaction;
        };
        /**
         * Whether keydown Plus Or Equal
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isPlus = (e) => {
            return e.code === constants_1.code.EQUAL && this.keyEvent.zoom;
        };
        /**
         * Whether keydown Minus
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isMinus = (e) => {
            return e.code === constants_1.code.MINUS && this.keyEvent.zoom;
        };
        /**
         * Whether keydown O
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isO = (e) => {
            return e.code === constants_1.code.KEY_O && this.keyEvent.zoom;
        };
        /**
         * Whether keydown P
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isP = (e) => {
            return e.code === constants_1.code.KEY_P && this.keyEvent.zoom;
        };
        /**
         * Whether keydown Ctrl + X
         *
         * @param {KeyboardEvent} e
         * @returns
         */
        this.isCtrlX = (e) => {
            return (e.ctrlKey || e.metaKey) && e.code === constants_1.code.KEY_X && this.keyEvent.cut;
        };
        this.handler = handler;
        this.keyEvent = handler.keyEvent;
    }
}
exports.default = ShortcutHandler;
