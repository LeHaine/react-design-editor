"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.FILTER_TYPES = void 0;
const fabric_1 = require("fabric");
const isEqual_1 = __importDefault(require("lodash/isEqual"));
exports.FILTER_TYPES = [
    'grayscale',
    'invert',
    'remove-color',
    'sepia',
    'brownie',
    'brightness',
    'contrast',
    'saturation',
    'noise',
    'vintage',
    'pixelate',
    'blur',
    'sharpen',
    'emboss',
    'technicolor',
    'polaroid',
    'blend-color',
    'gamma',
    'kodachrome',
    'blackwhite',
    'blend-image',
    'hue',
    'resize',
    'tint',
    'mask',
    'multiply',
    'sepia2',
];
exports.capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : false);
const SHARPEN_MATRIX = [0, -1, 0, -1, 5, -1, 0, -1, 0];
const EMBOSS_MATRIX = [1, 1, 1, 1, 0.7, -1, -1, -1, -1];
/**
 * Image Handler
 * @author salgum1114
 * @date 2019-09-01
 * @class ImageHandler
 * @implements {IBaseHandler}
 */
class ImageHandler {
    constructor(handler) {
        /**
         * Create filter by type
         * @param {IFilter} filter
         */
        this.createFilter = (filter) => {
            const { type: filterType, ...other } = filter;
            const type = filterType.toLowerCase();
            if (type === 'grayscale') {
                return new fabric_1.fabric.Image.filters.Grayscale(other);
            }
            else if (type === 'invert') {
                return new fabric_1.fabric.Image.filters.Invert();
                // } else if (type === 'remove-color') {
                //     return new fabric.Image.filters.RemoveColor(other);
            }
            else if (type === 'sepia') {
                return new fabric_1.fabric.Image.filters.Sepia();
                // } else if (type === 'brownie') {
                //     return new fabric.Image.filters.Brownie();
            }
            else if (type === 'brightness') {
                return new fabric_1.fabric.Image.filters.Brightness({ brightness: other.brightness });
            }
            else if (type === 'contrast') {
                return new fabric_1.fabric.Image.filters.Contrast(other);
            }
            else if (type === 'saturation') {
                return new fabric_1.fabric.Image.filters.Saturation(other);
            }
            else if (type === 'noise') {
                return new fabric_1.fabric.Image.filters.Noise({ noise: other.noise });
                // } else if (type === 'vintage') {
                //     return new fabric.Image.filters.Vintage();
            }
            else if (type === 'pixelate') {
                return new fabric_1.fabric.Image.filters.Pixelate(other);
                // } else if (type === 'blur') {
                //     return new fabric.Image.filters.Blur(other);
            }
            else if (type === 'sharpen') {
                return new fabric_1.fabric.Image.filters.Convolute({
                    matrix: SHARPEN_MATRIX,
                });
            }
            else if (type === 'emboss') {
                return new fabric_1.fabric.Image.filters.Convolute({
                    matrix: EMBOSS_MATRIX,
                });
                // } else if (type === 'technicolor') {
                //     return new fabric.Image.filters.Technicolor();
                // } else if (type === 'polaroid') {
                //     return new fabric.Image.filters.Polaroid();
            }
            else if (type === 'blend-color') {
                return new fabric_1.fabric.Image.filters.BlendColor(other);
                // } else if (type === 'gamma') {
                //     return new fabric.Image.filters.Gamma(other);
                // } else if (type === 'kodachrome') {
                //     return new fabric.Image.filters.Kodachrome();
                // } else if (type === 'blackwhite') {
                //     return new fabric.Image.filters.BlackWhite();
            }
            else if (type === 'blend-image') {
                return new fabric_1.fabric.Image.filters.BlendImage(other);
                // } else if (type === 'hue') {
                //     return new fabric.Image.filters.HueRotation(other);
            }
            else if (type === 'resize') {
                return new fabric_1.fabric.Image.filters.Resize(other);
            }
            else if (type === 'tint') {
                return new fabric_1.fabric.Image.filters.Tint(other);
            }
            else if (type === 'mask') {
                return new fabric_1.fabric.Image.filters.Mask({
                    channel: other.channel,
                    mask: other.mask,
                });
            }
            else if (type === 'multiply') {
                return new fabric_1.fabric.Image.filters.Multiply({
                    color: other.color,
                });
            }
            else if (type === 'sepia2') {
                return new fabric_1.fabric.Image.filters.Sepia2(other);
            }
            return false;
        };
        /**
         * Create filter by types
         * @param {IFilter[]} filters
         */
        this.createFilters = (filters) => {
            const createdFilters = filters.reduce((prev, filter) => {
                let type = filter.type;
                if (type.toLowerCase() === 'convolute' && isEqual_1.default(filter.matrix, SHARPEN_MATRIX)) {
                    type = 'sharpen';
                }
                else if (type.toLowerCase() === 'convolute' && isEqual_1.default(filter.matrix, EMBOSS_MATRIX)) {
                    type = 'emboss';
                }
                const findIndex = exports.FILTER_TYPES.findIndex(filterType => type.toLowerCase() === filterType);
                if (findIndex > -1) {
                    prev[findIndex] = this.createFilter({
                        ...filter,
                        type,
                    });
                }
                return prev;
            }, []);
            return createdFilters;
        };
        /**
         * Apply filter by type
         * @param {string} type
         * @param {*} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyFilterByType = (type, apply = true, value, imageObj) => {
            const obj = imageObj || this.handler.canvas.getActiveObject();
            const findIndex = exports.FILTER_TYPES.findIndex(ft => ft === type);
            if (obj.filters && findIndex > -1) {
                if (apply) {
                    obj.filters[findIndex] = this.createFilter({
                        type,
                        ...value,
                    });
                    obj.applyFilters();
                }
                else {
                    obj.filters[findIndex] = false;
                    obj.applyFilters();
                }
                this.handler.canvas.requestRenderAll();
            }
        };
        /**
         * Apply filter in image
         * @param {fabric.Image} [imageObj]
         * @param {number} index
         * @param {fabric.IBaseFilter} filter
         */
        this.applyFilter = (index, filter, imageObj) => {
            const obj = imageObj || this.handler.canvas.getActiveObject();
            if (obj.filters) {
                obj.filters[index] = filter;
                obj.applyFilters();
                this.handler.canvas.requestRenderAll();
            }
        };
        /**
         * Apply filter value in image
         * @param {fabric.Image} [imageObj]
         * @param {number} index
         * @param {string} prop
         * @param {any} value
         */
        this.applyFilterValue = (index, prop, value, imageObj) => {
            const obj = imageObj || this.handler.canvas.getActiveObject();
            if (obj.filters) {
                const filter = obj.filters[index];
                if (filter) {
                    filter.setOptions({
                        [prop]: value,
                    });
                    obj.applyFilters();
                    this.handler.canvas.requestRenderAll();
                }
            }
        };
        /**
         * Apply grayscale in image
         * @param {fabric.Image} [imageObj]
         * @param {boolean} [grayscale=false]
         * @param {GrayscaleModeType} [value]
         */
        this.applyGrayscale = (grayscale = false, value, imageObj) => {
            this.applyFilter(0, grayscale &&
                new fabric_1.fabric.Image.filters.Grayscale(value
                    ? {
                        mode: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply invert in image
         * @param {fabric.Image} [imageObj]
         * @param {boolean} [invert=false]
         */
        this.applyInvert = (invert = false, imageObj) => {
            this.applyFilter(1, invert && new fabric_1.fabric.Image.filters.Invert(), imageObj);
        };
        /**
         * Apply remove color in image
         * @param {fabric.Image} [imageObj]
         * @param {boolean} [removeColor=false]
         * @param {RemoveColorFilter} [value]
         */
        // public applyRemoveColor = (removeColor = false, value?: RemoveColorFilter, imageObj?: fabric.Image): void => {
        //     this.applyFilter(2, removeColor && new fabric.Image.filters.RemoveColor(value), imageObj);
        // }
        /**
         * Apply sepia in image
         * @param {fabric.Image} [imageObj]
         * @param {boolean} [sepia=false]
         */
        this.applySepia = (sepia = false, imageObj) => {
            this.applyFilter(3, sepia && new fabric_1.fabric.Image.filters.Sepia(), imageObj);
        };
        /**
         * Apply brownie in image
         * @param {boolean} [brownie=false]
         * @param {fabric.Image} [imageObj]
         */
        // public applyBrownie = (brownie = false, imageObj?: fabric.Image): void => {
        //     this.applyFilter(4, brownie && new fabric.Image.filters.Brownie(), imageObj);
        // }
        /**
         * Apply brightness in image
         * @param {boolean} [brightness=false]
         * @param {number} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyBrightness = (brightness = false, value, imageObj) => {
            this.applyFilter(5, brightness &&
                new fabric_1.fabric.Image.filters.Brightness(value
                    ? {
                        brightness: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply contrast in image
         * @param {boolean} [contrast=false]
         * @param {number} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyContrast = (contrast = false, value, imageObj) => {
            this.applyFilter(6, contrast &&
                new fabric_1.fabric.Image.filters.Contrast(value
                    ? {
                        contrast: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply saturation in image
         * @param {boolean} [saturation=false]
         * @param {number} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applySaturation = (saturation = false, value, imageObj) => {
            this.applyFilter(7, saturation &&
                new fabric_1.fabric.Image.filters.Saturation(value
                    ? {
                        saturation: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply noise in image
         * @param {boolean} [noise=false]
         * @param {number} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyNoise = (noise = false, value, imageObj) => {
            this.applyFilter(8, noise &&
                new fabric_1.fabric.Image.filters.Noise(value
                    ? {
                        noise: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply vintage in image
         * @param {boolean} [vintage=false]
         * @param {fabric.Image} [imageObj]
         */
        // public applyVintage = (vintage = false, imageObj?: fabric.Image): void => {
        //     this.applyFilter(9, vintage && new fabric.Image.filters.Vintage(), imageObj);
        // }
        /**
         * Apply pixelate in image
         * @param {boolean} [pixelate=false]
         * @param {number} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyPixelate = (pixelate = false, value, imageObj) => {
            this.applyFilter(10, pixelate &&
                new fabric_1.fabric.Image.filters.Pixelate(value
                    ? {
                        blocksize: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply blur in image
         * @param {boolean} [blur=false]
         * @param {number} [value]
         * @param {fabric.Image} imageObj
         */
        // public applyBlur = (blur = false, value?: number, imageObj?: fabric.Image): void => {
        //     this.applyFilter(11, blur && new fabric.Image.filters.Blur(value ? {
        //         value,
        //     } : undefined), imageObj);
        // }
        /**
         * Apply sharpen in image
         * @param {boolean} [sharpen=false]
         * @param {number[]} [value=[0, -1,  0, -1,  5, -1, 0, -1,  0]]
         * @param {fabric.Image} [imageObj]
         */
        this.applySharpen = (sharpen = false, value = SHARPEN_MATRIX, imageObj) => {
            this.applyFilter(12, sharpen &&
                new fabric_1.fabric.Image.filters.Convolute(value
                    ? {
                        matrix: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply emboss in image
         * @param {boolean} [emboss=false]
         * @param {number[]} [value=[1, 1, 1, 1, 0.7, -1, -1, -1, -1]]
         * @param {fabric.Image} [imageObj]
         */
        this.applyEmboss = (emboss = false, value = EMBOSS_MATRIX, imageObj) => {
            this.applyFilter(13, emboss &&
                new fabric_1.fabric.Image.filters.Convolute(value
                    ? {
                        matrix: value,
                    }
                    : undefined), imageObj);
        };
        /**
         * Apply technicolor in image
         * @param {boolean} [technicolor=false]
         * @param {fabric.Image} [imageObj]
         */
        // public applyTechnicolor = (technicolor = false, imageObj?: fabric.Image): void => {
        //     this.applyFilter(14, technicolor && new fabric.Image.filters.Technicolor(), imageObj);
        // }
        /**
         * Apply polaroid in image
         * @param {boolean} [polaroid=false]
         * @param {fabric.Image} [imageObj]
         */
        // public applyPolaroid = (polaroid = false, imageObj?: fabric.Image): void => {
        //     this.applyFilter(15, polaroid && new fabric.Image.filters.Polaroid(), imageObj);
        // }
        /**
         * Apply blend color in image
         * @param {boolean} [blend=false]
         * @param {BlendColorFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyBlendColor = (blend = false, value, imageObj) => {
            this.applyFilter(16, blend && new fabric_1.fabric.Image.filters.BlendColor(value), imageObj);
        };
        /**
         * Apply gamma in image
         * @param {boolean} [gamma=false]
         * @param {GammaFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        // public applyGamma = (gamma = false, value?: GammaFilter, imageObj?: fabric.Image): void => {
        //     this.applyFilter(17, gamma && new fabric.Image.filters.Gamma(value), imageObj);
        // }
        /**
         * Apply kodachrome in image
         * @param {boolean} [kodachrome=false]
         * @param {fabric.Image} [imageObj]
         */
        // public applyKodachrome = (kodachrome = false, imageObj?: fabric.Image): void => {
        //     this.applyFilter(18, kodachrome && new fabric.Image.filters.Kodachrome(), imageObj);
        // }
        /**
         * Apply black white in image
         * @param {boolean} [blackWhite=false]
         * @param {fabric.Image} [imageObj]
         */
        // public applyBlackWhite = (blackWhite = false, imageObj?: fabric.Image): void => {
        //     this.applyFilter(19, blackWhite && new fabric.Image.filters.BlackWhite(), imageObj);
        // }
        /**
         * Apply blend image in image
         * @param {boolean} [blendImage=false]
         * @param {BlendImageFilter} value
         * @param {fabric.Image} [imageObj]
         */
        this.applyBlendImage = (blendImage = false, value, imageObj) => {
            this.applyFilter(20, blendImage && new fabric_1.fabric.Image.filters.BlendImage(value), imageObj);
        };
        /**
         * Apply hue rotation in image
         * @param {boolean} [hue=false]
         * @param {HueRotationFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        // public applyHue = (hue = false, value?: HueRotationFilter, imageObj?: fabric.Image): void => {
        //     this.applyFilter(21, hue && new fabric.Image.filters.HueRotation(value ? {
        //         rotation: value,
        //     } : undefined), imageObj);
        // }
        /**
         * Apply resize in image
         * @param {boolean} [resize=false]
         * @param {ResizeFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyResize = (resize = false, value, imageObj) => {
            this.applyFilter(22, resize && new fabric_1.fabric.Image.filters.Resize(value), imageObj);
        };
        /**
         * Apply tint in image
         * @param {boolean} [tint=false]
         * @param {TintFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyTint = (tint = false, value, imageObj) => {
            this.applyFilter(23, tint && new fabric_1.fabric.Image.filters.Tint(value), imageObj);
        };
        /**
         * Apply mask in image
         * @param {boolean} [mask=false]
         * @param {MaskFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyMask = (mask = false, value, imageObj) => {
            this.applyFilter(24, mask && new fabric_1.fabric.Image.filters.Mask(value), imageObj);
        };
        /**
         * Apply multiply in image
         * @param {boolean} [multiply=false]
         * @param {MultiplyFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyMultiply = (multiply = false, value, imageObj) => {
            this.applyFilter(25, multiply && new fabric_1.fabric.Image.filters.Multiply(value), imageObj);
        };
        /**
         * Apply sepia2 in image
         * @param {boolean} [sepia2=false]
         * @param {fabric.Image} [imageObj]
         */
        this.applySepia2 = (sepia2 = false, imageObj) => {
            this.applyFilter(26, sepia2 && new fabric_1.fabric.Image.filters.Sepia2(), imageObj);
        };
        /**
         * Apply gradient transparency in image
         * @param {boolean} [gradientTransparency=false]
         * @param {GradientTransparencyFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyGradientTransparency = (gradientTransparency = false, value, imageObj) => {
            this.applyFilter(27, gradientTransparency && new fabric_1.fabric.Image.filters.GradientTransparency(value), imageObj);
        };
        /**
         * Apply color matrix in image
         * @param {boolean} [colorMatrix=false]
         * @param {ColorMatrixFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyColorMatrix = (colorMatrix = false, value, imageObj) => {
            this.applyFilter(28, colorMatrix && new fabric_1.fabric.Image.filters.ColorMatrix(value), imageObj);
        };
        /**
         * Apply remove white in image
         * @param {boolean} [removeWhite=false]
         * @param {RemoveWhiteFilter} [value]
         * @param {fabric.Image} [imageObj]
         */
        this.applyRemoveWhite = (removeWhite = false, value, imageObj) => {
            this.applyFilter(29, removeWhite && new fabric_1.fabric.Image.filters.RemoveWhite(value), imageObj);
        };
        this.handler = handler;
    }
}
exports.default = ImageHandler;
