"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesToInclude = exports.activeSelectionOption = exports.guidelineOption = exports.objectOption = exports.workareaOption = exports.gridOption = exports.keyEvent = exports.canvasOption = void 0;
exports.canvasOption = {
    preserveObjectStacking: true,
    width: 300,
    height: 150,
    selection: true,
    defaultCursor: 'default',
    backgroundColor: '#f3f3f3',
};
exports.keyEvent = {
    move: true,
    all: true,
    copy: true,
    paste: true,
    esc: true,
    del: true,
    clipboard: false,
    transaction: true,
    zoom: true,
    cut: true,
};
exports.gridOption = {
    enabled: false,
    grid: 10,
    snapToGrid: false,
    lineColor: '#ebebeb',
    borderColor: '#cccccc',
};
exports.workareaOption = {
    width: 600,
    height: 400,
    workareaWidth: 600,
    workareaHeight: 400,
    lockScalingX: true,
    lockScalingY: true,
    scaleX: 1,
    scaleY: 1,
    backgroundColor: '#fff',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    name: '',
    id: 'workarea',
    type: 'image',
    layout: 'fixed',
    link: {},
    tooltip: {
        enabled: false,
    },
    isElement: false,
};
exports.objectOption = {
    rotation: 0,
    centeredRotation: true,
    strokeUniform: true,
};
exports.guidelineOption = {
    enabled: true,
};
exports.activeSelectionOption = {
    hasControls: true,
};
exports.propertiesToInclude = ['id', 'name', 'locked', 'editable'];
