import { FabricObject, FabricObjectOption, FabricGroup } from '../utils';
export declare type SvgObject = FabricGroup | FabricObject;
export interface SvgOption extends FabricObjectOption {
    svg?: string;
    loadType?: 'file' | 'svg';
}
declare const Svg: any;
export default Svg;
