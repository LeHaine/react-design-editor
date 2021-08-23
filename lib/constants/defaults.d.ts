import { WorkareaObject, FabricObjectOption } from '../utils';
export declare const canvasOption: {
    preserveObjectStacking: boolean;
    width: number;
    height: number;
    selection: boolean;
    defaultCursor: string;
    backgroundColor: string;
};
export declare const keyEvent: {
    move: boolean;
    all: boolean;
    copy: boolean;
    paste: boolean;
    esc: boolean;
    del: boolean;
    clipboard: boolean;
    transaction: boolean;
    zoom: boolean;
    cut: boolean;
};
export declare const gridOption: {
    enabled: boolean;
    grid: number;
    snapToGrid: boolean;
    lineColor: string;
    borderColor: string;
};
export declare const workareaOption: Partial<WorkareaObject>;
export declare const objectOption: Partial<FabricObjectOption>;
export declare const guidelineOption: {
    enabled: boolean;
};
export declare const activeSelectionOption: {
    hasControls: boolean;
};
export declare const propertiesToInclude: string[];
