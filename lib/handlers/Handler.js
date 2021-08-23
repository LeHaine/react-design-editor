"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
const warning_1 = __importDefault(require("warning"));
const uuid_1 = require("uuid");
const lodash_1 = require("lodash");
const _1 = require(".");
const CanvasObject_1 = __importDefault(require("../CanvasObject"));
const constants_1 = require("../constants");
/**
 * Main handler for Canvas
 * @class Handler
 * @implements {HandlerOptions}
 */
class Handler {
    constructor(options) {
        this.propertiesToInclude = constants_1.defaults.propertiesToInclude;
        this.workareaOption = constants_1.defaults.workareaOption;
        this.canvasOption = constants_1.defaults.canvasOption;
        this.gridOption = constants_1.defaults.gridOption;
        this.objectOption = constants_1.defaults.objectOption;
        this.guidelineOption = constants_1.defaults.guidelineOption;
        this.keyEvent = constants_1.defaults.keyEvent;
        this.activeSelectionOption = constants_1.defaults.activeSelectionOption;
        this.fabricObjects = CanvasObject_1.default;
        this.objectMap = {};
        this.zoom = 1;
        this.isCut = false;
        this.isRequsetAnimFrame = false;
        /**
         * Init class fields
         * @param {HandlerOptions} options
         */
        this.initOption = (options) => {
            this.id = options.id;
            this.canvas = options.canvas;
            this.container = options.container;
            this.editable = options.editable;
            this.interactionMode = options.interactionMode;
            this.minZoom = options.minZoom;
            this.maxZoom = options.maxZoom;
            this.zoomEnabled = options.zoomEnabled;
            this.width = options.width;
            this.height = options.height;
            this.objects = [];
            this.setPropertiesToInclude(options.propertiesToInclude);
            this.setWorkareaOption(options.workareaOption);
            this.setCanvasOption(options.canvasOption);
            this.setGridOption(options.gridOption);
            this.setObjectOption(options.objectOption);
            this.setFabricObjects(options.fabricObjects);
            this.setGuidelineOption(options.guidelineOption);
            this.setActiveSelectionOption(options.activeSelectionOption);
            this.setKeyEvent(options.keyEvent);
        };
        /**
         * Initialize callback
         * @param {HandlerOptions} options
         */
        this.initCallback = (options) => {
            this.onAdd = options.onAdd;
            this.onTooltip = options.onTooltip;
            this.onZoom = options.onZoom;
            this.onContext = options.onContext;
            this.onClick = options.onClick;
            this.onModified = options.onModified;
            this.onDblClick = options.onDblClick;
            this.onSelect = options.onSelect;
            this.onRemove = options.onRemove;
            this.onTransaction = options.onTransaction;
            this.onInteraction = options.onInteraction;
            this.onLoad = options.onLoad;
        };
        /**
         * Initialize handlers
         *
         */
        this.initHandler = () => {
            this.workareaHandler = new _1.WorkareaHandler(this);
            this.imageHandler = new _1.ImageHandler(this);
            this.chartHandler = new _1.ChartHandler(this);
            this.elementHandler = new _1.ElementHandler(this);
            this.cropHandler = new _1.CropHandler(this);
            this.animationHandler = new _1.AnimationHandler(this);
            this.contextmenuHandler = new _1.ContextmenuHandler(this);
            this.tooltipHandler = new _1.TooltipHandler(this);
            this.zoomHandler = new _1.ZoomHandler(this);
            this.interactionHandler = new _1.InteractionHandler(this);
            this.transactionHandler = new _1.TransactionHandler(this);
            this.gridHandler = new _1.GridHandler(this);
            this.portHandler = new _1.PortHandler(this);
            this.linkHandler = new _1.LinkHandler(this);
            this.nodeHandler = new _1.NodeHandler(this);
            this.alignmentHandler = new _1.AlignmentHandler(this);
            this.guidelineHandler = new _1.GuidelineHandler(this);
            this.eventHandler = new _1.EventHandler(this);
            this.drawingHandler = new _1.DrawingHandler(this);
            this.shortcutHandler = new _1.ShortcutHandler(this);
        };
        /**
         * Get primary object
         * @returns {FabricObject[]}
         */
        this.getObjects = () => {
            const objects = this.canvas.getObjects().filter((obj) => {
                if (obj.id === 'workarea') {
                    return false;
                }
                else if (obj.id === 'grid') {
                    return false;
                }
                else if (obj.superType === 'port') {
                    return false;
                }
                else if (!obj.id) {
                    return false;
                }
                return true;
            });
            if (objects.length) {
                objects.forEach(obj => (this.objectMap[obj.id] = obj));
            }
            else {
                this.objectMap = {};
            }
            return objects;
        };
        /**
         * Set key pair
         * @param {keyof FabricObject} key
         * @param {*} value
         * @returns
         */
        this.set = (key, value) => {
            const activeObject = this.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            activeObject.set(key, value);
            activeObject.setCoords();
            this.canvas.requestRenderAll();
            const { id, superType, type, player, width, height } = activeObject;
            if (superType === 'element') {
                if (key === 'visible') {
                    if (value) {
                        activeObject.element.style.display = 'block';
                    }
                    else {
                        activeObject.element.style.display = 'none';
                    }
                }
                const el = this.elementHandler.findById(id);
                // update the element
                this.elementHandler.setScaleOrAngle(el, activeObject);
                this.elementHandler.setSize(el, activeObject);
                this.elementHandler.setPosition(el, activeObject);
                if (type === 'video' && player) {
                    player.setPlayerSize(width, height);
                }
            }
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        };
        /**
         * Set option
         * @param {Partial<FabricObject>} option
         * @returns
         */
        this.setObject = (option) => {
            const activeObject = this.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            Object.keys(option).forEach(key => {
                if (option[key] !== activeObject[key]) {
                    activeObject.set(key, option[key]);
                    activeObject.setCoords();
                }
            });
            this.canvas.requestRenderAll();
            const { id, superType, type, player, width, height } = activeObject;
            if (superType === 'element') {
                if ('visible' in option) {
                    if (option.visible) {
                        activeObject.element.style.display = 'block';
                    }
                    else {
                        activeObject.element.style.display = 'none';
                    }
                }
                const el = this.elementHandler.findById(id);
                // update the element
                this.elementHandler.setScaleOrAngle(el, activeObject);
                this.elementHandler.setSize(el, activeObject);
                this.elementHandler.setPosition(el, activeObject);
                if (type === 'video' && player) {
                    player.setPlayerSize(width, height);
                }
            }
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        };
        this.saveProps = () => {
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('propschange');
            }
        };
        /**
         * Set key pair by object
         * @param {FabricObject} obj
         * @param {string} key
         * @param {*} value
         * @returns
         */
        this.setByObject = (obj, key, value) => {
            if (!obj) {
                return;
            }
            obj.set(key, value);
            obj.setCoords();
            this.canvas.renderAll();
            const { id, superType, type, player, width, height } = obj;
            if (superType === 'element') {
                if (key === 'visible') {
                    if (value) {
                        obj.element.style.display = 'block';
                    }
                    else {
                        obj.element.style.display = 'none';
                    }
                }
                const el = this.elementHandler.findById(id);
                // update the element
                this.elementHandler.setScaleOrAngle(el, obj);
                this.elementHandler.setSize(el, obj);
                this.elementHandler.setPosition(el, obj);
                if (type === 'video' && player) {
                    player.setPlayerSize(width, height);
                }
            }
            const { onModified } = this;
            if (onModified) {
                onModified(obj);
            }
        };
        /**
         * Set key pair by id
         * @param {string} id
         * @param {string} key
         * @param {*} value
         */
        this.setById = (id, key, value) => {
            const findObject = this.findById(id);
            this.setByObject(findObject, key, value);
        };
        /**
         * Set partial by object
         * @param {FabricObject} obj
         * @param {FabricObjectOption} option
         * @returns
         */
        this.setByPartial = (obj, option) => {
            if (!obj) {
                return;
            }
            obj.set(option);
            obj.setCoords();
            this.canvas.renderAll();
            const { id, superType, type, player, width, height } = obj;
            if (superType === 'element') {
                if ('visible' in option) {
                    if (option.visible) {
                        obj.element.style.display = 'block';
                    }
                    else {
                        obj.element.style.display = 'none';
                    }
                }
                const el = this.elementHandler.findById(id);
                // update the element
                this.elementHandler.setScaleOrAngle(el, obj);
                this.elementHandler.setSize(el, obj);
                this.elementHandler.setPosition(el, obj);
                if (type === 'video' && player) {
                    player.setPlayerSize(width, height);
                }
            }
        };
        /**
         * Set partial by id
         * @param {string} id
         * @param {FabricObjectOption} option
         * @returns
         */
        this.setByPartialId = (id, option) => {
            const findObject = this.findById(id);
            this.setByPartial(findObject, option);
        };
        /**
         * Set shadow
         * @param {fabric.Shadow} option
         * @returns
         */
        this.setShadow = (option) => {
            const activeObject = this.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            activeObject.setShadow(option);
            this.canvas.requestRenderAll();
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        };
        /**
         * Set the image
         * @param {FabricImage} obj
         * @param {(File | string)} [source]
         * @returns
         */
        this.setImage = (obj, source) => {
            if (!source) {
                this.loadImage(obj, null);
                obj.set('file', null);
                obj.set('src', null);
                return;
            }
            if (source instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.loadImage(obj, reader.result);
                    obj.set('file', source);
                    obj.set('src', null);
                };
                reader.readAsDataURL(source);
            }
            else {
                this.loadImage(obj, source);
                obj.set('file', null);
                obj.set('src', source);
            }
        };
        /**
         * Set image by id
         * @param {string} id
         * @param {*} source
         */
        this.setImageById = (id, source) => {
            const findObject = this.findById(id);
            this.setImage(findObject, source);
        };
        /**
         * Set visible
         * @param {boolean} [visible]
         * @returns
         */
        this.setVisible = (visible) => {
            const activeObject = this.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            if (activeObject.superType === 'element') {
                if (visible) {
                    activeObject.element.style.display = 'block';
                }
                else {
                    activeObject.element.style.display = 'none';
                }
            }
            activeObject.set({
                visible,
            });
            this.canvas.renderAll();
        };
        /**
         * Set the position on Object
         *
         * @param {FabricObject} obj
         * @param {boolean} [centered]
         */
        this.centerObject = (obj, centered) => {
            if (centered) {
                this.canvas.centerObject(obj);
                obj.setCoords();
            }
            else {
                this.setByPartial(obj, {
                    left: obj.left / this.canvas.getZoom() -
                        obj.width / 2 -
                        this.canvas.viewportTransform[4] / this.canvas.getZoom(),
                    top: obj.top / this.canvas.getZoom() -
                        obj.height / 2 -
                        this.canvas.viewportTransform[5] / this.canvas.getZoom(),
                });
            }
        };
        /**
         * Add object
         * @param {FabricObjectOption} obj
         * @param {boolean} [centered=true]
         * @param {boolean} [loaded=false]
         * @returns
         */
        this.add = (obj, centered = true, loaded = false) => {
            const { editable, onAdd, gridOption, objectOption } = this;
            const option = {
                hasControls: editable,
                hasBorders: editable,
                selectable: editable,
                lockMovementX: !editable,
                lockMovementY: !editable,
                hoverCursor: !editable ? 'pointer' : 'move',
            };
            option.editable = editable;
            if (editable && this.workarea.layout === 'fullscreen') {
                option.scaleX = this.workarea.scaleX;
                option.scaleY = this.workarea.scaleY;
            }
            const newOption = Object.assign({}, objectOption, obj, {
                container: this.container.id,
                editable,
            }, option);
            // Individually create canvas object
            if (obj.superType === 'link') {
                return this.linkHandler.create(newOption, loaded);
            }
            let createdObj;
            // Create canvas object
            if (obj.type === 'image') {
                createdObj = this.addImage(newOption);
            }
            else if (obj.type === 'group') {
                const children = [];
                obj.objects?.forEach((element) => {
                    if (this.fabricObjects && element.type) {
                        const newOption = Object.assign({}, objectOption, element, {
                            container: this.container.id,
                            editable,
                        }, option);
                        children.push(this.fabricObjects[element.type].create(newOption));
                    }
                });
                createdObj = this.fabricObjects[obj.type].create({ ...newOption, objects: children });
            }
            else {
                createdObj = this.fabricObjects[obj.type].create(newOption);
            }
            this.canvas.add(createdObj);
            this.objects = this.getObjects();
            if (!editable && !(obj.superType === 'element')) {
                createdObj.on('mousedown', this.eventHandler.object.mousedown);
            }
            if (createdObj.dblclick) {
                createdObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
            }
            if (this.objects.some(object => object.type === 'gif')) {
                this.startRequestAnimFrame();
            }
            else {
                this.stopRequestAnimFrame();
            }
            if (obj.superType !== 'drawing' && obj.superType !== 'link' && editable && !loaded) {
                this.centerObject(createdObj, centered);
            }
            if (createdObj.superType === 'node') {
                this.portHandler.create(createdObj);
                if (createdObj.iconButton) {
                    this.canvas.add(createdObj.iconButton);
                }
            }
            if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                this.animationHandler.play(createdObj.id);
            }
            if (createdObj.superType === 'node') {
                createdObj.setShadow({
                    color: createdObj.stroke,
                });
            }
            if (gridOption.enabled) {
                this.gridHandler.setCoords(createdObj);
            }
            if (!this.transactionHandler.active && !loaded) {
                this.transactionHandler.save('add');
            }
            if (onAdd && editable && !loaded) {
                onAdd(createdObj);
            }
            return createdObj;
        };
        /**
         * Add group object
         *
         * @param {FabricGroup} obj
         * @param {boolean} [centered=true]
         * @param {boolean} [loaded=false]
         * @returns
         */
        this.addGroup = (obj, centered = true, loaded = false) => {
            return obj.objects.map(child => {
                return this.add(child, centered, loaded);
            });
        };
        this.addText = (itemOption = {
            text: 'Text',
            width: 60,
            height: 30,
            fontSize: 32,
            name: 'New Text',
        }) => {
            const id = uuid_1.v4();
            const option = Object.assign({}, itemOption, { id, type: 'i-text' });
            this.add(option, true);
        };
        /**
         * Add iamge object
         * @param {FabricImage} obj
         * @returns
         */
        this.addImage = (obj) => {
            const { objectOption } = this;
            const { filters = [], ...otherOption } = obj;
            const image = new Image();
            if (obj.src) {
                image.src = obj.src;
            }
            const createdObj = new fabric_1.fabric.Image(image, {
                ...objectOption,
                ...otherOption,
            });
            createdObj.set({
                filters: this.imageHandler.createFilters(filters),
            });
            this.setImage(createdObj, obj.src || obj.file);
            return createdObj;
        };
        /**
         * Remove object
         * @param {FabricObject} target
         * @returns {any}
         */
        this.remove = (target) => {
            const activeObject = target || this.canvas.getActiveObject();
            if (this.prevTarget && this.prevTarget.superType === 'link') {
                this.linkHandler.remove(this.prevTarget);
                if (!this.transactionHandler.active) {
                    this.transactionHandler.save('remove');
                }
                return;
            }
            if (!activeObject) {
                return;
            }
            if (typeof activeObject.deletable !== 'undefined' && !activeObject.deletable) {
                return;
            }
            if (activeObject.type !== 'activeSelection') {
                this.canvas.discardActiveObject();
                if (activeObject.superType === 'element') {
                    this.elementHandler.removeById(activeObject.id);
                }
                if (activeObject.superType === 'link') {
                    this.linkHandler.remove(activeObject);
                }
                else if (activeObject.superType === 'node') {
                    if (activeObject.toPort) {
                        if (activeObject.toPort.links.length) {
                            activeObject.toPort.links.forEach((link) => {
                                this.linkHandler.remove(link, 'from');
                            });
                        }
                        this.canvas.remove(activeObject.toPort);
                    }
                    if (activeObject.fromPort && activeObject.fromPort.length) {
                        activeObject.fromPort.forEach((port) => {
                            if (port.links.length) {
                                port.links.forEach((link) => {
                                    this.linkHandler.remove(link, 'to');
                                });
                            }
                            this.canvas.remove(port);
                        });
                    }
                }
                this.canvas.remove(activeObject);
            }
            else {
                const { _objects: activeObjects } = activeObject;
                const existDeleted = activeObjects.some((obj) => typeof obj.deletable !== 'undefined' && !obj.deletable);
                if (existDeleted) {
                    return;
                }
                this.canvas.discardActiveObject();
                activeObjects.forEach((obj) => {
                    if (obj.superType === 'element') {
                        this.elementHandler.removeById(obj.id);
                    }
                    else if (obj.superType === 'node') {
                        if (obj.toPort) {
                            if (obj.toPort.links.length) {
                                obj.toPort.links.forEach((link) => {
                                    this.linkHandler.remove(link, 'from');
                                });
                            }
                            this.canvas.remove(obj.toPort);
                        }
                        if (obj.fromPort && obj.fromPort.length) {
                            obj.fromPort.forEach((port) => {
                                if (port.links.length) {
                                    port.links.forEach((link) => {
                                        this.linkHandler.remove(link, 'to');
                                    });
                                }
                                this.canvas.remove(port);
                            });
                        }
                    }
                    this.canvas.remove(obj);
                });
            }
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('remove');
            }
            this.objects = this.getObjects();
            const { onRemove } = this;
            if (onRemove) {
                onRemove(activeObject);
            }
        };
        /**
         * Remove object by id
         * @param {string} id
         */
        this.removeById = (id) => {
            const findObject = this.findById(id);
            if (findObject) {
                this.remove(findObject);
            }
        };
        /**
         * Delete at origin object list
         * @param {string} id
         */
        this.removeOriginById = (id) => {
            const object = this.findOriginByIdWithIndex(id);
            if (object.index > 0) {
                this.objects.splice(object.index, 1);
            }
        };
        /**
         * Duplicate object
         * @returns
         */
        this.duplicate = () => {
            const { onAdd, propertiesToInclude, gridOption: { grid = 10 }, } = this;
            const activeObject = this.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
                return;
            }
            activeObject.clone((clonedObj) => {
                this.canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + grid,
                    top: clonedObj.top + grid,
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    const activeSelection = clonedObj;
                    activeSelection.canvas = this.canvas;
                    activeSelection.forEachObject((obj) => {
                        obj.set('id', uuid_1.v4());
                        this.canvas.add(obj);
                        this.objects = this.getObjects();
                        if (obj.dblclick) {
                            obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
                        }
                    });
                    if (onAdd) {
                        onAdd(activeSelection);
                    }
                    activeSelection.setCoords();
                }
                else {
                    if (activeObject.id === clonedObj.id) {
                        clonedObj.set('id', uuid_1.v4());
                    }
                    this.canvas.add(clonedObj);
                    this.objects = this.getObjects();
                    if (clonedObj.dblclick) {
                        clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
                    }
                    if (onAdd) {
                        onAdd(clonedObj);
                    }
                }
                this.canvas.setActiveObject(clonedObj);
                this.portHandler.create(clonedObj);
                this.canvas.requestRenderAll();
            }, propertiesToInclude);
        };
        /**
         * Duplicate object by id
         * @param {string} id
         * @returns
         */
        this.duplicateById = (id) => {
            const { onAdd, propertiesToInclude, gridOption: { grid = 10 }, } = this;
            const findObject = this.findById(id);
            if (findObject) {
                if (typeof findObject.cloneable !== 'undefined' && !findObject.cloneable) {
                    return false;
                }
                findObject.clone((cloned) => {
                    cloned.set({
                        left: cloned.left + grid,
                        top: cloned.top + grid,
                        id: uuid_1.v4(),
                        evented: true,
                    });
                    this.canvas.add(cloned);
                    this.objects = this.getObjects();
                    if (onAdd) {
                        onAdd(cloned);
                    }
                    if (cloned.dblclick) {
                        cloned.on('mousedblclick', this.eventHandler.object.mousedblclick);
                    }
                    this.canvas.setActiveObject(cloned);
                    this.portHandler.create(cloned);
                    this.canvas.requestRenderAll();
                }, propertiesToInclude);
            }
            return true;
        };
        /**
         * Cut object
         *
         */
        this.cut = () => {
            this.copy();
            this.remove();
            this.isCut = true;
        };
        /**
         * Copy to clipboard
         *
         * @param {*} value
         */
        this.copyToClipboard = (value) => {
            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.value = value;
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.canvas.wrapperEl.focus();
        };
        /**
         * Copy object
         *
         * @returns
         */
        this.copy = () => {
            const { propertiesToInclude } = this;
            const activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.superType === 'link') {
                return false;
            }
            if (activeObject) {
                if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
                    return false;
                }
                if (activeObject.type === 'activeSelection') {
                    const activeSelection = activeObject;
                    if (activeSelection.getObjects().some((obj) => obj.superType === 'node')) {
                        if (this.keyEvent.clipboard) {
                            const links = [];
                            const objects = activeSelection.getObjects().map((obj, index) => {
                                if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
                                    return null;
                                }
                                if (obj.fromPort.length) {
                                    obj.fromPort.forEach((port) => {
                                        if (port.links.length) {
                                            port.links.forEach((link) => {
                                                const linkTarget = {
                                                    fromNodeIndex: index,
                                                    fromPortId: port.id,
                                                    type: 'curvedLink',
                                                    superType: 'link',
                                                };
                                                const findIndex = activeSelection
                                                    .getObjects()
                                                    .findIndex((compObj) => compObj.id === link.toNode.id);
                                                if (findIndex >= 0) {
                                                    linkTarget.toNodeIndex = findIndex;
                                                    links.push(linkTarget);
                                                }
                                            });
                                        }
                                    });
                                }
                                return {
                                    name: obj.name,
                                    description: obj.description,
                                    superType: obj.superType,
                                    type: obj.type,
                                    nodeClazz: obj.nodeClazz,
                                    configuration: obj.configuration,
                                    properties: {
                                        left: activeObject.left + activeObject.width / 2 + obj.left || 0,
                                        top: activeObject.top + activeObject.height / 2 + obj.top || 0,
                                        iconName: obj.descriptor.icon,
                                    },
                                };
                            });
                            this.copyToClipboard(JSON.stringify(objects.concat(links), null, '\t'));
                            return true;
                        }
                        this.clipboard = activeObject;
                        return true;
                    }
                }
                activeObject.clone((cloned) => {
                    if (this.keyEvent.clipboard) {
                        if (cloned.superType === 'node') {
                            const node = {
                                name: cloned.name,
                                description: cloned.description,
                                superType: cloned.superType,
                                type: cloned.type,
                                nodeClazz: cloned.nodeClazz,
                                configuration: cloned.configuration,
                                properties: {
                                    left: cloned.left || 0,
                                    top: cloned.top || 0,
                                    iconName: cloned.descriptor.icon,
                                },
                            };
                            const objects = [node];
                            this.copyToClipboard(JSON.stringify(objects, null, '\t'));
                        }
                        else {
                            this.copyToClipboard(JSON.stringify(cloned.toObject(propertiesToInclude), null, '\t'));
                        }
                    }
                    else {
                        this.clipboard = cloned;
                    }
                }, propertiesToInclude);
            }
            return true;
        };
        /**
         * Paste object
         *
         * @returns
         */
        this.paste = () => {
            const { onAdd, propertiesToInclude, gridOption: { grid = 10 }, clipboard, isCut, } = this;
            const padding = isCut ? 0 : grid;
            if (!clipboard) {
                return false;
            }
            if (typeof clipboard.cloneable !== 'undefined' && !clipboard.cloneable) {
                return false;
            }
            this.isCut = false;
            if (clipboard.type === 'activeSelection') {
                if (clipboard.getObjects().some((obj) => obj.superType === 'node')) {
                    this.canvas.discardActiveObject();
                    const objects = [];
                    const linkObjects = [];
                    clipboard.getObjects().forEach((obj) => {
                        if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
                            return;
                        }
                        const clonedObj = obj.duplicate();
                        if (clonedObj.type === 'SwitchNode') {
                            clonedObj.set({
                                left: obj.left + padding + padding,
                                top: obj.top + padding,
                            });
                        }
                        else {
                            clonedObj.set({
                                left: obj.left + padding,
                                top: obj.top + padding,
                            });
                        }
                        if (obj.fromPort.length) {
                            obj.fromPort.forEach((port) => {
                                if (port.links.length) {
                                    port.links.forEach((link) => {
                                        const linkTarget = {
                                            fromNode: clonedObj.id,
                                            fromPort: port.id,
                                        };
                                        const findIndex = clipboard
                                            .getObjects()
                                            .findIndex((compObj) => compObj.id === link.toNode.id);
                                        if (findIndex >= 0) {
                                            linkTarget.toNodeIndex = findIndex;
                                            linkObjects.push(linkTarget);
                                        }
                                    });
                                }
                            });
                        }
                        if (clonedObj.dblclick) {
                            clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
                        }
                        this.canvas.add(clonedObj);
                        this.objects = this.getObjects();
                        this.portHandler.create(clonedObj);
                        objects.push(clonedObj);
                    });
                    if (linkObjects.length) {
                        linkObjects.forEach((linkObject) => {
                            const { fromNode, fromPort, toNodeIndex } = linkObject;
                            const toNode = objects[toNodeIndex];
                            const link = {
                                type: 'curvedLink',
                                fromNodeId: fromNode,
                                fromPortId: fromPort,
                                toNodeId: toNode.id,
                                toPortId: toNode.toPort.id,
                            };
                            this.linkHandler.create(link);
                        });
                    }
                    const activeSelection = new fabric_1.fabric.ActiveSelection(objects, {
                        canvas: this.canvas,
                        ...this.activeSelectionOption,
                    });
                    if (isCut) {
                        this.clipboard = null;
                    }
                    else {
                        this.clipboard = activeSelection;
                    }
                    if (!this.transactionHandler.active) {
                        this.transactionHandler.save('paste');
                    }
                    this.canvas.setActiveObject(activeSelection);
                    this.canvas.renderAll();
                    return true;
                }
            }
            clipboard.clone((clonedObj) => {
                this.canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + padding,
                    top: clonedObj.top + padding,
                    id: isCut ? clipboard.id : uuid_1.v4(),
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    clonedObj.canvas = this.canvas;
                    clonedObj.forEachObject((obj) => {
                        obj.set('id', isCut ? obj.id : uuid_1.v4());
                        this.canvas.add(obj);
                        if (obj.dblclick) {
                            obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
                        }
                    });
                }
                else {
                    if (clonedObj.superType === 'node') {
                        clonedObj = clonedObj.duplicate();
                    }
                    this.canvas.add(clonedObj);
                    if (clonedObj.dblclick) {
                        clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
                    }
                }
                const newClipboard = clipboard.set({
                    top: clonedObj.top,
                    left: clonedObj.left,
                });
                if (isCut) {
                    this.clipboard = null;
                }
                else {
                    this.clipboard = newClipboard;
                }
                if (clonedObj.superType === 'node') {
                    this.portHandler.create(clonedObj);
                }
                if (!this.transactionHandler.active) {
                    this.transactionHandler.save('paste');
                }
                // TODO...
                // After toGroup svg elements not rendered.
                this.objects = this.getObjects();
                if (onAdd) {
                    onAdd(clonedObj);
                }
                clonedObj.setCoords();
                this.canvas.setActiveObject(clonedObj);
                this.canvas.requestRenderAll();
            }, propertiesToInclude);
            return true;
        };
        /**
         * Load the image
         * @param {FabricImage} obj
         * @param {string} src
         */
        this.loadImage = (obj, src) => {
            let url = src;
            if (!url) {
                url = './images/sample/transparentBg.png';
            }
            fabric_1.fabric.util.loadImage(url, source => {
                if (obj.type !== 'image') {
                    obj.setPatternFill({
                        source,
                        repeat: 'repeat',
                    }, null);
                    obj.setCoords();
                    this.canvas.renderAll();
                    return;
                }
                obj.setElement(source);
                obj.setCoords();
                this.canvas.renderAll();
            });
        };
        /**
         * Find object by object
         * @param {FabricObject} obj
         */
        this.find = (obj) => this.findById(obj.id);
        /**
         * Find object by id
         * @param {string} id
         * @returns {(FabricObject | null)}
         */
        this.findById = (id) => {
            let findObject;
            const exist = this.objects.some(obj => {
                if (obj.id === id) {
                    findObject = obj;
                    return true;
                }
                if (obj.type === 'group' && obj._objects) {
                    const findChild = this.findChild(obj, id);
                    if (findChild) {
                        findObject = findChild;
                        return true;
                    }
                }
                return false;
            });
            if (!exist) {
                warning_1.default(true, 'Not found object by id.');
                return null;
            }
            return findObject;
        };
        this.findChild = (parent, id) => {
            let findObject;
            parent._objects.some((child) => {
                if (child.id === id) {
                    findObject = child;
                    return true;
                }
                if (child.type === 'group' && child._objects) {
                    const findChild = this.findChild(child, id);
                    if (findChild) {
                        findObject = findChild;
                        return true;
                    }
                }
                return false;
            });
            return findObject;
        };
        /**
         * Find object in origin list
         * @param {string} id
         * @returns
         */
        this.findOriginById = (id) => {
            let findObject;
            const exist = this.objects.some(obj => {
                if (obj.id === id) {
                    findObject = obj;
                    return true;
                }
                return false;
            });
            if (!exist) {
                console.warn('Not found object by id.');
                return null;
            }
            return findObject;
        };
        /**
         * Return origin object list
         * @param {string} id
         * @returns
         */
        this.findOriginByIdWithIndex = (id) => {
            let findObject;
            let index = -1;
            const exist = this.objects.some((obj, i) => {
                if (obj.id === id) {
                    findObject = obj;
                    index = i;
                    return true;
                }
                return false;
            });
            if (!exist) {
                console.warn('Not found object by id.');
                return {};
            }
            return {
                object: findObject,
                index,
            };
        };
        /**
         * Select object
         * @param {FabricObject} obj
         * @param {boolean} [find]
         */
        this.select = (obj, find) => {
            let findObject = obj;
            if (find) {
                findObject = this.find(obj);
            }
            if (findObject) {
                this.canvas.discardActiveObject();
                this.canvas.setActiveObject(findObject);
                this.canvas.requestRenderAll();
            }
        };
        /**
         * Select by id
         * @param {string} id
         */
        this.selectById = (id) => {
            const findObject = this.findById(id);
            if (findObject) {
                this.canvas.discardActiveObject();
                this.canvas.setActiveObject(findObject);
                this.canvas.requestRenderAll();
            }
        };
        /**
         * Select all
         * @returns
         */
        this.selectAll = () => {
            this.canvas.discardActiveObject();
            const filteredObjects = this.canvas.getObjects().filter((obj) => {
                if (obj.id === 'workarea') {
                    return false;
                }
                else if (!obj.evented) {
                    return false;
                }
                else if (obj.superType === 'link') {
                    return false;
                }
                else if (obj.superType === 'port') {
                    return false;
                }
                else if (obj.superType === 'element') {
                    return false;
                }
                else if (obj.locked) {
                    return false;
                }
                return true;
            });
            if (!filteredObjects.length) {
                return;
            }
            if (filteredObjects.length === 1) {
                this.canvas.setActiveObject(filteredObjects[0]);
                this.canvas.renderAll();
                return;
            }
            const activeSelection = new fabric_1.fabric.ActiveSelection(filteredObjects, {
                canvas: this.canvas,
                ...this.activeSelectionOption,
            });
            this.canvas.setActiveObject(activeSelection);
            this.canvas.renderAll();
        };
        /**
         * Save origin width, height
         * @param {FabricObject} obj
         * @param {number} width
         * @param {number} height
         */
        this.originScaleToResize = (obj, width, height) => {
            if (obj.id === 'workarea') {
                this.setByPartial(obj, {
                    workareaWidth: obj.width,
                    workareaHeight: obj.height,
                });
            }
            this.setByPartial(obj, {
                scaleX: width / obj.width,
                scaleY: height / obj.height,
            });
        };
        /**
         * When set the width, height, Adjust the size
         * @param {number} width
         * @param {number} height
         */
        this.scaleToResize = (width, height) => {
            const activeObject = this.canvas.getActiveObject();
            const { id } = activeObject;
            const obj = {
                id,
                scaleX: width / activeObject.width,
                scaleY: height / activeObject.height,
            };
            this.setObject(obj);
            activeObject.setCoords();
            this.canvas.requestRenderAll();
        };
        /**
         * Import json
         * @param {*} json
         * @param {(canvas: FabricCanvas) => void} [callback]
         */
        this.importJSON = async (json, callback) => {
            if (typeof json === 'string') {
                json = JSON.parse(json);
            }
            let prevLeft = 0;
            let prevTop = 0;
            this.canvas.setBackgroundColor(this.canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
            const workareaExist = json.filter((obj) => obj.id === 'workarea');
            if (!this.workarea) {
                this.workareaHandler.initialize();
            }
            if (!workareaExist.length) {
                this.canvas.centerObject(this.workarea);
                this.workarea.setCoords();
                prevLeft = this.workarea.left;
                prevTop = this.workarea.top;
            }
            else {
                const workarea = workareaExist[0];
                prevLeft = workarea.left;
                prevTop = workarea.top;
                this.workarea.set(workarea);
                await this.workareaHandler.setImage(workarea.src, true);
                this.workarea.setCoords();
            }
            json.forEach((obj) => {
                if (obj.id === 'workarea') {
                    return;
                }
                const canvasWidth = this.canvas.getWidth();
                const canvasHeight = this.canvas.getHeight();
                const { width, height, scaleX, scaleY, layout, left, top } = this.workarea;
                if (layout === 'fullscreen') {
                    const leftRatio = canvasWidth / (width * scaleX);
                    const topRatio = canvasHeight / (height * scaleY);
                    obj.left *= leftRatio;
                    obj.top *= topRatio;
                    obj.scaleX *= leftRatio;
                    obj.scaleY *= topRatio;
                }
                else {
                    const diffLeft = left - prevLeft;
                    const diffTop = top - prevTop;
                    obj.left += diffLeft;
                    obj.top += diffTop;
                }
                if (obj.type === 'group') {
                    obj.objects.forEach((child) => {
                        child.id = uuid_1.v4();
                    });
                }
                //if (obj.superType === 'element') {
                obj.id = uuid_1.v4();
                //	}
                this.add(obj, false, true);
                this.canvas.renderAll();
            });
            this.objects = this.getObjects();
            this.transactionHandler.updateState();
            if (callback) {
                callback(this.canvas);
            }
            return Promise.resolve(this.canvas);
        };
        /**
         * Export json
         */
        this.exportJSON = () => this.canvas.toObject(this.propertiesToInclude).objects;
        this.exportAllJSON = () => this.canvas.toJSON(this.propertiesToInclude);
        /**
         * Active selection to group
         * @returns
         */
        this.toGroup = (target) => {
            const activeObject = target || this.canvas.getActiveObject();
            if (!activeObject) {
                return null;
            }
            if (activeObject.type !== 'activeSelection') {
                return null;
            }
            const group = activeObject.toGroup();
            group.set({
                id: uuid_1.v4(),
                name: 'New group',
                type: 'group',
                ...this.objectOption,
            });
            this.objects = this.getObjects();
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('group');
            }
            if (this.onSelect) {
                this.onSelect(group);
            }
            this.canvas.renderAll();
            return group;
        };
        /**
         * Group to active selection
         * @returns
         */
        this.toActiveSelection = (target) => {
            const activeObject = target || this.canvas.getActiveObject();
            if (!activeObject) {
                return;
            }
            if (activeObject.type !== 'group') {
                return;
            }
            const activeSelection = activeObject.toActiveSelection();
            this.objects = this.getObjects();
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('ungroup');
            }
            if (this.onSelect) {
                this.onSelect(activeSelection);
            }
            this.canvas.renderAll();
            return activeSelection;
        };
        /**
         * Bring forward
         */
        this.bringForward = () => {
            const activeObject = this.canvas.getActiveObject();
            if (activeObject) {
                this.canvas.bringForward(activeObject);
                if (!this.transactionHandler.active) {
                    this.transactionHandler.save('bringForward');
                }
                const { onModified } = this;
                if (onModified) {
                    onModified(activeObject);
                }
            }
        };
        /**
         * Bring to front
         */
        this.bringToFront = () => {
            const activeObject = this.canvas.getActiveObject();
            if (activeObject) {
                this.canvas.bringToFront(activeObject);
                if (!this.transactionHandler.active) {
                    this.transactionHandler.save('bringToFront');
                }
                const { onModified } = this;
                if (onModified) {
                    onModified(activeObject);
                }
            }
        };
        /**
         * Send backwards
         * @returns
         */
        this.sendBackwards = () => {
            const activeObject = this.canvas.getActiveObject();
            if (activeObject) {
                const firstObject = this.canvas.getObjects()[1];
                if (firstObject.id === activeObject.id) {
                    return;
                }
                if (!this.transactionHandler.active) {
                    this.transactionHandler.save('sendBackwards');
                }
                this.canvas.sendBackwards(activeObject);
                const { onModified } = this;
                if (onModified) {
                    onModified(activeObject);
                }
            }
        };
        /**
         * Send to back
         */
        this.sendToBack = () => {
            const activeObject = this.canvas.getActiveObject();
            if (activeObject) {
                this.canvas.sendToBack(activeObject);
                this.canvas.sendToBack(this.canvas.getObjects()[1]);
                if (!this.transactionHandler.active) {
                    this.transactionHandler.save('sendToBack');
                }
                const { onModified } = this;
                if (onModified) {
                    onModified(activeObject);
                }
            }
        };
        /**
         * Clear canvas
         * @param {boolean} [includeWorkarea=false]
         */
        this.clear = (includeWorkarea = false) => {
            const ids = this.canvas.getObjects().reduce((prev, curr) => {
                if (curr.superType === 'element') {
                    prev.push(curr.id);
                    return prev;
                }
                return prev;
            }, []);
            this.elementHandler.removeByIds(ids);
            if (includeWorkarea) {
                this.canvas.clear();
                this.workarea = null;
            }
            else {
                this.canvas.discardActiveObject();
                this.canvas.getObjects().forEach((obj) => {
                    if (obj.id === 'grid' || obj.id === 'workarea') {
                        return;
                    }
                    this.canvas.remove(obj);
                });
            }
            this.objects = this.getObjects();
            this.canvas.renderAll();
        };
        /**
         * Start request animation frame
         */
        this.startRequestAnimFrame = () => {
            if (!this.isRequsetAnimFrame) {
                this.isRequsetAnimFrame = true;
                const render = () => {
                    this.canvas.renderAll();
                    this.requestFrame = fabric_1.fabric.util.requestAnimFrame(render);
                };
                fabric_1.fabric.util.requestAnimFrame(render);
            }
        };
        /**
         * Stop request animation frame
         */
        this.stopRequestAnimFrame = () => {
            this.isRequsetAnimFrame = false;
            const cancelRequestAnimFrame = (() => window.cancelAnimationFrame ||
                // || window.webkitCancelRequestAnimationFrame
                // || window.mozCancelRequestAnimationFrame
                // || window.oCancelRequestAnimationFrame
                // || window.msCancelRequestAnimationFrame
                clearTimeout)();
            cancelRequestAnimFrame(this.requestFrame);
        };
        /**
         * Save target object as image
         * @param {FabricObject} targetObject
         * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
         */
        this.saveImage = (targetObject, option = { name: 'New Image', format: 'png', quality: 1 }) => {
            let dataUrl;
            let target = targetObject;
            if (target) {
                dataUrl = target.toDataURL(option);
            }
            else {
                target = this.canvas.getActiveObject();
                if (target) {
                    dataUrl = target.toDataURL(option);
                }
            }
            if (dataUrl) {
                const anchorEl = document.createElement('a');
                anchorEl.href = dataUrl;
                anchorEl.download = `${option.name}.png`;
                document.body.appendChild(anchorEl); // required for firefox
                anchorEl.click();
                anchorEl.remove();
            }
        };
        /**
         * Save canvas as image
         * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
         */
        this.saveCanvasImage = (option = { name: 'New Image', format: 'png', quality: 1 }) => {
            const dataUrl = this.canvas.toDataURL(option);
            if (dataUrl) {
                const anchorEl = document.createElement('a');
                anchorEl.href = dataUrl;
                anchorEl.download = `${option.name}.png`;
                document.body.appendChild(anchorEl); // required for firefox
                anchorEl.click();
                anchorEl.remove();
            }
        };
        this.canvasImageDataURL = (option = { name: 'New Image', format: 'png', quality: 1 }) => {
            return this.canvas.toDataURL(option);
        };
        /**
         * Sets "angle" of an instance with centered rotation
         *
         * @param {number} angle
         */
        this.rotate = (angle) => {
            const activeObject = this.canvas.getActiveObject();
            if (activeObject) {
                this.set('rotation', angle);
                activeObject.rotate(angle);
                this.canvas.requestRenderAll();
            }
        };
        /**
         * Destroy canvas
         *
         */
        this.destroy = () => {
            this.eventHandler.destroy();
            this.guidelineHandler.destroy();
            this.contextmenuHandler.destory();
            this.tooltipHandler.destroy();
            this.clear(true);
        };
        /**
         * Set canvas option
         *
         * @param {CanvasOption} canvasOption
         */
        this.setCanvasOption = (canvasOption) => {
            this.canvasOption = Object.assign({}, this.canvasOption, canvasOption);
            this.canvas.setBackgroundColor(canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
            if (typeof canvasOption.width !== 'undefined' && typeof canvasOption.height !== 'undefined') {
                if (this.eventHandler) {
                    this.eventHandler.resize(canvasOption.width, canvasOption.height);
                }
                else {
                    this.canvas.setWidth(canvasOption.width).setHeight(canvasOption.height);
                }
            }
            if (typeof canvasOption.selection !== 'undefined') {
                this.canvas.selection = canvasOption.selection;
            }
            if (typeof canvasOption.hoverCursor !== 'undefined') {
                this.canvas.hoverCursor = canvasOption.hoverCursor;
            }
            if (typeof canvasOption.defaultCursor !== 'undefined') {
                this.canvas.defaultCursor = canvasOption.defaultCursor;
            }
            if (typeof canvasOption.preserveObjectStacking !== 'undefined') {
                this.canvas.preserveObjectStacking = canvasOption.preserveObjectStacking;
            }
        };
        /**
         * Set keyboard event
         *
         * @param {KeyEvent} keyEvent
         */
        this.setKeyEvent = (keyEvent) => {
            this.keyEvent = Object.assign({}, this.keyEvent, keyEvent);
        };
        /**
         * Set fabric objects
         *
         * @param {FabricObjects} fabricObjects
         */
        this.setFabricObjects = (fabricObjects) => {
            this.fabricObjects = Object.assign({}, this.fabricObjects, fabricObjects);
        };
        /**
         * Set workarea option
         *
         * @param {WorkareaOption} workareaOption
         */
        this.setWorkareaOption = (workareaOption) => {
            this.workareaOption = Object.assign({}, this.workareaOption, workareaOption);
            if (this.workarea) {
                this.workarea.set({
                    ...workareaOption,
                });
            }
        };
        /**
         * Set guideline option
         *
         * @param {GuidelineOption} guidelineOption
         */
        this.setGuidelineOption = (guidelineOption) => {
            this.guidelineOption = Object.assign({}, this.guidelineOption, guidelineOption);
            if (this.guidelineHandler) {
                this.guidelineHandler.initialize();
            }
        };
        /**
         * Set grid option
         *
         * @param {GridOption} gridOption
         */
        this.setGridOption = (gridOption) => {
            this.gridOption = Object.assign({}, this.gridOption, gridOption);
        };
        /**
         * Set object option
         *
         * @param {FabricObjectOption} objectOption
         */
        this.setObjectOption = (objectOption) => {
            this.objectOption = Object.assign({}, this.objectOption, objectOption);
        };
        /**
         * Set activeSelection option
         *
         * @param {Partial<FabricObjectOption<fabric.ActiveSelection>>} activeSelectionOption
         */
        this.setActiveSelectionOption = (activeSelectionOption) => {
            this.activeSelectionOption = Object.assign({}, this.activeSelectionOption, activeSelectionOption);
        };
        /**
         * Set propertiesToInclude
         *
         * @param {string[]} propertiesToInclude
         */
        this.setPropertiesToInclude = (propertiesToInclude) => {
            this.propertiesToInclude = lodash_1.union(propertiesToInclude, this.propertiesToInclude);
        };
        this.initialize(options);
    }
    /**
     * Initialize handler
     *
     * @author salgum1114
     * @param {HandlerOptions} options
     */
    initialize(options) {
        this.initOption(options);
        this.initCallback(options);
        this.initHandler();
    }
}
exports.default = Handler;
