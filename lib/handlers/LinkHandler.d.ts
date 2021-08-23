import Handler from './Handler';
import { PortObject } from '../objects/Port';
import { LinkObject } from '../objects/Link';
export interface LinkOption {
    /**
     * Link Type
     * @type {string}
     */
    type: string;
    /**
     * FromNode id of Link
     * @type {string}
     */
    fromNodeId?: string;
    /**
     * FromPort id of Link
     * @type {string}
     */
    fromPortId?: string;
    /**
     * ToNode id of Link
     * @type {string}
     */
    toNodeId?: string;
    /**
     * ToPort id of Link
     * @type {string}
     */
    toPortId?: string;
}
/**
 * Link Handler Class
 * @author salgum1114
 * @class LinkHandler
 */
declare class LinkHandler {
    private port;
    handler: Handler;
    constructor(handler: Handler);
    /**
     * On source port click, start link
     * @param {PortObject} port
     */
    init: (port: PortObject) => void;
    /**
     * End drawing link.
     */
    finish: (link?: LinkObject) => void;
    /**
     * On dest port click, finish link
     * @param {PortObject} port
     */
    generate: (port: PortObject) => void;
    /**
     * Add link in Canvas
     * @param {LinkOption} link
     * @param {boolean} [loaded=false]
     * @returns
     */
    create: (link: LinkOption, loaded?: boolean) => LinkObject;
    /**
     * Set coordinate of link
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {LinkObject} link
     */
    setCoords: (x1: number, y1: number, x2: number, y2: number, link: LinkObject) => void;
    /**
     * When the link is deleted, linked FromNode delete
     * @param {LinkObject} link
     */
    removeFrom: (link: LinkObject) => void;
    /**
     * When the link is deleted, linked ToNode delete
     * @param {LinkObject} link
     */
    removeTo: (link: LinkObject) => void;
    /**
     * When the link is deleted, linked node delete
     * @param {LinkObject} link
     */
    removeAll: (link: LinkObject) => void;
    /**
     * Remove link in canvas
     * @param {LinkObject} link
     * @param {string} [type]
     */
    remove: (link: LinkObject, type?: string) => void;
    /**
     * Check if there is a port connected
     * @param {PortObject} port
     * @returns
     */
    isConnected: (port: PortObject) => boolean;
    /**
     * Check if select same node
     * @param {PortObject} port
     * @returns
     */
    isSameNode: (port: PortObject) => boolean;
    /**
     * Check if select same node
     * @param {PortObject} port
     * @returns
     */
    isDuplicate: (port: PortObject) => boolean;
    /**
     * Check if draw the link
     * @returns
     */
    isDrawing: () => any;
}
export default LinkHandler;
