import { fabric } from 'fabric';
import Handler from './Handler';
export declare type GrayscaleModeType = 'average' | 'luminosity' | 'lightness';
export interface RemoveColorFilter {
    color?: string;
    distance?: number;
    fragmentSource?: any;
    useAlpahe?: any;
}
export interface BlendColorFilter {
    color?: string;
    mode?: string;
    alpha?: number;
}
export interface GammaFilter {
    gamma?: number[];
}
export interface BlendImageFilter {
    image?: fabric.Image;
    mode?: string;
    alpha?: number;
}
export interface HueRotationFilter {
    rotation?: number;
}
export declare type ResizeType = 'bilinear' | 'hermite' | 'sliceHack' | 'lanczos';
export interface ResizeFilter {
    resizeType?: ResizeType;
    scaleX?: number;
    scaleY?: number;
    lanczosLobes?: number;
}
export interface TintFilter {
    color?: string;
    opacity?: number;
}
export interface MaskFilter {
    mask?: fabric.Image;
    /**
     * Rgb channel (0, 1, 2 or 3)
     * @default 0
     */
    channel: number;
}
export interface MultiplyFilter {
    /**
     * Color to multiply the image pixels with
     * @default #000000
     */
    color: string;
}
export interface GradientTransparencyFilter {
    /** @default 100 */
    threshold?: number;
}
export interface ColorMatrixFilter {
    /** Filter matrix */
    matrix?: number[];
}
export interface RemoveWhiteFilter {
    /** @default 30 */
    threshold?: number;
    /** @default 20 */
    distance?: number;
}
export declare type ValuesOf<T extends any[]> = T[number];
export interface IFilter {
    type: typeof FILTER_TYPES[number];
    [key: string]: any;
}
export declare const FILTER_TYPES: string[];
export declare const capitalize: (str: string) => string | false;
/**
 * Image Handler
 * @author salgum1114
 * @date 2019-09-01
 * @class ImageHandler
 * @implements {IBaseHandler}
 */
