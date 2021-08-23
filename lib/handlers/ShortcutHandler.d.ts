import Handler from './Handler';
import { KeyEvent } from '../utils';
/**
 * Shortcut Handler Class
 *
 * @author salgum1114
 * @class ShortcutHandler
 */
declare class ShortcutHandler {
    handler: Handler;
    keyEvent: KeyEvent;
    constructor(handler: Handler);
    /**
     * Whether keydown Escape
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isEscape: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Q
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isQ: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown W
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isW: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Delete or Backpsace
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isDelete: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Arrow
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isArrow: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Ctrl + A
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlA: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Ctrl + C
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlC: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Ctrl + V
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlV: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Ctrl + Z
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlZ: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Ctrl + Y
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlY: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Plus Or Equal
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isPlus: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Minus
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isMinus: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown O
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isO: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown P
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isP: (e: KeyboardEvent) => boolean;
    /**
     * Whether keydown Ctrl + X
     *
     * @param {KeyboardEvent} e
     * @returns
     */
    isCtrlX: (e: KeyboardEvent) => boolean;
}
export default ShortcutHandler;
