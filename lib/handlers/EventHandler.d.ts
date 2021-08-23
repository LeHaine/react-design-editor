import Handler from './Handler';
import { FabricEvent } from '../utils';
/**
 * Event Handler Class
 * @author salgum1114
 * @class EventHandler
 */
declare class EventHandler {
    handler: Handler;
    code: string;
    panning: boolean;
    constructor(handler: Handler);
    /**
     * Attch event on document
     *
     */
    initialize(): void;
    /**
     * Detach event on document
     *
     */
    destroy: () => void;
    /**
     * Individual object event
     *
     */
    object: {
        /**
         * Mouse down event on object
         * @param {FabricEvent} opt
         */
        mousedown: (opt: FabricEvent) => void;
        /**
         * Mouse double click event on object
         * @param {FabricEvent} opt
         */
        mousedblclick: (opt: FabricEvent) => void;
    };
    /**
     * Modified event object
     *
     * @param {FabricEvent} opt
     * @returns
     */
    modified: (opt: FabricEvent) => void;
    /**
     * Moving event object
     *
     * @param {FabricEvent} opt
     * @returns
     */
    moving: (opt: FabricEvent) => void;
    /**
     * Moved event object
     *
     * @param {FabricEvent} opt
     */
    moved: (opt: FabricEvent) => void;
    /**
     * Scaling event object
     *
     * @param {FabricEvent} opt
     */
    scaling: (opt: FabricEvent) => void;
    /**
     * Scaled event object
     *
     * @param {FabricEvent} opt
     */
    scaled: (_opt: FabricEvent) => void;
    /**
     * Rotating event object
     *
     * @param {FabricEvent} opt
     */
    rotating: (opt: FabricEvent) => void;
    /**
     * Rotated event object
     *
     * @param {FabricEvent} opt
     */
    rotated: (_opt: FabricEvent) => void;
    /**
     * Moing object at keyboard arrow key down event
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    arrowmoving: (e: KeyboardEvent) => boolean;
    /**
     * Zoom at mouse wheel event
     *
     * @param {FabricEvent<WheelEvent>} opt
     * @returns
     */
    mousewheel: (opt: FabricEvent) => void;
    /**
     * Mouse down event on object
     *
     * @param {FabricEvent<MouseEvent>} opt
     * @returns
     */
    mousedown: (opt: FabricEvent) => void;
    /**
     * Mouse move event on canvas
     *
     * @param {FabricEvent<MouseEvent>} opt
     * @returns
     */
    mousemove: (opt: FabricEvent) => void;
    /**
     * Mouse up event on canvas
     *
     * @param {FabricEvent<MouseEvent>} opt
     * @returns
     */
    mouseup: (opt: FabricEvent) => void;
    /**
     * Mouse out event on canvas
     *
     * @param {FabricEvent<MouseEvent>} opt
     */
    mouseout: (opt: FabricEvent) => void;
    /**
     * Selection event event on canvas
     *
     * @param {FabricEvent} opt
     */
    selection: (opt: FabricEvent) => void;
    /**
     * Called resize event on canvas
     *
     * @param {number} nextWidth
     * @param {number} nextHeight
     * @returns
     */
    resize: (nextWidth: number, nextHeight: number) => void;
    /**
     * Paste event on canvas
     *
     * @param {ClipboardEvent} e
     * @returns
     */
    paste: (e: ClipboardEvent) => Promise<boolean>;
    /**
     * Keydown event on document
     *
     * @param {KeyboardEvent} e
     */
    keydown: (e: KeyboardEvent) => void;
    /**
     * Key up event on canvas
     *
     * @param {KeyboardEvent} _e
     */
    keyup: (e: KeyboardEvent) => void;
    /**
     * Context menu event on canvas
     *
     * @param {MouseEvent} e
     */
    contextmenu: (e: MouseEvent) => void;
    /**
     * Mouse down event on canvas
     *
     * @param {MouseEvent} _e
     */
    onmousedown: (_e: MouseEvent) => void;
}
export default EventHandler;
