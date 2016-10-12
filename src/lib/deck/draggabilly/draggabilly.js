import Unidragger from './unidragger.js'

var document = window.document;
function noop() {}
function extend( a, b ) {
	for ( var prop in b ) {
		a[ prop ] = b[ prop ];
	}
	return a;
}
function isElement( obj ) {
	return obj instanceof HTMLElement;
}

var requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
var lastTime = 0;
if ( !requestAnimationFrame )  {
	requestAnimationFrame = function( callback ) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
		var id = setTimeout( callback, timeToCall );
		lastTime = currTime + timeToCall;
		return id;
	};
}

var docElem = document.documentElement;
var transformProperty = typeof docElem.style.transform == 'string' ?
	'transform' : 'WebkitTransform';


export default class Draggabilly extends Unidragger{
	constructor( element, options ) {
		super();
		this.element = typeof element == 'string' ?
			document.querySelector( element ) : element;

		this.options = extend( {}, this.constructor.defaults );
		this.option( options );

		this._create();
	}

	option( opts ) {
		extend( this.options, opts );
	};

	_create() {

		this.setHandles();
	};

	setHandles() {
		this.handles = this.options.handle ?
			this.element.querySelectorAll( this.options.handle ) : [ this.element ];

		this.bindHandles();
	};

}

Draggabilly.defaults = {
};
