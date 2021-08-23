"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanvasObject = void 0;
const fabric_1 = require("fabric");
const objects_1 = require("./objects");
const Svg_1 = __importDefault(require("./objects/Svg"));
exports.createCanvasObject = (objectSchema) => objectSchema;
const CanvasObject = {
    group: {
        create: ({ objects, ...option }) => new fabric_1.fabric.Group(objects, option),
    },
    'i-text': {
        create: ({ text, ...option }) => new fabric_1.fabric.IText(text, option),
    },
    textbox: {
        create: ({ text, ...option }) => new fabric_1.fabric.Textbox(text, option),
    },
    triangle: {
        create: (option) => new fabric_1.fabric.Triangle(option),
    },
    circle: {
        create: (option) => new fabric_1.fabric.Circle(option),
    },
    rect: {
        create: (option) => new fabric_1.fabric.Rect(option),
    },
    cube: {
        create: (option) => new objects_1.Cube(option),
    },
    image: {
        create: ({ element = new Image(), ...option }) => new fabric_1.fabric.Image(element, {
            ...option,
            crossOrigin: 'anonymous',
        }),
    },
    polygon: {
        create: ({ points, ...option }) => new fabric_1.fabric.Polygon(points, {
            ...option,
            perPixelTargetFind: true,
        }),
    },
    line: {
        create: ({ points, ...option }) => new objects_1.Line(points, option),
    },
    path: {
        create: ({ path, ...option }) => new objects_1.Path(path, option),
    },
    arrow: {
        create: ({ points, ...option }) => new objects_1.Arrow(points, option),
    },
    chart: {
        create: (option) => new objects_1.Chart(option.chartOption || {
            xAxis: {},
            yAxis: {},
            series: [
                {
                    type: 'line',
                    data: [
                        [0, 1],
                        [1, 2],
                        [2, 3],
                        [3, 4],
                    ],
                },
            ],
        }, option),
    },
    element: {
        create: ({ code, ...option }) => new objects_1.Element(code, option),
    },
    iframe: {
        create: ({ src, ...option }) => new objects_1.Iframe(src, option),
    },
    video: {
        create: ({ src, file, ...option }) => new objects_1.Video(src || file, option),
    },
    gif: {
        create: (option) => new objects_1.Gif(option),
    },
    node: {
        create: (option) => new objects_1.Node(option),
    },
    link: {
        create: (fromNode, fromPort, toNode, toPort, option) => new objects_1.Link(fromNode, fromPort, toNode, toPort, option),
    },
    curvedLink: {
        create: (fromNode, fromPort, toNode, toPort, option) => new objects_1.CurvedLink(fromNode, fromPort, toNode, toPort, option),
    },
    orthogonalLink: {
        create: (fromNode, fromPort, toNode, toPort, option) => new objects_1.OrthogonalLink(fromNode, fromPort, toNode, toPort, option),
    },
    svg: {
        create: (option) => new Svg_1.default(option),
    },
};
exports.default = CanvasObject;
