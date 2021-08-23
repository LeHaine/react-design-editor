import { fabric } from 'fabric';
import { Handler } from '.';
import { FabricImage } from '../utils';
declare class CropHandler {
    handler: Handler;
    cropRect: fabric.Rect;
    cropObject: FabricImage;
    constructor(handler: Handler);
    /**
     * Validate crop type
     *
     * @returns
     */
    validType: () => boolean;
    /**
     * Start crop image
     *
     */
    start: () => void;
    /**
     * Finish crop image
     *
     */
    finish: () => void;
    /**
     * Cancel crop
     *
     */
    cancel: () => void;
    /**
     * Resize crop
     *
     * @param {FabricEvent} opt
     */
    resize: (opt: fabric.IEvent) => void;
    /**
     * Resize crop
     *
     * @param {FabricEvent} opt
     */
    moving: (opt: fabric.IEvent) => void;
}
export default CropHandler;
