import Handler from './Handler';
import { FabricObject, InteractionMode } from '../utils';
declare type IReturnType = {
    selectable?: boolean;
    evented?: boolean;
} | boolean;
declare class InteractionHandler {
    handler: Handler;
    constructor(handler: Handler);
    /**
     * Change selection mode
     * @param {(obj: FabricObject) => IReturnType} [callback]
     */
    selection: (callback?: (obj: FabricObject) => IReturnType) => void;
    /**
     * Change grab mode
     * @param {(obj: FabricObject) => IReturnType} [callback]
     */
    grab: (callback?: (obj: FabricObject) => IReturnType) => void;
    /**
     * Change drawing mode
     * @param {InteractionMode} [type]
     * @param {(obj: FabricObject) => IReturnType} [callback]
     */
    drawing: (type?: InteractionMode, callback?: (obj: FabricObject) => IReturnType) => void;
    linking: (callback?: (obj: FabricObject) => IReturnType) => void;
    /**
     * Moving objects in grap mode
     * @param {MouseEvent} e
     */
    moving: (e: MouseEvent) => void;
    /**
     * Whether is drawing mode
     * @returns
     */
    isDrawingMode: () => boolean;
    /**
     * Interaction callback
     *
     * @param {FabricObject} obj
     * @param {(obj: FabricObject) => void} [callback]
     */
    private interactionCallback;
}
export default InteractionHandler;
