var Deck = (function () {
'use strict';

function createElement (type) {
  return document.createElement(type);
}

var ticking;
var animations = [];

function animationFrames (delay, duration) {
  var now = Date.now();

  // calculate animation start/end times
  var start = now + delay;
  var end = start + duration;

  var animation = {
    start: start,
    end: end
  };

  // add animation
  animations.push(animation);

  if (!ticking) {
    // start ticking
    ticking = true;
    requestAnimationFrame(tick);
  }
  var self = {
    start: function start(cb) {
      // add start callback (just one)
      animation.startcb = cb;
      return self;
    },
    progress: function progress(cb) {
      // add progress callback (just one)
      animation.progresscb = cb;
      return self;
    },
    end: function end(cb) {
      // add end callback (just one)
      animation.endcb = cb;
      return self;
    }
  };
  return self;
}

function tick() {
  var now = Date.now();

  if (!animations.length) {
    // stop ticking
    ticking = false;
    return;
  }

  for (var i = 0, animation; i < animations.length; i++) {
    animation = animations[i];
    if (now < animation.start) {
      // animation not yet started..
      continue;
    }
    if (!animation.started) {
      // animation starts
      animation.started = true;
      animation.startcb && animation.startcb();
    }
    // animation progress
    var t = (now - animation.start) / (animation.end - animation.start);
    animation.progresscb && animation.progresscb(t < 1 ? t : 1);
    if (now > animation.end) {
      // animation ended
      animation.endcb && animation.endcb();
      animations.splice(i--, 1);
      continue;
    }
  }
  requestAnimationFrame(tick);
}

// fallback
window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
  setTimeout(cb, 0);
});

