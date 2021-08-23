import React, { Component } from 'react';
import Handler, { HandlerOptions } from './handlers/Handler';
import { FabricCanvas } from './utils';
import '../../styles/core/canvas.less';
import '../../styles/core/tooltip.less';
import '../../styles/core/contextmenu.less';
import '../../styles/fabricjs/fabricjs.less';
export declare type CanvasProps = HandlerOptions & {
    responsive?: boolean;
    style?: React.CSSProperties;
    ref?: React.RefAttributes<Handler>;
};
interface IState {
    id: string;
    loaded: boolean;
}
declare class Canvas extends Component<CanvasProps, IState> {
    handler: Handler;
    canvas: FabricCanvas;
    container: React.RefObject<HTMLDivElement>;
    private resizeObserver;
    static defaultProps: CanvasProps;
    state: IState;
    componentDidMount(): void;
    componentDidUpdate(prevProps: CanvasProps): void;
    componentWillUnmount(): void;
    createObserver: () => void;
    destroyObserver: () => void;
    handleLoad: () => void;
    render(): JSX.Element;
}
export default Canvas;
