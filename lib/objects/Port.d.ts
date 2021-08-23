import { fabric } from 'fabric';
import { FabricObject } from '../utils';
import { LinkObject } from './Link';
export interface PortObject extends FabricObject<fabric.Rect> {
    links?: LinkObject[];
    nodeId?: string;
    enabled?: boolean;
    hoverFill?: string;
    selectFill?: string;
}
declare const Port: any;
export default Port;
