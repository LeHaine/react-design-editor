/// <reference types="lodash" />
import Handler from './Handler';
import { FabricObject } from '../utils';
export declare type TransactionType = 'add' | 'remove' | 'moved' | 'scaled' | 'rotated' | 'skewed' | 'group' | 'ungroup' | 'propschange' | 'paste' | 'bringForward' | 'bringToFront' | 'sendBackwards' | 'sendToBack' | 'redo' | 'undo';
export interface TransactionTransform {
    scaleX?: number;
    scaleY?: number;
    skewX?: number;
    skewY?: number;
    angle?: number;
    left?: number;
    top?: number;
    flipX?: number;
    flipY?: number;
    originX?: string;
    originY?: string;
}
export interface TransactionEvent {
    json: string;
    type: TransactionType;
}
declare class TransactionHandler {
    handler: Handler;
    redos: TransactionEvent[];
    undos: TransactionEvent[];
    active: boolean;
    state: FabricObject[];
    constructor(handler: Handler);
    /**
     * Initialize transaction handler
     *
     */
    initialize: () => void;
    /**
     * Save transaction
     *
     * @param {TransactionType} type
     * @param {*} [canvasJSON]
     * @param {boolean} [isWorkarea=true]
     */
    save: (type: TransactionType, canvasJSON?: any, _isWorkarea?: boolean) => void;
    updateState: (canvasJSON?: any) => void;
    /**
     * Undo transaction
     *
     */
    undo: import("lodash").DebouncedFunc<() => void>;
    /**
     * Redo transaction
     *
     */
    redo: import("lodash").DebouncedFunc<() => void>;
    /**
     * Replay transaction
     *
     * @param {TransactionEvent} transaction
     */
    replay: (transaction: TransactionEvent) => void;
}
export default TransactionHandler;
