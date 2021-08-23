"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const fabric_1 = require("fabric");
const uuid_1 = require("uuid");
const resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));
const Handler_1 = __importDefault(require("./handlers/Handler"));
const constants_1 = require("./constants");
require("../../styles/core/canvas.less");
require("../../styles/core/tooltip.less");
require("../../styles/core/contextmenu.less");
require("../../styles/fabricjs/fabricjs.less");
class Canvas extends react_1.Component {
    constructor() {
        super(...arguments);
        this.container = react_1.default.createRef();
        this.state = {
            id: uuid_1.v4(),
            loaded: false,
        };
        this.createObserver = () => {
            this.resizeObserver = new resize_observer_polyfill_1.default((entries) => {
                const { width = 0, height = 0 } = (entries[0] && entries[0].contentRect) || {};
                var newWidth = width;
                if (this.props.width > 0 && newWidth > this.props.width) {
                    newWidth = this.props.width;
                }
                var newHeight = height;
                if (this.props.height > 0 && newHeight > this.props.height) {
                    newHeight = this.props.height;
                }
                this.handler.eventHandler.resize(newWidth, newHeight);
                if (!this.state.loaded) {
                    this.handleLoad();
                }
            });
            this.resizeObserver.observe(this.container.current);
        };
        this.destroyObserver = () => {
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
                this.resizeObserver = null;
            }
        };
        this.handleLoad = () => {
            this.setState({
                loaded: true,
            }, () => {
                if (this.props.onLoad) {
                    this.props.onLoad(this.handler, this.canvas);
                }
            });
        };
    }
    componentDidMount() {
        const { editable, canvasOption, width, height, responsive, ...other } = this.props;
        const { id } = this.state;
        const mergedCanvasOption = Object.assign({}, constants_1.defaults.canvasOption, canvasOption, {
            width,
            height,
            selection: editable,
        });
        this.canvas = new fabric_1.fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
        this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
        this.canvas.renderAll();
        this.handler = new Handler_1.default({
            id,
            width,
            height,
            editable,
            canvas: this.canvas,
            container: this.container.current,
            canvasOption: mergedCanvasOption,
            ...other,
        });
        if (this.props.responsive) {
            this.createObserver();
        }
        else {
            this.handleLoad();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.handler.eventHandler.resize(this.props.width, this.props.height);
        }
        if (this.props.editable !== prevProps.editable) {
            this.handler.editable = this.props.editable;
        }
        if (this.props.responsive !== prevProps.responsive) {
            if (!this.props.responsive) {
                this.destroyObserver();
            }
            else {
                this.destroyObserver();
                this.createObserver();
            }
        }
        if (JSON.stringify(this.props.canvasOption) !== JSON.stringify(prevProps.canvasOption)) {
            this.handler.setCanvasOption(this.props.canvasOption);
        }
        if (JSON.stringify(this.props.keyEvent) !== JSON.stringify(prevProps.keyEvent)) {
            this.handler.setKeyEvent(this.props.keyEvent);
        }
        if (JSON.stringify(this.props.fabricObjects) !== JSON.stringify(prevProps.fabricObjects)) {
            this.handler.setFabricObjects(this.props.fabricObjects);
        }
        if (JSON.stringify(this.props.workareaOption) !== JSON.stringify(prevProps.workareaOption)) {
            this.handler.setWorkareaOption(this.props.workareaOption);
        }
        if (JSON.stringify(this.props.guidelineOption) !== JSON.stringify(prevProps.guidelineOption)) {
            this.handler.setGuidelineOption(this.props.guidelineOption);
        }
        if (JSON.stringify(this.props.objectOption) !== JSON.stringify(prevProps.objectOption)) {
            this.handler.setObjectOption(this.props.objectOption);
        }
        if (JSON.stringify(this.props.gridOption) !== JSON.stringify(prevProps.gridOption)) {
            this.handler.setGridOption(this.props.gridOption);
        }
        if (JSON.stringify(this.props.propertiesToInclude) !== JSON.stringify(prevProps.propertiesToInclude)) {
            this.handler.setPropertiesToInclude(this.props.propertiesToInclude);
        }
        if (JSON.stringify(this.props.activeSelectionOption) !== JSON.stringify(prevProps.activeSelectionOption)) {
            this.handler.setActiveSelectionOption(this.props.activeSelectionOption);
        }
    }
    componentWillUnmount() {
        this.destroyObserver();
        this.handler.destroy();
    }
    render() {
        const { style } = this.props;
        const { id } = this.state;
        return (react_1.default.createElement("div", { ref: this.container, id: id, className: "rde-canvas", style: { width: '100%', height: '100%', ...style } },
            react_1.default.createElement("canvas", { id: `canvas_${id}` })));
    }
}
Canvas.defaultProps = {
    id: uuid_1.v4(),
    editable: true,
    zoomEnabled: true,
    minZoom: 30,
    maxZoom: 300,
    responsive: true,
    width: 0,
    height: 0,
};
exports.default = Canvas;
