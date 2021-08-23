/// <reference types="lodash" />
import Handler from './Handler';
import { FabricObject } from '../utils';
declare class TooltipHandler {
    handler: Handler;
    tooltipEl: HTMLDivElement;
    target?: fabric.Object;
    constructor(handler: Handler);
    /**
     * Initialize tooltip
     *
     * @author salgum1114
     */
    initialize(): void;
    /**
     * Destroy tooltip
     *
     * @author salgum1114
     */
    destroy(): void;
    /**
     * Show tooltip
     *
     * @param {FabricObject} [target]
     */
    show: import("lodash").DebouncedFunc<(target?: FabricObject) => Promise<void>>;
    /**
     * Hide tooltip
     * @param {fabric.Object} [_target]
     */
    hide: import("lodash").DebouncedFunc<(_target?: fabric.Object) => void>;
}
export default TooltipHandler;
