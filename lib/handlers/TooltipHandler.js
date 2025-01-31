"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_dom_1 = __importDefault(require("react-dom"));
const debounce_1 = __importDefault(require("lodash/debounce"));
class TooltipHandler {
    constructor(handler) {
        /**
         * Show tooltip
         *
         * @param {FabricObject} [target]
         */
        this.show = debounce_1.default(async (target) => {
            if (target.tooltip && target.tooltip.enabled) {
                while (this.tooltipEl.hasChildNodes()) {
                    this.tooltipEl.removeChild(this.tooltipEl.firstChild);
                }
                const tooltip = document.createElement('div');
                tooltip.className = 'rde-tooltip-right';
                let element = target.name;
                const { onTooltip } = this.handler;
                if (onTooltip) {
                    element = await onTooltip(this.tooltipEl, target);
                    if (!element) {
                        return;
                    }
                }
                tooltip.innerHTML = element;
                this.tooltipEl.appendChild(tooltip);
                react_dom_1.default.render(element, tooltip);
                this.tooltipEl.classList.remove('tooltip-hidden');
                const zoom = this.handler.canvas.getZoom();
                const { clientHeight } = this.tooltipEl;
                const { width, height, scaleX, scaleY } = target;
                const { left, top } = target.getBoundingRect();
                const { _offset: offset } = this.handler.canvas.calcOffset();
                const objWidthDiff = width * scaleX * zoom;
                const objHeightDiff = (height * scaleY * zoom) / 2 - clientHeight / 2;
                const calcLeft = offset.left + left + objWidthDiff;
                const calcTop = offset.top + top + objHeightDiff;
                if (document.body.clientWidth <= calcLeft + this.tooltipEl.offsetWidth) {
                    this.tooltipEl.style.left = `${left + offset.left - this.tooltipEl.offsetWidth}px`;
                    tooltip.className = 'rde-tooltip-left';
                }
                else {
                    this.tooltipEl.style.left = `${calcLeft}px`;
                }
                this.tooltipEl.style.top = `${calcTop}px`;
                this.handler.target = target;
            }
        }, 100);
        /**
         * Hide tooltip
         * @param {fabric.Object} [_target]
         */
        this.hide = debounce_1.default((_target) => {
            this.handler.target = null;
            if (this.tooltipEl) {
                this.tooltipEl.classList.add('tooltip-hidden');
            }
        }, 100);
        this.handler = handler;
        if (!handler.editable) {
            this.initialize();
        }
    }
    /**
     * Initialize tooltip
     *
     * @author salgum1114
     */
    initialize() {
        this.tooltipEl = document.createElement('div');
        this.tooltipEl.id = `${this.handler.id}_tooltip`;
        this.tooltipEl.className = 'rde-tooltip tooltip-hidden';
        document.body.appendChild(this.tooltipEl);
    }
    /**
     * Destroy tooltip
     *
     * @author salgum1114
     */
    destroy() {
        if (this.tooltipEl) {
            document.body.removeChild(this.tooltipEl);
        }
    }
}
exports.default = TooltipHandler;
