"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("fabric");
require("mediaelement");
require("mediaelement/build/mediaelementplayer.min.css");
const utils_1 = require("../utils");
const Video = fabric_1.fabric.util.createClass(fabric_1.fabric.Rect, {
    type: 'video',
    superType: 'element',
    hasRotatingPoint: false,
    initialize(source, options) {
        options = options || {};
        this.callSuper('initialize', options);
        if (source instanceof File) {
            this.set({
                file: source,
                src: null,
            });
        }
        else {
            this.set({
                file: null,
                src: source,
            });
        }
        this.set({
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        });
    },
    setSource(source) {
        if (source instanceof File) {
            this.setFile(source);
        }
        else {
            this.setSrc(source);
        }
    },
    setFile(file) {
        this.set({
            file,
            src: null,
        });
        const reader = new FileReader();
        reader.onload = () => {
            this.player.setSrc(reader.result);
        };
        reader.readAsDataURL(file);
    },
    setSrc(src) {
        this.set({
            file: null,
            src,
        });
        this.player.setSrc(src);
    },
    toObject(propertiesToInclude) {
        return utils_1.toObject(this, propertiesToInclude, {
            src: this.get('src'),
            file: this.get('file'),
            container: this.get('container'),
            editable: this.get('editable'),
        });
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        if (!this.element) {
            const { id, scaleX, scaleY, width, height, angle, editable, src, file, autoplay, muted, loop } = this;
            const zoom = this.canvas.getZoom();
            const left = this.calcCoords().tl.x;
            const top = this.calcCoords().tl.y;
            const padLeft = (width * scaleX * zoom - width) / 2;
            const padTop = (height * scaleY * zoom - height) / 2;
            this.videoElement = fabric_1.fabric.util.makeElement('video', {
                id,
                autoplay: editable ? false : autoplay,
                muted: editable ? false : muted,
                loop: editable ? false : loop,
                preload: 'none',
                controls: false,
            });
            this.element = fabric_1.fabric.util.wrapElement(this.videoElement, 'div', {
                id: `${id}_container`,
                style: `transform: rotate(${angle}deg) scale(${scaleX * zoom}, ${scaleY * zoom});
                        width: ${width}px;
                        height: ${height}px;
                        left: ${left + padLeft}px;
                        top: ${top + padTop}px;
                        position: absolute;
                        user-select: ${editable ? 'none' : 'auto'};
                        pointer-events: ${editable ? 'none' : 'auto'};`,
            });
            const container = document.getElementById(this.container);
            container.appendChild(this.element);
            this.player = new MediaElementPlayer(id, {
                pauseOtherPlayers: false,
                videoWidth: '100%',
                videoHeight: '100%',
                success: (_mediaeElement, _originalNode, instance) => {
                    if (editable) {
                        instance.pause();
                    }
                },
            });
            this.player.setPlayerSize(width, height);
            if (src) {
                this.setSrc(src);
            }
            else if (file) {
                this.setFile(file);
            }
        }
    },
});
Video.fromObject = (options, callback) => {
    return callback(new Video(options.src || options.file, options));
};
window.fabric.Video = Video;
exports.default = Video;
