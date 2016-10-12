import Unipointer from './unipointer.js'

var navigator = window.navigator;

function noop() {}
export default class Unidragger extends Unipointer{
  constructor() {
    super();
  }

  bindHandles() {
    this._bindHandles( true );
  };
  unbindHandles() {
    this._bindHandles( false );
  };
  _bindHandles( isBind ) {
    // munge isBind, default to true
    isBind = isBind === undefined ? true : !!isBind;
    // extra bind logic
    var binderExtra;
    if ( navigator.pointerEnabled ) {
      binderExtra = function( handle ) {
        // disable scrolling on the element
        handle.style.touchAction = isBind ? 'none' : '';
      };
    } else if ( navigator.msPointerEnabled ) {
      binderExtra = function( handle ) {
        // disable scrolling on the element
        handle.style.msTouchAction = isBind ? 'none' : '';
      };
    } else {
      binderExtra = noop;
    }
    // bind each handle
    var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
    for ( var i=0; i < this.handles.length; i++ ) {
      var handle = this.handles[i];
      this._bindStartEvent( handle, isBind );
      binderExtra( handle );
    }
  };
}