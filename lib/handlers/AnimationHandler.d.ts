import anime from 'animejs';
import { Handler } from '.';
import { FabricObject } from '../utils';
declare class AnimationHandler {
    handler: Handler;
    constructor(handler: Handler);
    /**
     * Play the animation
     * @param {string} id
     * @param {boolean} [hasControls]
     * @returns
     */
    play: (id: string, hasControls?: boolean) => void;
    /**
     * Pause the animation
     * @param {string} id
     * @returns
     */
    pause: (id: string) => void;
    /**
     * Stop the animation
     * @param {string} id
     * @param {boolean} [hasControls=true]
     * @returns
     */
    stop: (id: string, hasControls?: boolean) => void;
    /**
     * Restart the animation
     * @param {string} id
     * @returns
     */
    restart: (id: string) => void;
    /**
     * Reset animation
     *
     * @param {FabricObject} obj
     * @param {boolean} [hasControls=true]
     * @returns
     */
    resetAnimation: (obj: FabricObject, hasControls?: boolean) => void;
    /**
     * Get animation option
     *
     * @param {FabricObject} obj
     * @param {boolean} [hasControls]
     * @returns
     */
    getAnime: (obj: FabricObject, hasControls?: boolean) => anime.AnimeInstance;
}
export default AnimationHandler;
