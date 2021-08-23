import * as echarts from 'echarts';
import Handler from './Handler';
declare class ChartHandler {
    handler?: Handler;
    instance?: echarts.ECharts;
    constructor(handler: Handler);
}
export default ChartHandler;
