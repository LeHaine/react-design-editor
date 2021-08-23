/// <reference types="lodash" />
import { Handler } from '.';
declare class ContextmenuHandler {
    handler: Handler;
    contextmenuEl: HTMLDivElement;
    constructor(handler: Handler);
    /**
     * Initialize contextmenu
     *
     */
    initialize(): void;
    /**
     * Destroy contextmenu
     *
     */
    destory(): void;
    /**
     * Show context menu
     *
     */
    show: import("lodash").DebouncedFunc<(e: any, target: any) => Promise<void>>;
    /**
     * Hide context menu
     *
     */
    hide: import("lodash").DebouncedFunc<() => void>;
}
export default ContextmenuHandler;
