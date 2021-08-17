import { fabric } from 'fabric';

const Path = fabric.util.createClass(fabric.Path, {
	type: 'path',
	superType: 'drawing',
	initialize(path: any, options: any) {
		options = options || {};
		this.callSuper('initialize', path, options);
	},
	_render(ctx: CanvasRenderingContext2D) {
		this.callSuper('_render', ctx);
	},
});

Path.fromObject = (options: any, callback: any) => {
	const { path } = options;
	return callback(new Path(path, options));
};

window.fabric.Path = Path;

export default Path;
