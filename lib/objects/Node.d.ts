import { fabric } from 'fabric';
import { FabricObject } from '../utils';
import { PortObject } from './Port';
export declare const NODE_COLORS: {
    TRIGGER: {
        fill: string;
        border: string;
    };
    LOGIC: {
        fill: string;
        border: string;
    };
    DATA: {
        fill: string;
        border: string;
    };
    ACTION: {
        fill: string;
        border: string;
    };
};
export declare const OUT_PORT_TYPE: {
    SINGLE: string;
    STATIC: string;
    DYNAMIC: string;
    BROADCAST: string;
    NONE: string;
};
export declare const DESCRIPTIONS: {
    script: string;
    template: string;
    json: string;
    cron: string;
};
export declare const getEllipsis: (text: string, length: number) => string;
export declare type NodeType = 'TRIGGER' | 'LOGIC' | 'DATA' | 'ACTION';
export interface NodeObject extends FabricObject<fabric.Group> {
    errorFlag?: fabric.IText;
    label?: fabric.Text;
    toPort?: PortObject;
    errors?: any;
    fromPort?: PortObject[];
    descriptor?: Record<string, any>;
    nodeClazz?: string;
    configuration?: Record<string, any>;
    defaultPortOption?: () => Partial<PortObject>;
    toPortOption?: () => Partial<PortObject>;
    fromPortOption?: () => Partial<PortObject>;
    createToPort?: (left: number, top: number) => PortObject;
    createFromPort?: (left: number, top: number) => PortObject[];
    singlePort?: (portOption: Partial<PortObject>) => PortObject[];
    staticPort?: (portOption: Partial<PortObject>) => PortObject[];
    dynamicPort?: (portOption: Partial<PortObject>) => PortObject[];
    broadcastPort?: (portOption: Partial<PortObject>) => PortObject[];
    setErrors?: (errors: any) => void;
    duplicate?: () => NodeObject;
}
declare const Node: any;
export default Node;
