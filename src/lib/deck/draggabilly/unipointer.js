import EvEmitter from './ev-emitter.js'


var postStartEvents = {
    mousedown: ['mousemove', 'mouseup'],
    touchstart: ['touchmove', 'touchend', 'touchcancel'],
    pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
    MSPointerDown: ['MSPointerMove', 'MSPointerUp', 'MSPointerCancel']
};
export default class Unipointer extends EvEmitter {
    constructor() {
        super();
    }

    bindStartEvent(elem) {
        this._bindStartEvent(elem, true);
    };

    unbindStartEvent(elem) {
        this._bindStartEvent(elem, false);
    };

    _bindStartEvent(elem, isBind) {
        // munge isBind, default to true
        isBind = isBind === undefined ? true : !!isBind;
        var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
        elem[bindMethod]('mousedown', this);
        elem[bindMethod]('touchstart', this);
    };

    handleEvent(event) {
        var method = 'on' + event.type;
        if (this[method]) {
            this[method](event);
        }
    };

    onmousedown(event) {
        var button = event.button;
        if (button && ( button !== 0 && button !== 1 )) {
            return;
        }
        this._pointerDown(event, event);
    };

    _pointerDown(event, pointer) {
        this.pointerDown(event, pointer);
    };

    pointerDown(event, pointer) {
        this._bindPostStartEvents(event);
        this.emitEvent('pointerDown', [event, pointer]);
    };

    _bindPostStartEvents(event) {
        if (!event) {
            return;
        }
        // get proper events to match start event
        var events = postStartEvents[event.type];
        // bind events to node
        events.forEach(function (eventName) {
            window.addEventListener(eventName, this);
        }, this);
        this._boundPointerEvents = events;
    };

    _unbindPostStartEvents() {
        // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
        if (!this._boundPointerEvents) {
            return;
        }
        this._boundPointerEvents.forEach(function (eventName) {
            window.removeEventListener(eventName, this);
        }, this);

        delete this._boundPointerEvents;
    };

    onmousemove(event) {
        this._pointerMove(event, event);
    };

    _pointerMove(event, pointer) {
        this.pointerMove(event, pointer);
    };

    pointerMove(event, pointer) {
        this.emitEvent('pointerMove', [event, pointer]);
    };


    onmouseup(event) {
        this._pointerUp(event, event);
    };

    _pointerUp(event, pointer) {
        this._pointerDone();
        this.pointerUp(event, pointer);
    };

    pointerUp(event, pointer) {
        this.emitEvent('pointerUp', [event, pointer]);
    };

    _pointerDone() {
        this._unbindPostStartEvents();
    };


}