import { Handler } from '.';
import { WorkareaLayout, WorkareaObject, FabricImage } from '../utils';
declare class WorkareaHandler {
    handler: Handler;
    constructor(handler: Handler);
    /**
     * Initialize workarea
     *
     * @author salgum1114
     */
    initialize(): void;
    /**
     * Set the layout on workarea
     * @param {WorkareaLayout} layout
     * @returns
     */
    setLayout: (layout: WorkareaLayout) => void;
    /**
     * Set the responsive image on Workarea
     * @param {string | File} [source]
     * @param {boolean} [loaded]
     * @returns
     */
    setResponsiveImage: (source: string | File, loaded?: boolean) => Promise<WorkareaObject>;
    /**
     * Set the image on Workarea
     * @param {string | File} source
     * @param {boolean} [loaded=false]
     * @returns
     */
    setImage: (source: string | File, loaded?: boolean) => Promise<WorkareaObject>;
    /**
     * Calculate scale to the image
     *
     * @param {FabricImage} [image]
     * @returns
     */
    calculateScale: (image?: FabricImage) => {
        scaleX: number;
        scaleY: number;
    };
}
export default WorkareaHandler;