var Ease = {
  linear: function linear(t) {
    return t;
  },
  quadIn: function quadIn(t) {
    return t * t;
  },
  quadOut: function quadOut(t) {
    return t * (2 - t);
  },
  quadInOut: function quadInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  cubicIn: function cubicIn(t) {
    return t * t * t;
  },
  cubicOut: function cubicOut(t) {
    return --t * t * t + 1;
  },
  cubicInOut: function cubicInOut(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  quartIn: function quartIn(t) {
    return t * t * t * t;
  },
  quartOut: function quartOut(t) {
    return 1 - --t * t * t * t;
  },
  quartInOut: function quartInOut(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  quintIn: function quintIn(t) {
    return t * t * t * t * t;
  },
  quintOut: function quintOut(t) {
    return 1 + --t * t * t * t * t;
  },
  quintInOut: function quintInOut(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

function getFontSize () {
  return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
}

var fontSize;

var bysuit = {
  deck: function deck(_deck) {
    _deck.bysuit = _deck.queued(bysuit);

    function bysuit(next) {
      var cards = _deck.cards;

      fontSize = getFontSize();

      cards.forEach(function (card) {
        card.bysuit(function (i) {
          if (i === cards.length - 1) {
            next();
          }
        });
      });
    }
  },
  card: function card(_card) {
    var rank = _card.rank;
    var suit = _card.suit;

    _card.bysuit = function (cb) {
      var i = _card.i;
      var delay = i * 10;

      _card.animateTo({
        delay: delay,
        duration: 400,

        x: -Math.round((6.75 - rank) * 8 * fontSize / 16),
        y: -Math.round((1.5 - suit) * 92 * fontSize / 16),
        rot: 0,

        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

var fontSize$1;

var fan = {
  deck: function deck(_deck) {
    _deck.fan = _deck.queued(fan);

    function fan(next) {
      var cards = _deck.cards;
      var len = cards.length;

      fontSize$1 = getFontSize();

      cards.forEach(function (card, i) {
        card.fan(i, len, function (i) {
          if (i === cards.length - 1) {
            next();
          }
        });
      });
    }
  },
  card: function card(_card) {
    var $el = _card.$el;

    _card.fan = function (i, len, cb) {
      var z = i / 4;
      var delay = i * 10;
      var rot = i / (len - 1) * 260 - 130;

      _card.animateTo({
        delay: delay,
        duration: 300,

        x: -z,
        y: -z,
        rot: 0
      });
      _card.animateTo({
        delay: 300 + delay,
        duration: 300,

        x: Math.cos(deg2rad(rot - 90)) * 55 * fontSize$1 / 16,
        y: Math.sin(deg2rad(rot - 90)) * 55 * fontSize$1 / 16,
        rot: rot,

        onStart: function onStart() {
          $el.style.zIndex = i;
        },

        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

function deg2rad(degrees) {
  return degrees * Math.PI / 180;
}

var style = document.createElement('p').style;
var memoized = {};

function prefix (param) {
  if (typeof memoized[param] !== 'undefined') {
    return memoized[param];
  }

  if (typeof style[param] !== 'undefined') {
    memoized[param] = param;
    return param;
  }

  var camelCase = param[0].toUpperCase() + param.slice(1);
  var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
  var test;

  for (var i = 0, len = prefixes.length; i < len; i++) {
    test = prefixes[i] + camelCase;
    if (typeof style[test] !== 'undefined') {
      memoized[param] = test;
      return test;
    }
  }
}

var has3d;

function translate (a, b, c) {
  typeof has3d !== 'undefined' || (has3d = check3d());

  c = c || 0;

  if (has3d) {
    return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
  } else {
    return 'translate(' + a + ', ' + b + ')';
  }
}

function check3d() {
  // I admit, this line is stealed from the great Velocity.js!
  // http://julian.com/research/velocity/
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    return false;
  }

  var transform = prefix('transform');
  var $p = document.createElement('p');

  document.body.appendChild($p);
  $p.style[transform] = 'translate3d(1px,1px,1px)';

  has3d = $p.style[transform];
  has3d = has3d != null && has3d.length && has3d !== 'none';

  document.body.removeChild($p);

  return has3d;
}

var intro = {
  deck: function deck(_deck) {
    _deck.intro = _deck.queued(intro);

    function intro(next) {
      var cards = _deck.cards;

      cards.forEach(function (card, i) {
        card.setSide('back');
        card.intro(i, function (i) {
          animationFrames(250, 0).start(function () {
            card.setSide('front');
          });
          if (i === cards.length - 1) {
            next();
          }
        });
      });
    }
  },
  card: function card(_card) {
    var transform = prefix('transform');

    var $el = _card.$el;

    _card.intro = function (i, cb) {
      var delay = 500 + i * 10;
      var z = i / 4;

      $el.style[transform] = translate(-z + 'px', '-250px');
      $el.style.opacity = 0;

      _card.x = -z;
      _card.y = -250 - z;
      _card.rot = 0;

      _card.animateTo({
        delay: delay,
        duration: 1000,

        x: -z,
        y: -z,

        onStart: function onStart() {
          $el.style.zIndex = i;
        },
        onProgress: function onProgress(t) {
          $el.style.opacity = t;
        },
        onComplete: function onComplete() {
          $el.style.opacity = '';
          cb && cb(i);
        }
      });
    };
  }
};

var fontSize$2;

var poker = {
  deck: function deck(_deck) {
    _deck.poker = _deck.queued(poker);

    function poker(next) {
      var cards = _deck.cards;
      var len = cards.length;

      fontSize$2 = getFontSize();

      cards.reverse().forEach(function (card, i) {
        card.poker(i, len, function (i) {
          card.setSide('front');
          if (i === cards.length - 1) {
            next();
          }
        });
      });
    }
  },
  card: function card(_card) {
    var $el = _card.$el;

    _card.poker = function (i, len, cb) {
      var delay = i * 250;
      _card.animateTo({
        delay: 0,
        duration: 250,

        x: Math.round((parseInt(i % 7) - 3) * 120 * fontSize$2 / 16),
        y: Math.round(270 + (parseInt(i / 7) - 3) * 150 * fontSize$2 / 16),
        rot: 0,

        onStart: function onStart() {
          $el.style.zIndex = len - 1 + i;
        },
        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

function fisherYates (array) {
  var rnd, temp;

  for (var i = array.length - 1; i; i--) {
    rnd = Math.random() * i | 0;
    temp = array[i];
    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}

function plusMinus (value) {
  var plusminus = Math.round(Math.random()) ? -1 : 1;

  return plusminus * value;
}

var fontSize$3;

var shuffle = {
  deck: function deck(_deck) {
    _deck.shuffle = _deck.queued(shuffle);

    function shuffle(next) {
      var cards = _deck.cards;

      fontSize$3 = getFontSize();

      fisherYates(cards);

      cards.forEach(function (card, i) {
        card.pos = i;

        card.shuffle(function (i) {
          if (i === cards.length - 1) {
            next();
          }
        });
      });
      return;
    }
  },

  card: function card(_card) {
    var $el = _card.$el;

    _card.shuffle = function (cb) {
      var i = _card.pos;
      var z = i / 4;
      var delay = i * 2;

      _card.animateTo({
        delay: delay,
        duration: 200,

        x: plusMinus(Math.random() * 40 + 20) * fontSize$3 / 16,
        y: -z,
        rot: 0
      });
      _card.animateTo({
        delay: 200 + delay,
        duration: 200,

        x: -z,
        y: -z,
        rot: 0,

        onStart: function onStart() {
          $el.style.zIndex = i;
        },

        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

var sort = {
  deck: function deck(_deck) {
    _deck.sort = _deck.queued(sort);

    function sort(next, reverse) {
      var cards = _deck.cards;

      cards.sort(function (a, b) {
        if (reverse) {
          return a.i - b.i;
        } else {
          return b.i - a.i;
        }
      });

      cards.forEach(function (card, i) {
        card.sort(i, cards.length, function (i) {
          if (i === cards.length - 1) {
            next();
          }
        }, reverse);
      });
    }
  },
  card: function card(_card) {
    var $el = _card.$el;

    _card.sort = function (i, len, cb, reverse) {
      var z = i / 4;
      var delay = i * 10;

      _card.animateTo({
        delay: delay,
        duration: 400,

        x: -z,
        y: -150,
        rot: 0,

        onComplete: function onComplete() {
          $el.style.zIndex = i;
        }
      });

      _card.animateTo({
        delay: delay + 500,
        duration: 400,

        x: -z,
        y: -z,
        rot: 0,

        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

var flip = {
  deck: function deck(_deck) {
    _deck.flip = _deck.queued(flip);

    function flip(next, side) {
      var flipped = _deck.cards.filter(function (card) {
        return card.side === 'front';
      }).length / _deck.cards.length;

      _deck.cards.forEach(function (card, i) {
        card.setSide(side ? side : flipped > 0.5 ? 'back' : 'front');
      });
      next();
    }
  }
};

var fontSize$4;

var myReady = {
  deck: function deck(_deck) {
    _deck.myReady = _deck.queued(myReady);

    function myReady(next) {
      var cards = _deck.cards;

      fontSize$4 = getFontSize();

      cards = _deck.cards.slice(0, 4);

      cards.forEach(function (card) {
        card.myReady(function (i) {
          if (i === cards.length - 1) {
            next();
          }
        });
      });
    }
  },
  card: function card(_card) {
    var rank = _card.rank;
    var suit = _card.suit;

    var positionMap = [{ x: -304, y: 70 }, { x: 20, y: 70 }, { x: -304, y: 221 }, { x: 20, y: 221 }];

    _card.myReady = function (cb) {
      var i = _card.i;
      var delay = 0;

      _card.animateTo({
        delay: delay,
        duration: 400,

        x: positionMap[i].x,
        y: positionMap[i].y,
        rot: 0,

        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

var fontSize$5;

var rivalReady = {
  deck: function deck(_deck) {
    _deck.rivalReady = _deck.queued(rivalReady);

    function rivalReady(next) {
      var cards = _deck.cards;

      fontSize$5 = getFontSize();

      cards = _deck.cards.slice(4, 8);

      cards.forEach(function (card) {
        card.rivalReady(function (i) {
          if (i === cards.length - 1) {
            next();
          }
        });
      });
    }
  },
  card: function card(_card) {
    var rank = _card.rank;
    var suit = _card.suit;

    var cardMap = [{ x: -261, y: -240 }, { x: -87, y: -240 }, { x: 87, y: -240 }, { x: 261, y: -240 }];

    var positionMap = [{ x: 20, y: -93 }, { x: -304, y: -93 }, { x: 20, y: -246 }, { x: -304, y: -246 }];

    _card.rivalReady = function (cb) {
      var i = _card.i - 4;
      var delay = 0;

      _card.animateTo({
        delay: delay + 100 * i,
        duration: 400,

        x: cardMap[i].x,
        y: cardMap[i].y,
        rot: 0
      });

      _card.animateTo({
        delay: 600,
        duration: 400,

        x: positionMap[i].x,
        y: positionMap[i].y,
        rot: 0,

        onComplete: function onComplete() {
          cb(i);
        }
      });
    };
  }
};

function observable (target) {
  target || (target = {});
  var listeners = {};

  target.on = on;
  target.one = one;
  target.off = off;
  target.trigger = trigger;

  return target;

  function on(name, cb, ctx) {
    listeners[name] || (listeners[name] = []);
    listeners[name].push({ cb: cb, ctx: ctx });
  }

  function one(name, cb, ctx) {
    listeners[name] || (listeners[name] = []);
    listeners[name].push({
      cb: cb, ctx: ctx, once: true
    });
  }

  function trigger(name) {
    var self = this;
    var args = Array.prototype.slice(arguments, 1);

    var currentListeners = listeners[name] || [];

    currentListeners.filter(function (listener) {
      listener.cb.apply(self, args);

      return !listener.once;
    });
  }

  function off(name, cb) {
    if (!name) {
      listeners = {};
      return;
    }

    if (!cb) {
      listeners[name] = [];
      return;
    }

    listeners[name] = listeners[name].filter(function (listener) {
      return listener.cb !== cb;
    });
  }
}

function queue (target) {
  var array = Array.prototype;

  var queueing = [];
  target.queueing = queueing;

  target.queue = queue;
  target.queued = queued;

  return target;

  function queued(action) {
    return function () {
      var self = this;
      var args = arguments;

      queue(function (next) {
        action.apply(self, array.concat.apply(next, args));
      });
    };
  }

  function queue(action) {
    if (!action) {
      return;
    }

    queueing.push(action);

    if (queueing.length === 1) {
      next();
    }
  }
  function next() {
    queueing[0](function (err) {
      if (err) {
        throw err;
      }

      queueing = queueing.slice(1);

      if (queueing.length) {
        next();
      }
    });
  }
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var EvEmitter = function () {
  function EvEmitter() {
    classCallCheck(this, EvEmitter);
  }

  createClass(EvEmitter, [{
    key: "on",
    value: function on(eventName, listener) {
      if (!eventName || !listener) {
        return;
      }
      // set events hash
      var events = this._events = this._events || {};
      // set listeners array
      var listeners = events[eventName] = events[eventName] || [];
      // only add once
      if (listeners.indexOf(listener) == -1) {
        listeners.push(listener);
      }
      return this;
    }
  }, {
    key: "once",
    value: function once(eventName, listener) {
      if (!eventName || !listener) {
        return;
      }
      // add event
      this.on(eventName, listener);
      // set once flag
      // set onceEvents hash
      var onceEvents = this._onceEvents = this._onceEvents || {};
      // set onceListeners object
      var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
      // set flag
      onceListeners[listener] = true;
      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, listener) {
      var listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      var index = listeners.indexOf(listener);
      if (index != -1) {
        listeners.splice(index, 1);
      }

      return this;
    }
  }, {
    key: "emitEvent",
    value: function emitEvent(eventName, args) {
      var listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      var i = 0;
      var listener = listeners[i];
      args = args || [];
      // once stuff
      var onceListeners = this._onceEvents && this._onceEvents[eventName];

      while (listener) {
        var isOnce = onceListeners && onceListeners[listener];
        if (isOnce) {
          // remove listener
          // remove before trigger to prevent recursion
          this.off(eventName, listener);
          // unset once flag
          delete onceListeners[listener];
        }
        // trigger listener
        listener.apply(this, args);
        // get next listener
        i += isOnce ? 0 : 1;
        listener = listeners[i];
      }
      return this;
    }
  }, {
    key: "show",
    value: function show(eventName) {
      var listeners = this._events;
      console.log(listeners);
    }
  }]);
  return EvEmitter;
}();

var postStartEvents = {
	mousedown: ['mousemove', 'mouseup'],
	touchstart: ['touchmove', 'touchend', 'touchcancel'],
	pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
	MSPointerDown: ['MSPointerMove', 'MSPointerUp', 'MSPointerCancel']
};

var Unipointer = function (_EvEmitter) {
	inherits(Unipointer, _EvEmitter);

	function Unipointer() {
		classCallCheck(this, Unipointer);
		return possibleConstructorReturn(this, (Unipointer.__proto__ || Object.getPrototypeOf(Unipointer)).call(this));
	}

	createClass(Unipointer, [{
		key: 'bindStartEvent',
		value: function bindStartEvent(elem) {
			this._bindStartEvent(elem, true);
		}
	}, {
		key: 'unbindStartEvent',
		value: function unbindStartEvent(elem) {
			this._bindStartEvent(elem, false);
		}
	}, {
		key: '_bindStartEvent',
		value: function _bindStartEvent(elem, isBind) {
			// munge isBind, default to true
			isBind = isBind === undefined ? true : !!isBind;
			var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
			elem[bindMethod]('mousedown', this);
			elem[bindMethod]('touchstart', this);
		}
	}, {
		key: 'handleEvent',
		value: function handleEvent(event) {
			var method = 'on' + event.type;
			if (this[method]) {
				this[method](event);
			}
		}
	}, {
		key: 'onmousedown',
		value: function onmousedown(event) {
			var button = event.button;
			if (button && button !== 0 && button !== 1) {
				return;
			}
			this._pointerDown(event, event);
		}
	}, {
		key: '_pointerDown',
		value: function _pointerDown(event, pointer) {
			this.pointerDown(event, pointer);
		}
	}, {
		key: 'pointerDown',
		value: function pointerDown(event, pointer) {
			this._bindPostStartEvents(event);
			this.emitEvent('pointerDown', [event, pointer]);
		}
	}, {
		key: '_bindPostStartEvents',
		value: function _bindPostStartEvents(event) {
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
		}
	}, {
		key: '_unbindPostStartEvents',
		value: function _unbindPostStartEvents() {
			// check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
			if (!this._boundPointerEvents) {
				return;
			}
			this._boundPointerEvents.forEach(function (eventName) {
				window.removeEventListener(eventName, this);
			}, this);

			delete this._boundPointerEvents;
		}
	}, {
		key: 'onmousemove',
		value: function onmousemove(event) {
			this._pointerMove(event, event);
		}
	}, {
		key: '_pointerMove',
		value: function _pointerMove(event, pointer) {
			this.pointerMove(event, pointer);
		}
	}, {
		key: 'pointerMove',
		value: function pointerMove(event, pointer) {
			this.emitEvent('pointerMove', [event, pointer]);
		}
	}, {
		key: 'onmouseup',
		value: function onmouseup(event) {
			this._pointerUp(event, event);
		}
	}, {
		key: '_pointerUp',
		value: function _pointerUp(event, pointer) {
			this._pointerDone();
			this.pointerUp(event, pointer);
		}
	}, {
		key: 'pointerUp',
		value: function pointerUp(event, pointer) {
			this.emitEvent('pointerUp', [event, pointer]);
		}
	}, {
		key: '_pointerDone',
		value: function _pointerDone() {
			this._unbindPostStartEvents();
		}
	}]);
	return Unipointer;
}(EvEmitter);

var navigator$1 = window.navigator;

function noop$1() {}

var Unidragger = function (_Unipointer) {
  inherits(Unidragger, _Unipointer);

  function Unidragger() {
    classCallCheck(this, Unidragger);
    return possibleConstructorReturn(this, (Unidragger.__proto__ || Object.getPrototypeOf(Unidragger)).call(this));
  }

  createClass(Unidragger, [{
    key: 'bindHandles',
    value: function bindHandles() {
      this._bindHandles(true);
    }
  }, {
    key: 'unbindHandles',
    value: function unbindHandles() {
      this._bindHandles(false);
    }
  }, {
    key: '_bindHandles',
    value: function _bindHandles(isBind) {
      // munge isBind, default to true
      isBind = isBind === undefined ? true : !!isBind;
      // extra bind logic
      var binderExtra;
      if (navigator$1.pointerEnabled) {
        binderExtra = function binderExtra(handle) {
          // disable scrolling on the element
          handle.style.touchAction = isBind ? 'none' : '';
        };
      } else if (navigator$1.msPointerEnabled) {
        binderExtra = function binderExtra(handle) {
          // disable scrolling on the element
          handle.style.msTouchAction = isBind ? 'none' : '';
        };
      } else {
        binderExtra = noop$1;
      }
      // bind each handle
      var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
      for (var i = 0; i < this.handles.length; i++) {
        var handle = this.handles[i];
        this._bindStartEvent(handle, isBind);
        binderExtra(handle);
      }
    }
  }]);
  return Unidragger;
}(Unipointer);

var document$1 = window.document;
function extend(a, b) {
	for (var prop in b) {
		a[prop] = b[prop];
	}
	return a;
}
var docElem$1 = document$1.documentElement;
var transformProperty = typeof docElem$1.style.transform == 'string' ? 'transform' : 'WebkitTransform';

var Draggabilly = function (_Unidragger) {
	inherits(Draggabilly, _Unidragger);

	function Draggabilly(element, options) {
		classCallCheck(this, Draggabilly);

		var _this = possibleConstructorReturn(this, (Draggabilly.__proto__ || Object.getPrototypeOf(Draggabilly)).call(this));

		_this.element = typeof element == 'string' ? document$1.querySelector(element) : element;

		_this.options = extend({}, _this.constructor.defaults);
		_this.option(options);

		_this._create();
		return _this;
	}

	createClass(Draggabilly, [{
		key: 'option',
		value: function option(opts) {
			extend(this.options, opts);
		}
	}, {
		key: '_create',
		value: function _create() {

			this.setHandles();
		}
	}, {
		key: 'setHandles',
		value: function setHandles() {
			this.handles = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element];

			this.bindHandles();
		}
	}]);
	return Draggabilly;
}(Unidragger);

Draggabilly.defaults = {};

var maxZ = 100;

function Card (i) {
  var transform = prefix('transform');

  // calculate rank/suit, etc..
  var rank = i % 13 + 1;
  var suit = i / 13 | 0;
  var z = (52 - i) / 4;

  // create elements
  var $el = createElement('div');
  var $face = createElement('div');
  var $back = createElement('div');

  // states
  var isDraggable = false;
  var isStaticNode = false;
  var isFlippable = false;
  var isMoveBackable = false;

  // self = card
  var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };

  var modules = Deck.modules;
  var module;

  // add classes
  $face.classList.add('face');
  $back.classList.add('back');

  // add default transform
  $el.style[transform] = translate(-z + 'px', -z + 'px');

  // add default values
  self.x = -z;
  self.y = -z;
  self.z = z;
  self.rot = 0;

  self.PosStatus = {
    startPos: {},
    pos: {},
    starttime: 0,
    originPosX: 0,
    originPosY: 0
  };
  self.$container = null;

  // set default side to back
  self.setSide('back');

  // add drag/click listeners
  self.dragObj = new Draggabilly($el, {});
  self.onMousedown = function (e) {
    var startPos = self.PosStatus.startPos;
    var pos = self.PosStatus.pos;

    var starttime = Date.now();
    self.PosStatus.starttime = starttime;

    e.preventDefault();

    if (e.type === 'mousedown') {
      startPos.x = pos.x = e.clientX;
      startPos.y = pos.y = e.clientY;
    } else {
      startPos.x = pos.x = e.touches[0].clientX;
      startPos.y = pos.y = e.touches[0].clientY;
    }

    if (!isDraggable) {
      // is not draggable, do nothing
      return;
    }

    // move card
    $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
    $el.style.zIndex = maxZ++;
  };
  self.onMousemove = function (e) {
    var startPos = self.PosStatus.startPos;
    var pos = self.PosStatus.pos;

    if (!isDraggable) {
      // is not draggable, do nothing
      return;
    }
    if (e.type === 'mousemove') {
      pos.x = e.clientX;
      pos.y = e.clientY;
    } else {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].clientY;
    }

    // move card
    $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
  };
  self.onMouseup = function (e) {
    var startPos = self.PosStatus.startPos;
    var pos = self.PosStatus.pos;
    var starttime = self.PosStatus.starttime;

    if (isFlippable && Date.now() - starttime < 200) {
      // flip sides
      self.setSide(self.side === 'front' ? 'back' : 'front');
    }
    if (!isDraggable) {
      // is not draggable, do nothing
      return;
    }

    // set current position
    self.x = self.x + pos.x - startPos.x;
    self.y = self.y + pos.y - startPos.y;
  };
  self.dragObj.on("pointerDown", self.onMousedown);
  self.dragObj.on("pointerMove", self.onMousemove);
  self.dragObj.on("pointerUp", self.onMouseup);

  // load modules
  for (module in modules) {
    addModule(modules[module]);
  }

  self.animateTo = function (params) {
    var delay = params.delay;
    var duration = params.duration;
    var _params$x = params.x;
    var x = _params$x === undefined ? self.x : _params$x;
    var _params$y = params.y;
    var y = _params$y === undefined ? self.y : _params$y;
    var _params$rot = params.rot;
    var rot = _params$rot === undefined ? self.rot : _params$rot;
    var ease = params.ease;
    var onStart = params.onStart;
    var onProgress = params.onProgress;
    var onComplete = params.onComplete;

    var startX, startY, startRot;
    var diffX, diffY, diffRot;

    animationFrames(delay, duration).start(function () {
      startX = self.x || 0;
      startY = self.y || 0;
      startRot = self.rot || 0;
      onStart && onStart();
    }).progress(function (t) {
      var et = Ease[ease || 'cubicInOut'](t);

      diffX = x - startX;
      diffY = y - startY;
      diffRot = rot - startRot;

      onProgress && onProgress(t, et);

      self.x = startX + diffX * et;
      self.y = startY + diffY * et;
      self.rot = startRot + diffRot * et;

      $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
    }).end(function () {
      onComplete && onComplete();
    });
  };

  self.setAutoMoveBack = function () {
    isMoveBackable = true;
    self.dragObj.on("pointerDown", self.AutoMoveBackEvent);
  };
  self.setNotMoveBack = function () {
    isMoveBackable = false;
    self.PosStatus.originPosX = 0;
    self.PosStatus.originPosY = 0;
    self.dragObj.off("pointerDown", self.AutoMoveBackEvent);
  };
  self.AutoMoveBackEvent = function () {
    var startPos = self.PosStatus.startPos;
    var pos = self.PosStatus.pos;
    self.PosStatus.originPosX = self.x + pos.x - startPos.x;
    self.PosStatus.originPosY = self.y + pos.y - startPos.y;
    self.dragObj.off("pointerDown", self.AutoMoveBackEvent);
  };
  self.AutoMoveBack = function () {
    if (isMoveBackable) {
      self.animateTo({
        delay: 0,
        duration: 300,

        x: self.PosStatus.originPosX,
        y: self.PosStatus.originPosY,
        rot: 0
      });
    }
  };

  self.toStaticNode = function (droppableEl, callback) {
    var $StaticContainer = droppableEl.el;
    isStaticNode = true;
    self.moveToStaticNode(droppableEl, function () {
      self.unmount();
      var $el = createElement('div');
      var $face = createElement('div');
      var $back = createElement('div');
      $face.classList.add('face');
      $back.classList.add('back');
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
      $el.style.position = 'relative';
      $el.style.left = '0px';
      $el.style.top = '0px';
      $el.setAttribute("data-name", self.card.name);
      $StaticContainer.innerHTML = "";
      $StaticContainer.appendChild($el);
      addListener($el, 'click', function () {
        $StaticContainer.removeChild($el);
        self.toDragNode();
      });
      callback && callback();
    });
  };
  self.moveToStaticNode = function (droppableEl, callback) {
    var $StaticContainer = droppableEl.el;
    var offset2 = getOffset($StaticContainer),
        width2 = $StaticContainer.offsetWidth,
        height2 = $StaticContainer.offsetHeight;
    var bodyoffset = getOffset(body),
        bodywidth = document.documentElement.clientWidth,
        bodyheight = document.documentElement.clientHeight;
    offset2 = {
      left: (offset2.left + offset2.right) / 2 - width2 / 2,
      top: (offset2.top + offset2.bottom) / 2 - height2 / 2
    };
    self.animateTo({
      delay: 0,
      duration: 300,

      x: offset2.left - bodywidth / 2 + width2 / 2,
      y: offset2.top - bodyheight / 2 + height2 / 2 - 10,
      rot: 0,
      onComplete: function onComplete() {
        callback && callback();
      }
    });
  };
  self.isStaticNode = function () {
    return isStaticNode;
  };

  self.toDragNode = function () {
    isStaticNode = false;
    self.mount(self.$container);
  };

  // set rank & suit
  self.setRankSuit = function (rank, suit) {
    var suitName = SuitName(suit);
    $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
  };

  self.setRankSuit(rank, suit);

  self.enableDragging = function () {
    // this activates dragging
    if (isDraggable) {
      // already is draggable, do nothing
      return;
    }
    isDraggable = true;
    $el.style.cursor = 'move';
  };

  self.enableFlipping = function () {
    if (isFlippable) {
      // already is flippable, do nothing
      return;
    }
    isFlippable = true;
  };

  self.disableFlipping = function () {
    if (!isFlippable) {
      // already disabled flipping, do nothing
      return;
    }
    isFlippable = false;
  };

  self.disableDragging = function () {
    if (!isDraggable) {
      // already disabled dragging, do nothing
      return;
    }
    isDraggable = false;
    $el.style.cursor = '';
  };

  self.setCard = function (card) {
    self.card = card;
    $el.setAttribute("data-name", card.name);
  };
  self.setPosition = function (_ref) {
    var x = _ref.x;
    var y = _ref.y;
    var z = _ref.z;

    $el.style[transform] = translate(x + 'px', y + 'px');

    self.x = x;
    self.y = y;
  };

  return self;

  function addModule(module) {
    // add card module
    module.card && module.card(self);
  }

  function mount(target) {
    // mount card to target (deck)
    target.appendChild($el);
    self.$container = target;
    self.$root = target;
  }

  function unmount() {
    // unmount from root (deck)
    self.$root && self.$root.removeChild($el);
    self.$root = null;
  }

  function setSide(newSide) {
    // flip sides
    if (newSide === 'front') {
      if (self.side === 'back') {
        $el.removeChild($back);
      }
      self.side = 'front';
      $el.appendChild($face);
      self.setRankSuit(self.rank, self.suit);
    } else {
      if (self.side === 'front') {
        $el.removeChild($face);
      }
      self.side = 'back';
      $el.appendChild($back);
      $el.setAttribute('class', 'card');
    }
  }
}

function SuitName(suit) {
  // return suit name from suit value
  return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
}

function addListener(target, name, listener) {
  target.addEventListener(name, listener);
}

var body = document.body;
var docElem = window.document.documentElement;
function getOffset(el) {
  var offset = el.getBoundingClientRect();
  return {
    top: offset.top + scrollY(),
    left: offset.left + scrollX(),
    right: offset.right + scrollX(),
    bottom: offset.bottom + scrollY()
  };
}
function scrollX() {
  return window.pageXOffset || docElem.scrollLeft;
}
function scrollY() {
  return window.pageYOffset || docElem.scrollTop;
}

function Deck(number) {
  // init cards array
  var cards = new Array(number);

  var $el = createElement('div');
  var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
  var $root;

  var modules = Deck.modules;
  var module;

  // make queueable
  queue(self);

  // load modules
  for (module in modules) {
    addModule(modules[module]);
  }

  // add class
  $el.classList.add('deck');

  var card;

  // create cards
  for (var i = cards.length; i; i--) {
    card = cards[i - 1] = Card(i - 1);
    card.mount($el);
  }

  self.addCard = function () {
    var card;
    var i = self.cards.length;
    self.cards.push(null);
    card = self.cards[i] = Card(i);
    card.mount($el);
    return card;
  };

  return self;

  function mount(root) {
    // mount deck to root
    $root = root;
    $root.appendChild($el);
  }

  function unmount() {
    // unmount deck from root
    $root.removeChild($el);
    self.queueing = [];
  }

  function addModule(module) {
    module.deck && module.deck(self);
  }
}
Deck.animationFrames = animationFrames;
Deck.ease = Ease;
Deck.modules = { bysuit: bysuit, fan: fan, intro: intro, poker: poker, shuffle: shuffle, sort: sort, flip: flip, myReady: myReady, rivalReady: rivalReady };
Deck.Card = Card;
Deck.prefix = prefix;
Deck.translate = translate;

return Deck;

}());
//# sourceMappingURL=deck.js.map
