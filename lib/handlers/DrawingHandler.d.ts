import { fabric } from 'fabric';
import Handler from './Handler';
import { FabricEvent, FabricObject } from '../utils';
declare class DrawingHandler {
    handler: Handler;
    constructor(handler: Handler);
    polygon: {
        init: () => void;
        finish: () => void;
        addPoint: (opt: FabricEvent) => void;
        generate: (pointArray: FabricObject<fabric.Circle>[]) => void;
    };
    line: {
        init: () => void;
        finish: () => void;
        addPoint: (opt: FabricEvent) => void;
        generate: (opt: FabricEvent) => void;
    };
    arrow: {
        init: () => void;
        finish: () => void;
        addPoint: (opt: FabricEvent) => void;
        generate: (opt: FabricEvent) => void;
    };
    orthogonal: {};
    curve: {};
}
export default DrawingHandler;
