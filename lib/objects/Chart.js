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
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const echarts = __importStar(require("echarts"));
const utils_1 = require("../utils");
const Chart = fabric_1.fabric.util.createClass(fabric_1.fabric.Rect, {
    type: 'chart',
    superType: 'element',
    hasRotatingPoint: false,
    initialize(chartOption, options) {
        options = options || {};
        this.callSuper('initialize', options);
        this.set({
            chartOption,
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        });
    },
    setSource(source) {
        if (typeof source === 'string') {
            this.setChartOptionStr(source);
        }
        else {
            this.setChartOption(source);
        }
    },
    setChartOptionStr(chartOptionStr) {
        this.set({
            chartOptionStr,
        });
    },
    setChartOption(chartOption) {
        this.set({
            chartOption,
        });
        this.distroyChart();
        this.createChart(chartOption);
    },
    createChart(chartOption) {
        this.instance = echarts.init(this.element);
        if (!chartOption) {
            this.instance.setOption({
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
            });
        }
        else {
            this.instance.setOption(chartOption);
        }
    },
    distroyChart() {
        if (this.instance) {
            this.instance.dispose();
        }
    },
    toObject(propertiesToInclude) {
        return utils_1.toObject(this, propertiesToInclude, {
            chartOption: this.get('chartOption'),
            container: this.get('container'),
            editable: this.get('editable'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        if (!this.instance) {
            const { id, scaleX, scaleY, width, height, angle, editable, chartOption } = this;
            const zoom = this.canvas.getZoom();
            const left = this.calcCoords().tl.x;
            const top = this.calcCoords().tl.y;
            const padLeft = (width * scaleX * zoom - width) / 2;
            const padTop = (height * scaleY * zoom - height) / 2;
            this.element = fabric_1.fabric.util.makeElement('div', {
                id: `${id}_container`,
                style: `transform: rotate(${angle}deg) scale(${scaleX * zoom}, ${scaleY * zoom});
                        width: ${width}px;
                        height: ${height}px;
                        left: ${left + padLeft}px;
                        top: ${top + padTop}px;
                        position: absolute;
                        user-select: ${editable ? 'none' : 'auto'};
                        pointer-events: ${editable ? 'none' : 'auto'};`,
            });
            this.createChart(chartOption);
            const container = document.getElementById(this.container);
            container.appendChild(this.element);
        }
    },
});
Chart.fromObject = (options, callback) => {
    return callback(new Chart(options.chartOption, options));
};
window.fabric.Chart = Chart;
exports.default = Chart;
