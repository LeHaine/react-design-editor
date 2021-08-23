import * as echarts from 'echarts';
import { FabricElement } from '../utils';
export interface ChartObject extends FabricElement {
    setSource: (source: echarts.EChartOption) => void;
    setChartOption: (chartOption: echarts.EChartOption) => void;
    chartOption: echarts.EChartOption;
    instance: echarts.ECharts;
}
declare const Chart: any;
export default Chart;
