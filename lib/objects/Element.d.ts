import { FabricElement } from '../utils';
export interface Code {
    html: string;
    css: string;
    js: string;
}
export interface ElementObject extends FabricElement {
    setSource: (source: Code) => void;
    setCode: (code: Code) => void;
    code: Code;
}
declare const Element: any;
export default Element;
