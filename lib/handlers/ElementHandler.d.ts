import { fabric } from 'fabric';
import Handler from './Handler';
import { VideoObject } from '../objects/Video';
import { ChartObject } from '../objects/Chart';
import { IframeObject } from '../objects/Iframe';
import { ElementObject } from '../objects/Element';
export declare type ElementType = 'container' | 'script' | 'style';
export declare type ElementObjectType = VideoObject | ChartObject | IframeObject | ElementObject;
export interface ElementCode {
    html?: string;
    css?: string;
    js?: string;
}
declare class ElementHandler {
    handler?: Handler;
    constructor(handler: Handler);
    /**
     * Set element by id
     * @param {string} id
     * @param {*} source
     * @returns {void}
     */
    setById: (id: string, source: any) => void;
    /**
     * Set element
     * @param {ElementObjectType} obj
     * @param {*} source
     */
    set: (obj: ElementObjectType, source: any) => void;
    /**
     * Find element by id with type
     * @param {string} id
     * @param {ElementType} [type='container']
     * @returns
     */
    findById: (id: string, type?: ElementType) => HTMLElement;
    /**
     * Remove element
     * @param {HTMLElement} el
     * @returns
     */
    remove: (el: HTMLElement) => void;
    /**
     * Remove element by id
     * @param {string} id
     */
    removeById: (id: string) => void;
    /**
     * Remove element by ids
     * @param {string[]} ids
     */
    removeByIds: (ids: string[]) => void;
    /**
     * Set position
     * @param {HTMLElement} el
     * @param {number} left
     * @param {number} top
     * @returns
     */
    setPosition: (el: HTMLElement, obj: fabric.Object) => void;
    setPositionByOrigin: (el: HTMLElement, obj: fabric.Object, left: number, top: number) => void;
    /**
     * Set size
     * @param {HTMLElement} el
     * @param {number} width
     * @param {number} height
     * @returns
     */
    setSize: (el: HTMLElement, obj: fabric.Object) => void;
    /**
     * Set scale or angle
     * @param {HTMLElement} el
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} angle
     * @returns
     */
    setScaleOrAngle: (el: HTMLElement, obj: fabric.Object) => void;
}
export default ElementHandler;
