import { fabric } from 'fabric';
import Handler from './Handler';
import { FabricObject } from '../utils';
declare class ZoomHandler {
    handler?: Handler;
    constructor(handler: Handler);
    /**
     * Zoom to point
     *
     * @param {fabric.Point} point
     * @param {number} zoom ex) 0 ~ 1. Not percentage value.
     */
    zoomToPoint: (point: fabric.Point, zoom: number) => void;
    /**
     * Zoom one to one
     *
     */
    zoomOneToOne: () => void;
    /**
     * Zoom to fit
     *
     */
    zoomToFit: () => void;
    /**
     * Zoom in
     *
     */
    zoomIn: () => void;
    /**
     * Zoom out
     *
     */
    zoomOut: () => void;
    /**
     * Zoom to center with object
     *
     * @param {FabricObject} target If zoomFit true, rescaled canvas zoom.
     */
    zoomToCenterWithObject: (target: FabricObject, zoomFit?: boolean) => void;
    /**
     * Zoom to center with objects
     *
     * @param {boolean} [zoomFit] If zoomFit true, rescaled canvas zoom.
     * @returns
     */
    zoomToCenter: (zoomFit?: boolean) => void;
}
export default ZoomHandler;
