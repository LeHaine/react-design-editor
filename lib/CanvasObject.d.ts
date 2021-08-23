import { fabric } from 'fabric';
export interface ObjectSchema {
    create: (...option: any) => fabric.Object;
}
export interface CanvasObjectSchema {
    [key: string]: ObjectSchema;
}
export declare const createCanvasObject: (objectSchema: CanvasObjectSchema) => CanvasObjectSchema;
declare const CanvasObject: CanvasObjectSchema;
export default CanvasObject;