declare class ImageHandler {
    handler: Handler;
    constructor(handler: Handler);
    /**
     * Create filter by type
     * @param {IFilter} filter
     */
    createFilter: (filter: IFilter) => false | fabric.IGrayscaleFilter;
    /**
     * Create filter by types
     * @param {IFilter[]} filters
     */
    createFilters: (filters: IFilter[]) => any[];
    /**
     * Apply filter by type
     * @param {string} type
     * @param {*} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyFilterByType: (type: string, apply?: boolean, value?: any, imageObj?: fabric.Image) => void;
    /**
     * Apply filter in image
     * @param {fabric.Image} [imageObj]
     * @param {number} index
     * @param {fabric.IBaseFilter} filter
     */
    applyFilter: (index: number, filter: fabric.IBaseFilter | boolean, imageObj?: fabric.Image) => void;
    /**
     * Apply filter value in image
     * @param {fabric.Image} [imageObj]
     * @param {number} index
     * @param {string} prop
     * @param {any} value
     */
    applyFilterValue: (index: number, prop: string, value: any, imageObj?: fabric.Image) => void;
    /**
     * Apply grayscale in image
     * @param {fabric.Image} [imageObj]
     * @param {boolean} [grayscale=false]
     * @param {GrayscaleModeType} [value]
     */
    applyGrayscale: (grayscale?: boolean, value?: GrayscaleModeType, imageObj?: fabric.Image) => void;
    /**
     * Apply invert in image
     * @param {fabric.Image} [imageObj]
     * @param {boolean} [invert=false]
     */
    applyInvert: (invert?: boolean, imageObj?: fabric.Image) => void;
    /**
     * Apply remove color in image
     * @param {fabric.Image} [imageObj]
     * @param {boolean} [removeColor=false]
     * @param {RemoveColorFilter} [value]
     */
    /**
     * Apply sepia in image
     * @param {fabric.Image} [imageObj]
     * @param {boolean} [sepia=false]
     */
    applySepia: (sepia?: boolean, imageObj?: fabric.Image) => void;
    /**
     * Apply brownie in image
     * @param {boolean} [brownie=false]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply brightness in image
     * @param {boolean} [brightness=false]
     * @param {number} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyBrightness: (brightness?: boolean, value?: number, imageObj?: fabric.Image) => void;
    /**
     * Apply contrast in image
     * @param {boolean} [contrast=false]
     * @param {number} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyContrast: (contrast?: boolean, value?: number, imageObj?: fabric.Image) => void;
    /**
     * Apply saturation in image
     * @param {boolean} [saturation=false]
     * @param {number} [value]
     * @param {fabric.Image} [imageObj]
     */
    applySaturation: (saturation?: boolean, value?: number, imageObj?: fabric.Image) => void;
    /**
     * Apply noise in image
     * @param {boolean} [noise=false]
     * @param {number} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyNoise: (noise?: boolean, value?: number, imageObj?: fabric.Image) => void;
    /**
     * Apply vintage in image
     * @param {boolean} [vintage=false]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply pixelate in image
     * @param {boolean} [pixelate=false]
     * @param {number} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyPixelate: (pixelate?: boolean, value?: number, imageObj?: fabric.Image) => void;
    /**
     * Apply blur in image
     * @param {boolean} [blur=false]
     * @param {number} [value]
     * @param {fabric.Image} imageObj
     */
    /**
     * Apply sharpen in image
     * @param {boolean} [sharpen=false]
     * @param {number[]} [value=[0, -1,  0, -1,  5, -1, 0, -1,  0]]
     * @param {fabric.Image} [imageObj]
     */
    applySharpen: (sharpen?: boolean, value?: number[], imageObj?: fabric.Image) => void;
    /**
     * Apply emboss in image
     * @param {boolean} [emboss=false]
     * @param {number[]} [value=[1, 1, 1, 1, 0.7, -1, -1, -1, -1]]
     * @param {fabric.Image} [imageObj]
     */
    applyEmboss: (emboss?: boolean, value?: number[], imageObj?: fabric.Image) => void;
    /**
     * Apply technicolor in image
     * @param {boolean} [technicolor=false]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply polaroid in image
     * @param {boolean} [polaroid=false]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply blend color in image
     * @param {boolean} [blend=false]
     * @param {BlendColorFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyBlendColor: (blend?: boolean, value?: BlendColorFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply gamma in image
     * @param {boolean} [gamma=false]
     * @param {GammaFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply kodachrome in image
     * @param {boolean} [kodachrome=false]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply black white in image
     * @param {boolean} [blackWhite=false]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply blend image in image
     * @param {boolean} [blendImage=false]
     * @param {BlendImageFilter} value
     * @param {fabric.Image} [imageObj]
     */
    applyBlendImage: (blendImage?: boolean, value?: BlendImageFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply hue rotation in image
     * @param {boolean} [hue=false]
     * @param {HueRotationFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    /**
     * Apply resize in image
     * @param {boolean} [resize=false]
     * @param {ResizeFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyResize: (resize?: boolean, value?: ResizeFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply tint in image
     * @param {boolean} [tint=false]
     * @param {TintFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyTint: (tint?: boolean, value?: TintFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply mask in image
     * @param {boolean} [mask=false]
     * @param {MaskFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyMask: (mask?: boolean, value?: MaskFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply multiply in image
     * @param {boolean} [multiply=false]
     * @param {MultiplyFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyMultiply: (multiply?: boolean, value?: MultiplyFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply sepia2 in image
     * @param {boolean} [sepia2=false]
     * @param {fabric.Image} [imageObj]
     */
    applySepia2: (sepia2?: boolean, imageObj?: fabric.Image) => void;
    /**
     * Apply gradient transparency in image
     * @param {boolean} [gradientTransparency=false]
     * @param {GradientTransparencyFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyGradientTransparency: (gradientTransparency?: boolean, value?: GradientTransparencyFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply color matrix in image
     * @param {boolean} [colorMatrix=false]
     * @param {ColorMatrixFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyColorMatrix: (colorMatrix?: boolean, value?: ColorMatrixFilter, imageObj?: fabric.Image) => void;
    /**
     * Apply remove white in image
     * @param {boolean} [removeWhite=false]
     * @param {RemoveWhiteFilter} [value]
     * @param {fabric.Image} [imageObj]
     */
    applyRemoveWhite: (removeWhite?: boolean, value?: RemoveWhiteFilter, imageObj?: fabric.Image) => void;
}
export default ImageHandler;
