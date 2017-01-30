var body = document.body, docElem = window.document.documentElement,
    transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    };
// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;

    return function () {
        var context = scope || this;
        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}
// from http://responsejs.com/labs/dimensions/
function getViewportW() {
    var client = docElem['clientWidth'], inner = window['innerWidth'];
    return client < inner ? inner : client;
}
function getViewportH() {
    var client = docElem['clientHeight'], inner = window['innerHeight'];
    return client < inner ? inner : client;
}
function scrollX() {
    return window.pageXOffset || docElem.scrollLeft;
}
function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
}
// gets the offset of an element relative to the document
function getOffset(el) {
    var offset = el.getBoundingClientRect();
    return {
        top: offset.top + scrollY(),
        left: offset.left + scrollX(),
        right: offset.right + scrollX(),
        bottom: offset.bottom + scrollY(),
    }
}
function setTransformStyle(el, tval) {
    el.style.transform = tval;
}
function onEndTransition(el, callback) {
    var onEndCallbackFn = function (ev) {
        if (support.transitions) {
            this.removeEventListener(transEndEventName, onEndCallbackFn);
        }
        if (callback && typeof callback === 'function') {
            callback.call();
        }
    };

    if (support.transitions) {
        el.addEventListener(transEndEventName, onEndCallbackFn);
    }
    else {
        onEndCallbackFn();
    }
}
function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}


let classie = {
    add: () => {
    },
    remove: () => {
    },
}

class Droppable {
    constructor(droppableEl, options) {
        this.el = droppableEl;
        this.draggableObj = null;
        this.options = extend({}, this.options);
        extend(this.options, options);
    }

    isDroppable(draggableEl) {
        var offset1 = getOffset(draggableEl), width1 = draggableEl.offsetWidth, height1 = draggableEl.offsetHeight,
            offset2 = getOffset(this.el), width2 = this.el.offsetWidth, height2 = this.el.offsetHeight;
        offset2 = {
            left: (offset2.left + offset2.right) / 2 - width2 / 2,
            top: (offset2.top + offset2.bottom) / 2 - height2 / 2
        }
        return !(offset2.left > offset1.left + width1 - width1 / 2 ||
        offset2.left + width2 < offset1.left + width1 / 2 ||
        offset2.top > offset1.top + height1 - height1 / 2 ||
        offset2.top + height2 < offset1.top + height1 / 2 );
    }

    highlight(draggableEl) {
        if (this.isDroppable(draggableEl))
            this.options.setDroppabledHighLight(this);
        else
            this.options.removeDroppabledHighLight(this);
    }

    collect(draggableEl, draggableObj) {
        this.options.removeDroppabledHighLight(this);
        this.options.onDrop(this, draggableEl, draggableObj);
    }
}

class Draggable {
    constructor(dragEl, dragObj, dragObjMethod, droppables, options) {
        this.el = dragEl;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.droppables = droppables;
        this.FirstStatus = true;

        this.draggie = dragObj;
        this.dragObjMethod = dragObjMethod;
        this.events = {
            onDragStart: this.onDragStart.bind(this),
            onDragMove: throttle(this.onDragMove.bind(this), 5),
            onDragEnd: this.onDragEnd.bind(this)

        }
        this.initEvents();
    }

    initEvents() {
        this.draggie.on('pointerDown', this.events.onDragStart);
        this.draggie.on('pointerMove', this.events.onDragMove);
        this.draggie.on('pointerUp', this.events.onDragEnd);
    }

    destroy() {
        this.draggie.off('pointerDown', this.events.onDragStart);
        this.draggie.off('pointerMove', this.events.onDragMove);
        this.draggie.off('pointerUp', this.events.onDragEnd);
    }

    onDragStart(instance, event, pointer) {
        if (this.FirstStatus) {
            this.options.onFirstStart();
            this.FirstStatus = false;
        }
        this.options.onStart();

        this.highlightDroppables();
    }

    onDragMove(instance, event, pointer) {
        this.options.onDrag();
        this.highlightDroppables();
    }

    onDragEnd(instance, event, pointer) {
        var dropped = false;
        for (var i = 0, len = this.droppables.length; i < len; ++i) {
            var droppableEl = this.droppables[i];
            if (droppableEl.isDroppable(this.el) && droppableEl.options.isDroppable(this)) {
                dropped = true;
                droppableEl.collect(this.el, this.dragObjMethod);
                this.options.onEnd(dropped, droppableEl);
                return;
            }
        }

        this.options.onEnd(dropped);
    }

    highlightDroppables(el) {
        for (var i = 0, len = this.droppables.length; i < len; ++i) {
            this.droppables[i].highlight(this.el);
        }
    }
}

Draggable.prototype.options = {
    draggabilly: {},
    // if the item should animate back to its original position
    animBack: true,
    // clone the draggable and insert it on the same position while dragging the original one
    helper: false,
    // callbacks
    onStart: function () {
        return false;
    },
    onDrag: function () {
        return false;
    },
    onEnd: function (wasDropped) {
        return false;
    }
}

export {Draggable, Droppable}