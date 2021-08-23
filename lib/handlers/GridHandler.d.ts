import { fabric } from 'fabric';
import Handler from './Handler';
import { FabricObject } from '../utils';
declare class GridHandler {
    handler?: Handler;
    constructor(handler: Handler);
    /**
     * Init grid
     *
     */
    initialize: () => void;
    /**
     * Set coords in grid
     * @param {(FabricObject | fabric.ActiveSelection)} target
     * @returns
     */
    setCoords: (target: FabricObject | fabric.ActiveSelection) => void;
}
export default GridHandler;
