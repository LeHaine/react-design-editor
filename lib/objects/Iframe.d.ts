import { FabricElement } from '../utils';
export interface IframeObject extends FabricElement {
    setSource: (source: string) => void;
    setSrc: (src: string) => void;
    src: string;
    iframeElement: HTMLIFrameElement;
}
declare const Iframe: any;
export default Iframe;
