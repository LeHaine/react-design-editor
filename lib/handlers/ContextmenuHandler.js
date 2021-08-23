"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_dom_1 = __importDefault(require("react-dom"));
const debounce_1 = __importDefault(require("lodash/debounce"));
class ContextmenuHandler {
    constructor(handler) {
        /**
         * Show context menu
         *
         */
        this.show = debounce_1.default(async (e, target) => {
            const { onContext } = this.handler;
            while (this.contextmenuEl.hasChildNodes()) {
                this.contextmenuEl.removeChild(this.contextmenuEl.firstChild);
            }
            const contextmenu = document.createElement('div');
            contextmenu.className = 'rde-contextmenu-right';
            const element = await onContext(this.contextmenuEl, e, target);
            if (!element) {
                return;
            }
            contextmenu.innerHTML = element;
            this.contextmenuEl.appendChild(contextmenu);
            react_dom_1.default.render(element, contextmenu);
            this.contextmenuEl.classList.remove('contextmenu-hidden');
            const { clientX: left, clientY: top } = e;
            this.contextmenuEl.style.left = `${left}px`;
            this.contextmenuEl.style.top = `${top}px`;
        }, 100);
        /**
         * Hide context menu
         *
         */
        this.hide = debounce_1.default(() => {
            if (this.contextmenuEl) {
                this.contextmenuEl.classList.add('contextmenu-hidden');
            }
        }, 100);
        this.handler = handler;
        this.initialize();
    }
    /**
     * Initialize contextmenu
     *
     */
    initialize() {
        this.contextmenuEl = document.createElement('div');
        this.contextmenuEl.id = `${this.handler.id}_contextmenu`;
        this.contextmenuEl.className = 'rde-contextmenu contextmenu-hidden';
        document.body.appendChild(this.contextmenuEl);
    }
    /**
     * Destroy contextmenu
     *
     */
    destory() {
        if (this.contextmenuEl) {
            document.body.removeChild(this.contextmenuEl);
        }
    }
}
exports.default = ContextmenuHandler;
