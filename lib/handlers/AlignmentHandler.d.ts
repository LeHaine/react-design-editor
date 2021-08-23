import Handler from './Handler';
declare class AlignmentHandler {
    handler: Handler;
    constructor(handler: Handler);
    /**
     * Align left at selection
     */
    left: () => void;
    /**
     * Align center at selection
     */
    center: () => void;
    /**
     * Align right at selection
     */
    right: () => void;
}
export default AlignmentHandler;
