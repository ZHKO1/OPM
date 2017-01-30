(function () {
'use strict';

function createElement(type) {
    return document.createElement(type);
}

function newElement(type, class_, $contain, Content, attobj) {
    var $el = document.createElement(type);
    if (class_) {
        $el.classList.add(class_);
    }
    if (typeof Content != "undefined") {
        if (typeof Content === "string" || typeof Content === "number") {
            $el.innerHTML = Content;
        } else if (Content.nodeType) {
            $contain.appendChild($el);
        } else {
            throw "Content Param type error";
        }
    }
    if (attobj) {
        for (var att in attobj) {
            $el.setAttribute(att, attobj[att]);
        }
    }
    $contain.appendChild($el);
    return $el;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

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

var Player = function Player(x) {
    classCallCheck(this, Player);

    this.name = x;
};

function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function walk(data) {
        var that = this;
        Object.keys(data).forEach(function (key) {
            that.convert(key, data[key]);
        });
    },
    convert: function convert(key, val) {
        this.defineReactive(this.data, key, val);
    },

    defineReactive: function defineReactive(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function get() {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                childObj = observe(newVal);
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return;
    }

    return new Observer(value);
};

var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function addSub(sub) {
        this.subs.push(sub);
    },

    depend: function depend() {
        Dep.target.addDep(this);
    },

    removeSub: function removeSub(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },

    notify: function notify() {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};

Dep.target = null;

function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.depIds = {};
    this.value = this.get();
}

Watcher.prototype = {
    update: function update() {
        this.run();
    },
    run: function run() {
        var value = this.get();
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    addDep: function addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },
    get: function get() {
        Dep.target = this;
        var value = this.getVMVal(this.exp);
        Dep.target = null;
        return value;
    },

    getVMVal: function getVMVal(exp) {
        var that = this;
        var val = this.vm._data;
        var pattern = new RegExp("^\\[(.*?)\\]$");
        var result = exp.match(pattern);
        var resultArray = [];
        var exp1, exp2, exp3;
        if (result) {
            resultArray = result[1].split(',');
            resultArray = resultArray.map(function (exp) {
                if (exp.indexOf("?") >= 0) {
                    exp1 = exp.split("?")[0];
                    exp2 = exp.split("?")[1].split(":")[0];
                    exp3 = exp.split("?")[1].split(":")[1];
                    if (that.getVMVal(exp1)) {
                        return that.getVMVal(exp2);
                    } else {
                        return that.getVMVal(exp3);
                    }
                } else {
                    return that.getVMVal(exp);
                }
            });
            result = resultArray;
        } else {
            exp = exp.split('.');
            exp.forEach(function (k) {
                val = val[k];
            });
            result = val;
        }
        return result;
    }
};

function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    node2Fragment: function node2Fragment(el) {
        var fragment = document.createDocumentFragment(),
            child;

        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    },

    init: function init() {
        this.compileElement(this.$fragment);
    },

    compileElement: function compileElement(el) {
        var childNodes = el.childNodes,
            me = this;

        [].slice.call(childNodes).forEach(function (node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;

            if (me.isElementNode(node)) {
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1);
            }

            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },

    compile: function compile(node) {
        var nodeAttrs = node.attributes,
            me = this;

        [].slice.call(nodeAttrs).forEach(function (attr) {
            var attrName = attr.name;
            if (me.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                // 事件指令
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                    // 普通指令
                } else {
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }

                node.removeAttribute(attrName);
            }
        });
    },

    compileText: function compileText(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    },

    isDirective: function isDirective(attr) {
        return attr.indexOf('v-') == 0;
    },

    isEventDirective: function isEventDirective(dir) {
        return dir.indexOf('on') === 0;
    },

    isElementNode: function isElementNode(node) {
        return node.nodeType == 1;
    },

    isTextNode: function isTextNode(node) {
        return node.nodeType == 3;
    }
};

// 指令处理集合
var compileUtil = {
    text: function text(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html: function html(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function model(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    title: function title(node, vm, exp) {
        this.bind(node, vm, exp, 'title');
    },

    class: function _class(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function bind(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function eventHandler(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal: function _getVMVal(vm, exp) {
        var that = this;
        var val = vm._data;
        var pattern = new RegExp("^\\[(.*?)\\]$");
        var result = exp.match(pattern);
        var resultArray = [];
        var exp1, exp2, exp3;
        if (result) {
            resultArray = result[1].split(',');
            resultArray = resultArray.map(function (exp) {
                if (exp.indexOf("?") >= 0) {
                    exp1 = exp.split("?")[0];
                    exp2 = exp.split("?")[1].split(":")[0];
                    exp3 = exp.split("?")[1].split(":")[1];
                    if (that._getVMVal(vm, exp1)) {
                        return that._getVMVal(vm, exp2);
                    } else {
                        return that._getVMVal(vm, exp3);
                    }
                } else {
                    return that._getVMVal(vm, exp);
                }
            });
            result = resultArray;
        } else {
            exp = exp.split('.');
            exp.forEach(function (k) {
                val = val[k];
            });
            result = val;
        }
        return result;
    },

    _setVMVal: function _setVMVal(vm, exp, value) {
        var val = vm._data;
        exp = exp.split('.');
        exp.forEach(function (k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};

var updater = {
    textUpdater: function textUpdater(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function htmlUpdater(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function classUpdater(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');
        if (value instanceof Array) {
            node.className = value.join(" ");
        } else if (value instanceof Array) {
            var space = className && String(value) ? ' ' : '';
            node.className = className + space + value;
        } else {}
    },

    titleUpdater: function titleUpdater(node, value, oldValue) {
        node.setAttribute("title", value);
    },

    modelUpdater: function modelUpdater(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};

var MainCard = function () {
    function MainCard(_ref) {
        var card = _ref.card;
        var $el = _ref.$el;
        var position = _ref.position;
        var ground = _ref.ground;
        classCallCheck(this, MainCard);

        var data = this._data = card;
        var that = this;

        this.position = position;
        this.Ground = ground;
        this.Player = this.Ground.Player;
        this.comment = this.Ground.comment;
        this.role = this.Ground.role;
        this.Round = this.Ground.Round;
        this.$CardContain = null;
        this.$el = $el || null;
        this.deckCard = null;

        data.status = {};
        data.status.ActionOver = false;
        data.status.Selected = false;
        data.status.ActionOverClass = "actionOver";
        data.status.SelectedClass = "selected";
        data.status.NullClass = "";
        data.status.defaultClass = "cardContainer";

        this.originData = {
            att: 0,
            spd: 0,
            def: 0
        };

        this.AttackTime = 1;

        Object.keys(data).forEach(function (key) {
            that._proxy(key);
        });
        observe(data, this);
        that.init();
        that.$compile = new Compile(this.$el || document.body, this);
    }

    createClass(MainCard, [{
        key: '_proxy',
        value: function _proxy(key) {
            var that = this;
            Object.defineProperty(that, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return that._data[key];
                },
                set: function proxySetter(newVal) {
                    that._data[key] = newVal;
                }
            });
        }
    }, {
        key: 'drawCard',
        value: function drawCard() {
            //$el.textContent = this.name;\
            var that = this;
            var $el = that.$el;
            that.$el.innerHTML = "";
            var $CardContain = createElement("div");
            $CardContain.classList.add('cardContainer');
            $CardContain.setAttribute("v-class", "[status.defaultClass,status.ActionOver?status.ActionOverClass:status.NullClass,status.Selected?status.SelectedClass:status.NullClass]");
            var $row1 = createElement("div"); //name
            var $row2 = createElement("div"); //rank type
            var $row3 = createElement("div"); //hp speed
            var $row4 = createElement("div"); //skill
            var $row5 = createElement("div"); //att def
            var $row6 = createElement("div"); //effect
            var array = [$row1, $row2, $row3, $row4, $row5, $row6];
            //$row1.style.display = "none";
            //$row2.style.display = "none";
            //$row4.style.display = "none";
            //$row6.style.display = "none";
            array.forEach(function ($row, i) {
                var $head1 = void 0,
                    $body1 = void 0,
                    $head2 = void 0,
                    $body2 = void 0;
                $CardContain.appendChild($row);
                $row.classList.add('row_');
                switch (i) {
                    case 0:
                        $head1 = newElement("div", "head", $row, "Name");
                        $body1 = newElement("div", "body3", $row, "{{name}}");
                        break;
                    case 1:
                        $head1 = newElement("div", "head", $row, "Rank");
                        $body1 = newElement("div", "body1", $row, "{{rank}}");
                        $head2 = newElement("div", "head", $row, " ");
                        $body2 = newElement("div", "body1", $row, " ");
                        break;
                    case 2:
                        $head1 = newElement("div", "head", $row, "Hp");
                        $body1 = newElement("div", "body1", $row, "{{hp}}");
                        $head2 = newElement("div", "head", $row, "Speed");
                        $body2 = newElement("div", "body1", $row, "{{spd}}");
                        break;
                    case 3:
                        $head1 = newElement("div", "head", $row, "Skill");
                        $body1 = newElement("div", "body3", $row, "{{skill}}");
                        break;
                    case 4:
                        $head1 = newElement("div", "head", $row, "Att");
                        $body1 = newElement("div", "body1", $row, "{{att}}");
                        $head2 = newElement("div", "head", $row, "Def");
                        $body2 = newElement("div", "body1", $row, "{{def}}");
                        break;
                    case 5:
                        $head1 = newElement("div", "head", $row, "Effect");
                        $body1 = newElement("div", "body3", $row, "{{effect}}", { "v-title": "effect" });
                        break;
                }
            });
            $el.appendChild($CardContain);
            that.$CardContain = $CardContain;
            that.status.ActionOver && that.setActionOver();
        }
    }, {
        key: 'bind',
        value: function bind() {
            var that = this;
            addListener(that.$CardContain, 'mousedown', onMousedown);
            function onMousedown(e) {
                that.Round.trigger("select", that);
                e.preventDefault();
                return;
            }
        }
    }, {
        key: 'setSelected',
        value: function setSelected() {
            this.status.Selected = true;
        }
    }, {
        key: 'setNotSelected',
        value: function setNotSelected() {
            this.status.Selected = false;
        }
    }, {
        key: 'setActionOver',
        value: function setActionOver() {
            this.status.ActionOver = true;
        }
    }, {
        key: 'setActionable',
        value: function setActionable() {
            this.status.ActionOver = false;
        }
    }, {
        key: 'getAttackTime',
        value: function getAttackTime() {
            return this.AttackTime;
        }
    }, {
        key: 'attackTo',
        value: function attackTo(cardArray) {
            var that = this;
            var damageArray = [];
            var damage = void 0;
            cardArray.forEach(function (card) {
                damage = that.att - card.def >= 0 ? that.att - card.def : 0;
                damageArray.push(damage);
            });
            return damageArray;
        }
    }, {
        key: 'updateHp',
        value: function updateHp(damage) {
            var that = this;
            that.hp = that.hp - damage >= 0 ? that.hp - damage : 0;
            return damage;
        }
    }, {
        key: 'getPriorityAttackedCard',
        value: function getPriorityAttackedCard(ground) {
            var that = this;
            var ObjectArray = ground.getAlive();
            ObjectArray = ObjectArray.sort(function (itemA, itemB) {
                return ToInteger(that.att - itemA.def) / itemA.hp < ToInteger(that.att - itemB.def) / itemB.hp;
            });
            function ToInteger(number) {
                return number <= 0 ? 0 : number;
            }

            return [ObjectArray[0]];
        }
    }, {
        key: 'getAttackedCard',
        value: function getAttackedCard(card, ground) {
            return card;
        }
    }, {
        key: 'defeatedExit',
        value: function defeatedExit(AttackerCard, callback) {
            var that = this;
            that.$CardContain.style.display = "none";
            //that.status.ActionOver = true;
            that.deckCard.hide();
            this.comment.addComment("Defeated", that);
            that.Effect_Defeated(AttackerCard, function () {
                callback && callback();
            });
        }
    }, {
        key: 'reviveBack',
        value: function reviveBack(callback) {
            var that = this;
            that.$CardContain.style.display = "";
            //that.status.ActionOver = false;
            that.deckCard.show();
        }
    }, {
        key: 'init',
        value: function init() {
            var that = this;
            that.drawCard();
            that.bind();
        }
    }, {
        key: '$watch',
        value: function $watch(key, cb) {
            new Watcher(this, key, cb);
        }
    }, {
        key: 'backUpAbitily',
        value: function backUpAbitily(arr) {
            var that = this;
            arr.forEach(function (item) {
                that.originData[item] = that[item];
            });
        }
    }, {
        key: 'returnToAbility',
        value: function returnToAbility(arr) {
            var that = this;
            arr.forEach(function (item) {
                that[item] = that.originData[item];
            });
        }

        // 特效部分
        // 回合开始前加BUFF

    }, {
        key: 'Effect_RoundStartBuff',
        value: function Effect_RoundStartBuff(next) {
            next();
        }
        // 回合结束后加BUFF

    }, {
        key: 'Effect_RoundEndBuff',
        value: function Effect_RoundEndBuff(next) {
            next();
        }

        // 攻击范围

    }, {
        key: 'Effect_setAttackedRange',
        value: function Effect_setAttackedRange() {}

        // 攻击前事件

    }, {
        key: 'Effect_BattleBefore',
        value: function Effect_BattleBefore(AttackedCardArray, next) {
            next({});
        }
        // 战斗结束后事件

    }, {
        key: 'Effect_BattleAfter',
        value: function Effect_BattleAfter(AttackedCardArray, next) {
            next();
        }
    }, {
        key: 'Effect_BeforeAttacked',
        value: function Effect_BeforeAttacked(AttackerCard, AttackedCardArray, next) {
            next();
        }
        // 战斗过程中检查自身状态触发事件

    }, {
        key: 'Effect_checkoutStatus',
        value: function Effect_checkoutStatus(next) {
            next();
        }
        // 被攻击后触发事件

    }, {
        key: 'Effect_AfterAttacked',
        value: function Effect_AfterAttacked(AttackerCard, damage, next) {
            next();
        }

        // 战败事件

    }, {
        key: 'Effect_Defeated',
        value: function Effect_Defeated(AttackerCard, next) {
            next();
        }
    }]);
    return MainCard;
}();

function addListener(target, name, listener) {
    target.addEventListener(name, listener);
}

var Tatsumaki = function (_Card) {
  inherits(Tatsumaki, _Card);

  function Tatsumaki() {
    classCallCheck(this, Tatsumaki);
    return possibleConstructorReturn(this, (Tatsumaki.__proto__ || Object.getPrototypeOf(Tatsumaki)).apply(this, arguments));
  }

  createClass(Tatsumaki, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      if (that.Round.getRound() <= 1) {
        card2 = ground.CardMap["FR"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["FL"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BR"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BL"];
        card2.hp > 0 && result.push(card2);
        that.comment.addComment("Effect", that, "全场攻击");
      } else {
        result = card1;
      }
      return result;
    }
  }]);
  return Tatsumaki;
}(MainCard);

var ChogokinKurobikari = function (_Card) {
  inherits(ChogokinKurobikari, _Card);

  function ChogokinKurobikari(_ref) {
    var card = _ref.card;
    var $el = _ref.$el;
    var position = _ref.position;
    var ground = _ref.ground;
    classCallCheck(this, ChogokinKurobikari);

    var _this = possibleConstructorReturn(this, (ChogokinKurobikari.__proto__ || Object.getPrototypeOf(ChogokinKurobikari)).call(this, { card: card, $el: $el, position: position, ground: ground }));

    _this.EffectStatus = false;
    return _this;
  }

  createClass(ChogokinKurobikari, [{
    key: "Effect_checkoutStatus",
    value: function Effect_checkoutStatus(next) {
      var that = this;
      if (that.hp <= 5 && that.hp > 0 && that.EffectStatus == false) {
        that.comment.addComment("Effect", that, "攻击减3");
        that.att = that.att - 3;
        that.EffectStatus = true;
        next();
      } else {
        next();
      }
    }
  }]);
  return ChogokinKurobikari;
}(MainCard);

var Bang = function (_Card) {
  inherits(Bang, _Card);

  function Bang() {
    classCallCheck(this, Bang);
    return possibleConstructorReturn(this, (Bang.__proto__ || Object.getPrototypeOf(Bang)).apply(this, arguments));
  }

  createClass(Bang, [{
    key: "Effect_AfterAttacked",
    value: function Effect_AfterAttacked(AttackerCard, damage, next) {
      var that = this;
      that.comment.addComment("Effect", that, "反击!");
      var damageArr = that.attackTo([AttackerCard]);
      AttackerCard.updateHp(damageArr[0]);
      that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
      next();
    }
  }]);
  return Bang;
}(MainCard);

var Flash = function (_Card) {
  inherits(Flash, _Card);

  function Flash() {
    classCallCheck(this, Flash);
    return possibleConstructorReturn(this, (Flash.__proto__ || Object.getPrototypeOf(Flash)).apply(this, arguments));
  }

  return Flash;
}(MainCard);

var AtomicZamurai = function (_Card) {
  inherits(AtomicZamurai, _Card);

  function AtomicZamurai() {
    classCallCheck(this, AtomicZamurai);
    return possibleConstructorReturn(this, (AtomicZamurai.__proto__ || Object.getPrototypeOf(AtomicZamurai)).apply(this, arguments));
  }

  return AtomicZamurai;
}(MainCard);

var King = function (_Card) {
  inherits(King, _Card);

  function King() {
    classCallCheck(this, King);
    return possibleConstructorReturn(this, (King.__proto__ || Object.getPrototypeOf(King)).apply(this, arguments));
  }

  createClass(King, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground2) {
      var that = this;
      var ground = ground2;
      var card2 = void 0;
      if (that.Round.getRound() <= 1) {
        that.comment.addComment("Effect", that, "对面攻击力为0!");
        card2 = ground.CardMap["BL"];
        card2.backUpAbitily(["att"]);
        card2.att = 0;
        card2 = ground.CardMap["BR"];
        card2.backUpAbitily(["att"]);
        card2.att = 0;
        card2 = ground.CardMap["FL"];
        card2.backUpAbitily(["att"]);
        card2.att = 0;
        card2 = ground.CardMap["FR"];
        card2.backUpAbitily(["att"]);
        card2.att = 0;
        next();
      } else {
        next();
      }
    }
  }, {
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next, ground2) {
      var that = this;
      var ground = ground2;
      var card2 = void 0;
      if (that.Round.getRound() <= 1) {
        card2 = ground.CardMap["BL"];
        card2.returnToAbility(["att"]);
        card2 = ground.CardMap["BR"];
        card2.returnToAbility(["att"]);
        card2 = ground.CardMap["FL"];
        card2.returnToAbility(["att"]);
        card2 = ground.CardMap["FR"];
        card2.returnToAbility(["att"]);
        next();
      } else {
        next();
      }
    }
  }]);
  return King;
}(MainCard);

var Blast = function (_Card) {
  inherits(Blast, _Card);

  function Blast() {
    classCallCheck(this, Blast);
    return possibleConstructorReturn(this, (Blast.__proto__ || Object.getPrototypeOf(Blast)).apply(this, arguments));
  }

  return Blast;
}(MainCard);

var Bump = function (_Card) {
  inherits(Bump, _Card);

  function Bump() {
    classCallCheck(this, Bump);
    return possibleConstructorReturn(this, (Bump.__proto__ || Object.getPrototypeOf(Bump)).apply(this, arguments));
  }

  createClass(Bump, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      var ground = that.Ground;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = ground.CardMap["BL"];
              break;
            case "FR":
              card2 = ground.CardMap["BR"];
              break;
            case "BL":
              card2 = ground.CardMap["FL"];
              break;
            case "BR":
              card2 = ground.CardMap["FR"];
              break;
          }
          if (card2.id == "S3") {
            card2.att = card2.att + 2;
            that.att = that.att + 2;
            that.comment.addComment("Effect", that, "和邦古组合搭档时触发，本两张卡片攻击加2");
            next();
          } else {
            next();
          }
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return Bump;
}(MainCard);

var Genos = function (_Card) {
  inherits(Genos, _Card);

  function Genos() {
    classCallCheck(this, Genos);
    return possibleConstructorReturn(this, (Genos.__proto__ || Object.getPrototypeOf(Genos)).apply(this, arguments));
  }

  createClass(Genos, [{
    key: "Effect_Defeated",
    value: function Effect_Defeated(AttackerCard, next) {
      var that = this;
      var result = [];
      that.comment.addComment("Effect", that, "绝地反击!");
      var damageArr = that.attackTo([AttackerCard]);
      AttackerCard.updateHp(damageArr[0]);
      that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
      next();
    }
  }]);
  return Genos;
}(MainCard);

var ZombieMan = function (_Card) {
  inherits(ZombieMan, _Card);

  function ZombieMan() {
    classCallCheck(this, ZombieMan);
    return possibleConstructorReturn(this, (ZombieMan.__proto__ || Object.getPrototypeOf(ZombieMan)).apply(this, arguments));
  }

  createClass(ZombieMan, [{
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next, ground2) {
      var that = this;
      if (that.hp <= 9) {
        that.hp = that.hp + 2;
        that.comment.addComment("Effect", that, "Hp加2");
        next();
      } else {
        next();
      }
    }
  }]);
  return ZombieMan;
}(MainCard);

var AmaiMask = function (_Card) {
  inherits(AmaiMask, _Card);

  function AmaiMask() {
    classCallCheck(this, AmaiMask);
    return possibleConstructorReturn(this, (AmaiMask.__proto__ || Object.getPrototypeOf(AmaiMask)).apply(this, arguments));
  }

  createClass(AmaiMask, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground2) {
      var that = this;
      that.comment.addComment("Effect", that, "攻击力减2!");
      that.backUpAbitily(["att"]);
      that.att = that.att - 2;
      next();
    }
  }, {
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        card2 = ground.CardMap["FR"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["FL"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BR"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BL"];
        card2.hp > 0 && result.push(card2);
        that.comment.addComment("Effect", that, "全场攻击");
      }
      return result;
    }
  }, {
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next, ground2) {
      var that = this;
      that.comment.addComment("Effect", that, "攻击力恢复!");
      that.returnToAbility(["att"]);
      next();
    }
  }]);
  return AmaiMask;
}(MainCard);

var BankenMan = function (_Card) {
  inherits(BankenMan, _Card);

  function BankenMan() {
    classCallCheck(this, BankenMan);
    return possibleConstructorReturn(this, (BankenMan.__proto__ || Object.getPrototypeOf(BankenMan)).apply(this, arguments));
  }

  createClass(BankenMan, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      var ground = that.Ground;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = ground.CardMap["BL"];
              break;
            case "FR":
              card2 = ground.CardMap["BR"];
              break;
            case "BL":
              card2 = ground.CardMap["FL"];
              break;
            case "BR":
              card2 = ground.CardMap["FR"];
              break;
          }
          card2.hp = card2.hp + 1;
          card2.att = card2.att + 1;
          that.comment.addComment("Effect", that, "组合搭档体力加1、防御加1");
          next();
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return BankenMan;
}(MainCard);

var KinzokuBat = function (_Card) {
  inherits(KinzokuBat, _Card);

  function KinzokuBat() {
    classCallCheck(this, KinzokuBat);
    return possibleConstructorReturn(this, (KinzokuBat.__proto__ || Object.getPrototypeOf(KinzokuBat)).apply(this, arguments));
  }

  createClass(KinzokuBat, [{
    key: "Effect_AfterAttacked",
    value: function Effect_AfterAttacked(AttackerCard, damage, next) {
      var that = this;
      if (damage > 0) {
        that.comment.addComment("Effect", that, "攻击力加1");
        that.att = that.att + 1;
      }
      next();
    }
  }]);
  return KinzokuBat;
}(MainCard);

var MetalKnight = function (_Card) {
  inherits(MetalKnight, _Card);

  function MetalKnight() {
    classCallCheck(this, MetalKnight);
    return possibleConstructorReturn(this, (MetalKnight.__proto__ || Object.getPrototypeOf(MetalKnight)).apply(this, arguments));
  }

  createClass(MetalKnight, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        switch (card1.position) {
          case "FL":
            card2 = ground.CardMap["FR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "FR":
            card2 = ground.CardMap["FL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BL":
            card2 = ground.CardMap["BR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BR":
            card2 = ground.CardMap["BL"];
            card2.hp > 0 && result.push(card2);
            break;
        }
        that.comment.addComment("Effect", that, "横排AOE攻击");
      }
      return result;
    }
  }]);
  return MetalKnight;
}(MainCard);

var Sonic = function (_Card) {
  inherits(Sonic, _Card);

  function Sonic() {
    classCallCheck(this, Sonic);
    return possibleConstructorReturn(this, (Sonic.__proto__ || Object.getPrototypeOf(Sonic)).apply(this, arguments));
  }

  createClass(Sonic, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        switch (card1.position) {
          case "FL":
            card2 = ground.CardMap["FR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "FR":
            card2 = ground.CardMap["FL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BL":
            card2 = ground.CardMap["BR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BR":
            card2 = ground.CardMap["BL"];
            card2.hp > 0 && result.push(card2);
            break;
        }
        that.comment.addComment("Effect", that, "横排AOE攻击");
      }
      return result;
    }
  }]);
  return Sonic;
}(MainCard);

var DanganTenshi = function (_Card) {
  inherits(DanganTenshi, _Card);

  function DanganTenshi() {
    classCallCheck(this, DanganTenshi);
    return possibleConstructorReturn(this, (DanganTenshi.__proto__ || Object.getPrototypeOf(DanganTenshi)).apply(this, arguments));
  }

  createClass(DanganTenshi, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        switch (card1.position) {
          case "FL":
            card2 = ground.CardMap["BL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "FR":
            card2 = ground.CardMap["BR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BL":
            card2 = ground.CardMap["FL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BR":
            card2 = ground.CardMap["FR"];
            card2.hp > 0 && result.push(card2);
            break;
        }
        that.comment.addComment("Effect", that, "列排AOE攻击");
      }
      return result;
    }
  }]);
  return DanganTenshi;
}(MainCard);

var TankTopMaster = function (_Card) {
  inherits(TankTopMaster, _Card);

  function TankTopMaster() {
    classCallCheck(this, TankTopMaster);
    return possibleConstructorReturn(this, (TankTopMaster.__proto__ || Object.getPrototypeOf(TankTopMaster)).apply(this, arguments));
  }

  createClass(TankTopMaster, [{
    key: "Effect_BattleBefore",
    value: function Effect_BattleBefore(AttackedCardArray, next) {
      var that = this;
      var result = {};
      var AttackedCard = AttackedCardArray[0];
      setTimeout(function () {
        that.comment.addComment("Effect", that, "双方体力减1");
        that.hp = that.hp - 1 >= 0 ? that.hp - 1 : 0;
        AttackedCard.hp = AttackedCard.hp - 1 >= 0 ? AttackedCard.hp - 1 : 0;
        if (that.hp == 0 || AttackedCard.hp == 0) {
          result = {
            skipBattle: true
          };
        }
        next(result);
      }, 300);
    }
  }]);
  return TankTopMaster;
}(MainCard);

var PuripuriPrisoner = function (_Card) {
  inherits(PuripuriPrisoner, _Card);

  function PuripuriPrisoner() {
    classCallCheck(this, PuripuriPrisoner);
    return possibleConstructorReturn(this, (PuripuriPrisoner.__proto__ || Object.getPrototypeOf(PuripuriPrisoner)).apply(this, arguments));
  }

  createClass(PuripuriPrisoner, [{
    key: "Effect_BattleAfter",
    value: function Effect_BattleAfter(AttackedCardArray, next) {
      var that = this;
      var result = {};
      var AttackedCard = AttackedCardArray[0];
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          that.comment.addComment("Effect", that, "本卡片防御减1，受到本卡片攻击的卡片速度减1");
          that.def = that.def - 1 >= 0 ? that.def - 1 : 0;
          AttackedCard.spd = AttackedCard.spd - 1 >= 0 ? AttackedCard.spd - 1 : 0;
          next(result);
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return PuripuriPrisoner;
}(MainCard);

var Dotei = function (_Card) {
  inherits(Dotei, _Card);

  function Dotei() {
    classCallCheck(this, Dotei);
    return possibleConstructorReturn(this, (Dotei.__proto__ || Object.getPrototypeOf(Dotei)).apply(this, arguments));
  }

  createClass(Dotei, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      var ground = that.Ground;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = ground.CardMap["BL"];
              break;
            case "FR":
              card2 = ground.CardMap["BR"];
              break;
            case "BL":
              card2 = ground.CardMap["FL"];
              break;
            case "BR":
              card2 = ground.CardMap["FR"];
              break;
          }
          card2.att = card2.att + 1;
          card2.spd = card2.spd + 1;
          card2.def = card2.def + 1;
          that.comment.addComment("Effect", that, "组合搭档攻击加1、防御加1、速度加1");
          next();
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return Dotei;
}(MainCard);

var Butagami = function (_Card) {
  inherits(Butagami, _Card);

  function Butagami() {
    classCallCheck(this, Butagami);
    return possibleConstructorReturn(this, (Butagami.__proto__ || Object.getPrototypeOf(Butagami)).apply(this, arguments));
  }

  createClass(Butagami, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground) {
      var that = this;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          ["BL", "BR", "FL", "FR"].forEach(function (position) {
            card2 = ground.CardMap[position];
            card2.defeatedExit = function (AttackerCard, callback) {
              var card2 = this;
              card2.$CardContain.style.display = "none";
              card2.status.ActionOver = true;
              card2.deckCard.hide();
              card2.comment.addComment("Defeated", that);
              card2.Effect_Defeated(AttackerCard, function () {
                callback && callback();
                if (that.hp > 0 && that.id == AttackerCard.id) {
                  that.comment.addComment("Effect", that, "造成对方卡片退场时触发，本卡片体力加2");
                  that.hp = that.hp + 2;
                }
                callback && callback();
              });
            };
          });
          next();
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return Butagami;
}(MainCard);

var Iaian = function (_Card) {
  inherits(Iaian, _Card);

  function Iaian() {
    classCallCheck(this, Iaian);
    return possibleConstructorReturn(this, (Iaian.__proto__ || Object.getPrototypeOf(Iaian)).apply(this, arguments));
  }

  createClass(Iaian, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground2) {
      var that = this;
      that.comment.addComment("Effect", that, "先手!");
      that.backUpAbitily(["spd"]);
      that.spd = 1000;
      next();
    }
  }, {
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next, ground2) {
      var that = this;
      that.returnToAbility(["spd"]);
      next();
    }
  }]);
  return Iaian;
}(MainCard);

var Fubuki = function (_Card) {
  inherits(Fubuki, _Card);

  function Fubuki() {
    classCallCheck(this, Fubuki);
    return possibleConstructorReturn(this, (Fubuki.__proto__ || Object.getPrototypeOf(Fubuki)).apply(this, arguments));
  }

  createClass(Fubuki, [{
    key: "Effect_BeforeAttacked",
    value: function Effect_BeforeAttacked(AttackerCard, AttackedCardArray, next) {
      var that = this;
      if (AttackedCardArray.length > 1) {
        AttackerCard.attackTo = function (cardArray) {
          var card2 = this;
          var damageArray = [];
          var damage = void 0;
          cardArray.forEach(function (card) {
            damage = card2.att - card.def >= 0 ? card2.att - card.def : 0;
            damageArray.push(damage);
          });
          that.comment.addComment("Effect", that, "本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半");
          damageArray = damageArray.map(function (damage) {
            return Math.floor(damage * 1.0 / 2);
          });
          return damageArray;
        };
      }
      next();
    }
  }, {
    key: "Effect_AfterAttacked",
    value: function Effect_AfterAttacked(AttackerCard, damage, next) {
      AttackerCard.attackTo = function (cardArray) {
        var that = this;
        var damageArray = [];
        var damage = void 0;
        cardArray.forEach(function (card) {
          damage = that.att - card.def >= 0 ? that.att - card.def : 0;
          damageArray.push(damage);
        });
        return damageArray;
      };
      next();
    }
  }]);
  return Fubuki;
}(MainCard);

var KudohKishi = function (_Card) {
  inherits(KudohKishi, _Card);

  function KudohKishi(_ref) {
    var card = _ref.card;
    var $el = _ref.$el;
    var position = _ref.position;
    var ground = _ref.ground;
    classCallCheck(this, KudohKishi);

    var _this = possibleConstructorReturn(this, (KudohKishi.__proto__ || Object.getPrototypeOf(KudohKishi)).call(this, { card: card, $el: $el, position: position, ground: ground }));

    _this.EffectStatus = false;
    return _this;
  }

  createClass(KudohKishi, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground) {
      var that = this;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = that.Ground.CardMap["BL"];
              break;
            case "FR":
              card2 = that.Ground.CardMap["BR"];
              break;
            case "BL":
              card2 = that.Ground.CardMap["FL"];
              break;
            case "BR":
              card2 = that.Ground.CardMap["FR"];
              break;
          }
          card2.defeatedExit = function (AttackerCard, callback) {
            var card2 = this;
            card2.$CardContain.style.display = "none";
            card2.deckCard.hide();
            card2.comment.addComment("Defeated", card2);
            card2.Effect_Defeated(AttackerCard, function () {
              if (card2.hp <= 0 && !that.EffectStatus) {
                that.EffectStatus = true;
                that.comment.addComment("Effect", that, "组合搭档退场时触发，组合搭档以体力2的状态回到场上");
                card2.hp = 2;
                card2.reviveBack();
              }
              callback && callback();
            });
          };
          next();
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return KudohKishi;
}(MainCard);

var Genus = function (_Card) {
  inherits(Genus, _Card);

  function Genus(_ref) {
    var card = _ref.card;
    var $el = _ref.$el;
    var position = _ref.position;
    var ground = _ref.ground;
    classCallCheck(this, Genus);

    var _this = possibleConstructorReturn(this, (Genus.__proto__ || Object.getPrototypeOf(Genus)).call(this, { card: card, $el: $el, position: position, ground: ground }));

    _this.EffectStatus = false;
    return _this;
  }

  createClass(Genus, [{
    key: "Effect_Defeated",
    value: function Effect_Defeated(AttackerCard, next) {
      var that = this;
      if (that.hp <= 0 && !that.EffectStatus) {
        that.comment.addComment("Effect", that, "复活!体力为2");
        that.hp = 2;
        that.reviveBack();
        that.EffectStatus = true;
      }
      next();
    }
  }]);
  return Genus;
}(MainCard);

var RaikoGenji = function (_Card) {
  inherits(RaikoGenji, _Card);

  function RaikoGenji() {
    classCallCheck(this, RaikoGenji);
    return possibleConstructorReturn(this, (RaikoGenji.__proto__ || Object.getPrototypeOf(RaikoGenji)).apply(this, arguments));
  }

  createClass(RaikoGenji, [{
    key: "Effect_BattleAfter",
    value: function Effect_BattleAfter(AttackedCardArray, next) {
      var that = this;
      var AttackedCard = AttackedCardArray[0];
      setTimeout(function () {
        that.comment.addComment("Effect", that, "hp减1");
        AttackedCard.hp = AttackedCard.hp - 1;
        if (AttackedCard.hp < 0) {
          AttackedCard.hp = 0;
        }
        next();
      }, 300);
    }
  }]);
  return RaikoGenji;
}(MainCard);

var DeathGatlin = function (_Card) {
  inherits(DeathGatlin, _Card);

  function DeathGatlin() {
    classCallCheck(this, DeathGatlin);
    return possibleConstructorReturn(this, (DeathGatlin.__proto__ || Object.getPrototypeOf(DeathGatlin)).apply(this, arguments));
  }

  createClass(DeathGatlin, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        switch (card1.position) {
          case "FL":
            card2 = ground.CardMap["FR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "FR":
            card2 = ground.CardMap["FL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BL":
            card2 = ground.CardMap["BR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BR":
            card2 = ground.CardMap["BL"];
            card2.hp > 0 && result.push(card2);
            break;
        }
        that.comment.addComment("Effect", that, "横排AOE攻击");
      }
      return result;
    }
  }]);
  return DeathGatlin;
}(MainCard);

var Banehige = function (_Card) {
  inherits(Banehige, _Card);

  function Banehige() {
    classCallCheck(this, Banehige);
    return possibleConstructorReturn(this, (Banehige.__proto__ || Object.getPrototypeOf(Banehige)).apply(this, arguments));
  }

  createClass(Banehige, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      setTimeout(function () {
        if (that.hp == 1 && that.att == 2 && that.def == 4) {
          that.comment.addComment("Effect", that, "本卡片攻击变成4，防御变成2");
          that.att = 4;
          that.def = 2;
          next();
        } else {
          next();
        }
      }, 300);
    }
  }, {
    key: "Effect_checkoutStatus",
    value: function Effect_checkoutStatus(next) {
      this.Effect_RoundStartBuff(next);
    }
  }]);
  return Banehige;
}(MainCard);

var Inazumax = function (_Card) {
  inherits(Inazumax, _Card);

  function Inazumax() {
    classCallCheck(this, Inazumax);
    return possibleConstructorReturn(this, (Inazumax.__proto__ || Object.getPrototypeOf(Inazumax)).apply(this, arguments));
  }

  return Inazumax;
}(MainCard);

var Stinger = function (_Card) {
  inherits(Stinger, _Card);

  function Stinger() {
    classCallCheck(this, Stinger);
    return possibleConstructorReturn(this, (Stinger.__proto__ || Object.getPrototypeOf(Stinger)).apply(this, arguments));
  }

  createClass(Stinger, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        switch (card1.position) {
          case "FL":
            card2 = ground.CardMap["BL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "FR":
            card2 = ground.CardMap["BR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BL":
            card2 = ground.CardMap["FL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BR":
            card2 = ground.CardMap["FR"];
            card2.hp > 0 && result.push(card2);
            break;
        }
        that.comment.addComment("Effect", that, "列排AOE攻击");
      }
      return result;
    }
  }]);
  return Stinger;
}(MainCard);

var Okamaitachi = function (_Card) {
  inherits(Okamaitachi, _Card);

  function Okamaitachi() {
    classCallCheck(this, Okamaitachi);
    return possibleConstructorReturn(this, (Okamaitachi.__proto__ || Object.getPrototypeOf(Okamaitachi)).apply(this, arguments));
  }

  createClass(Okamaitachi, [{
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      if (that.Round.getRound() <= 1) {
        card2 = ground.CardMap["BL"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BR"];
        card2.hp > 0 && result.push(card2);
        that.comment.addComment("Effect", that, "远程AOE攻击");
      }
      return result;
    }
  }]);
  return Okamaitachi;
}(MainCard);

var BushiDrill = function (_Card) {
  inherits(BushiDrill, _Card);

  function BushiDrill() {
    classCallCheck(this, BushiDrill);
    return possibleConstructorReturn(this, (BushiDrill.__proto__ || Object.getPrototypeOf(BushiDrill)).apply(this, arguments));
  }

  return BushiDrill;
}(MainCard);

var BlueFire = function (_Card) {
  inherits(BlueFire, _Card);

  function BlueFire() {
    classCallCheck(this, BlueFire);
    return possibleConstructorReturn(this, (BlueFire.__proto__ || Object.getPrototypeOf(BlueFire)).apply(this, arguments));
  }

  createClass(BlueFire, [{
    key: "Effect_BattleAfter",
    value: function Effect_BattleAfter(AttackedCardArray, next) {
      var that = this;
      var AttackedCard = AttackedCardArray[0];
      setTimeout(function () {
        that.comment.addComment("Effect", that, "速度减2");
        AttackedCard.spd = AttackedCard.spd - 2;
        if (AttackedCard.spd < 0) {
          AttackedCard.spd = 0;
        }
        next();
      }, 300);
    }
  }]);
  return BlueFire;
}(MainCard);

var BestPredictor = function (_Card) {
  inherits(BestPredictor, _Card);

  function BestPredictor() {
    classCallCheck(this, BestPredictor);
    return possibleConstructorReturn(this, (BestPredictor.__proto__ || Object.getPrototypeOf(BestPredictor)).apply(this, arguments));
  }

  createClass(BestPredictor, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground2) {
      var that = this;
      var card2 = null;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          that.comment.addComment("Effect", that, "本卡片的组合搭档本回合额外进行一次攻击");
          switch (that.position) {
            case "FL":
              card2 = that.Ground.CardMap["BL"];
              break;
            case "FR":
              card2 = that.Ground.CardMap["BR"];
              break;
            case "BL":
              card2 = that.Ground.CardMap["FL"];
              break;
            case "BR":
              card2 = that.Ground.CardMap["FR"];
              break;
          }
          card2.AttackTime = 2;
          next();
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return BestPredictor;
}(MainCard);

var JusenshaFundoshi = function (_Card) {
  inherits(JusenshaFundoshi, _Card);

  function JusenshaFundoshi() {
    classCallCheck(this, JusenshaFundoshi);
    return possibleConstructorReturn(this, (JusenshaFundoshi.__proto__ || Object.getPrototypeOf(JusenshaFundoshi)).apply(this, arguments));
  }

  createClass(JusenshaFundoshi, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground) {
      var that = this;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = ground.CardMap["BL"];
              break;
            case "FR":
              card2 = ground.CardMap["BR"];
              break;
            case "BL":
              card2 = ground.CardMap["FL"];
              break;
            case "BR":
              card2 = ground.CardMap["FR"];
              break;
          }
          card2.defeatedExit = function (AttackerCard, callback) {
            var card2 = this;
            card2.$CardContain.style.display = "none";
            card2.status.ActionOver = true;
            card2.deckCard.hide();
            card2.comment.addComment("Defeated", card2);
            card2.Effect_Defeated(AttackerCard, function () {
              if (that.hp > 0 && AttackerCard.hp > 0) {
                that.comment.addComment("Effect", that, "组合搭档退场时触发，对攻击来源卡片进行一次反击");
                var damageArr = that.attackTo([AttackerCard]);
                AttackerCard.updateHp(damageArr[0]);
                that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
              }
              callback && callback();
            });
          };
          next();
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return JusenshaFundoshi;
}(MainCard);

var TejinaMan = function (_Card) {
  inherits(TejinaMan, _Card);

  function TejinaMan() {
    classCallCheck(this, TejinaMan);
    return possibleConstructorReturn(this, (TejinaMan.__proto__ || Object.getPrototypeOf(TejinaMan)).apply(this, arguments));
  }

  createClass(TejinaMan, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground2) {
      this.RoundFirst = true;
      next();
    }
  }, {
    key: "updateHp",
    value: function updateHp(damage) {
      var that = this;
      if (that.RoundFirst) {
        that.comment.addComment("Effect", that, "每回合本卡片受到第一次攻击时触发，这次攻击造成的伤害变成0");
        that.RoundFirst = false;
        damage = 0;
      } else {
        that.hp = that.hp - damage >= 0 ? that.hp - damage : 0;
      }
      return damage;
    }
  }]);
  return TejinaMan;
}(MainCard);

var SmileMan = function (_Card) {
  inherits(SmileMan, _Card);

  function SmileMan() {
    classCallCheck(this, SmileMan);
    return possibleConstructorReturn(this, (SmileMan.__proto__ || Object.getPrototypeOf(SmileMan)).apply(this, arguments));
  }

  createClass(SmileMan, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next, ground2) {
      var that = this;
      var card2 = null;
      if (that.Round.getRound() <= 1) {

        switch (that.position) {
          case "FL":
            card2 = that.Ground.CardMap["BL"];
            break;
          case "FR":
            card2 = that.Ground.CardMap["BR"];
            break;
          case "BL":
            card2 = that.Ground.CardMap["FL"];
            break;
          case "BR":
            card2 = that.Ground.CardMap["FR"];
            break;
        }
        card2.$watch("att", function (value, oldVal) {
          if (value < oldVal) {
            that.comment.addComment("Effect", that, "组合搭档攻击、防御或速度数值下降时触发，下降的数值恢复");
            card2.att = oldVal;
          }
        });
        card2.$watch("spd", function (value, oldVal) {
          if (value < oldVal) {
            that.comment.addComment("Effect", that, "组合搭档攻击、防御或速度数值下降时触发，下降的数值恢复");
            card2.spd = oldVal;
          }
        });
        card2.$watch("def", function (value, oldVal) {
          if (value < oldVal) {
            that.comment.addComment("Effect", that, "组合搭档攻击、防御或速度数值下降时触发，下降的数值恢复");
            card2.def = oldVal;
          }
        });
        next();
      } else {
        next();
      }
    }
  }]);
  return SmileMan;
}(MainCard);

var Snack = function (_Card) {
    inherits(Snack, _Card);

    function Snack() {
        classCallCheck(this, Snack);
        return possibleConstructorReturn(this, (Snack.__proto__ || Object.getPrototypeOf(Snack)).apply(this, arguments));
    }

    createClass(Snack, [{
        key: "Effect_RoundStartBuff",
        value: function Effect_RoundStartBuff(next) {
            var that = this;
            setTimeout(function () {
                if (that.hp == 1 && that.status.ActionOver == false) {
                    that.comment.addComment("Effect", that, "本回合不能进行攻击");
                    that.setActionOver();
                    next();
                } else {
                    next();
                }
            }, 300);
        }
    }, {
        key: "Effect_checkoutStatus",
        value: function Effect_checkoutStatus(next) {
            this.Effect_RoundStartBuff(next);
        }
    }]);
    return Snack;
}(MainCard);

var MumenRider = function (_Card) {
    inherits(MumenRider, _Card);

    function MumenRider() {
        classCallCheck(this, MumenRider);
        return possibleConstructorReturn(this, (MumenRider.__proto__ || Object.getPrototypeOf(MumenRider)).apply(this, arguments));
    }

    createClass(MumenRider, [{
        key: "Effect_Defeated",
        value: function Effect_Defeated(AttackerCard, next) {
            var that = this;
            var result = [];
            var card2 = void 0;
            var ground = that.Ground;
            switch (that.position) {
                case "FL":
                    card2 = ground.CardMap["BL"];
                    break;
                case "FR":
                    card2 = ground.CardMap["BR"];
                    break;
                case "BL":
                    card2 = ground.CardMap["FL"];
                    break;
                case "BR":
                    card2 = ground.CardMap["FR"];
                    break;
            }
            if (card2.hp > 0) {
                that.comment.addComment("Effect", that, "组合搭档体力加3");
                card2.hp = card2.hp + 3;
            } else {
                that.comment.addComment("Effect", that, "组合搭档复活!");
                card2.reviveBack();
                card2.hp = 3;
            }
            next();
        }
    }]);
    return MumenRider;
}(MainCard);

var OgonBall = function (_Card) {
    inherits(OgonBall, _Card);

    function OgonBall() {
        classCallCheck(this, OgonBall);
        return possibleConstructorReturn(this, (OgonBall.__proto__ || Object.getPrototypeOf(OgonBall)).apply(this, arguments));
    }

    createClass(OgonBall, [{
        key: "getAttackedCard",
        value: function getAttackedCard(card1, ground) {
            var that = this;
            var result = [];
            var card2 = null;
            card1 = card1[0];
            result.push(card1);
            if (that.Round.getRound() <= 1) {
                switch (card1.position) {
                    case "FL":
                        card2 = ground.CardMap["FR"];
                        card2.hp > 0 && result.push(card2);
                        break;
                    case "FR":
                        card2 = ground.CardMap["FL"];
                        card2.hp > 0 && result.push(card2);
                        break;
                    case "BL":
                        card2 = ground.CardMap["BR"];
                        card2.hp > 0 && result.push(card2);
                        break;
                    case "BR":
                        card2 = ground.CardMap["BL"];
                        card2.hp > 0 && result.push(card2);
                        break;
                }
                that.comment.addComment("Effect", that, "横排AOE攻击");
            }
            return result;
        }
    }]);
    return OgonBall;
}(MainCard);

var TankTopBlackhole = function (_Card) {
    inherits(TankTopBlackhole, _Card);

    function TankTopBlackhole() {
        classCallCheck(this, TankTopBlackhole);
        return possibleConstructorReturn(this, (TankTopBlackhole.__proto__ || Object.getPrototypeOf(TankTopBlackhole)).apply(this, arguments));
    }

    createClass(TankTopBlackhole, [{
        key: "Effect_BattleBefore",
        value: function Effect_BattleBefore(AttackedCardArray, next) {
            var that = this;
            var result = {};
            var AttackedCard = AttackedCardArray[0];
            setTimeout(function () {
                that.comment.addComment("Effect", that, "双方体力减1");
                that.hp = that.hp - 1 >= 0 ? that.hp - 1 : 0;
                AttackedCard.hp = AttackedCard.hp - 1 >= 0 ? AttackedCard.hp - 1 : 0;
                if (that.hp == 0 || AttackedCard.hp == 0) {
                    result = {
                        skipBattle: true
                    };
                }
                next(result);
            }, 300);
        }
    }]);
    return TankTopBlackhole;
}(MainCard);

var DarknessBlade = function (_Card) {
    inherits(DarknessBlade, _Card);

    function DarknessBlade() {
        classCallCheck(this, DarknessBlade);
        return possibleConstructorReturn(this, (DarknessBlade.__proto__ || Object.getPrototypeOf(DarknessBlade)).apply(this, arguments));
    }

    createClass(DarknessBlade, [{
        key: "Effect_BattleAfter",
        value: function Effect_BattleAfter(AttackedCardArray, next) {
            var that = this;
            var AttackedCard = AttackedCardArray[0];
            setTimeout(function () {
                that.comment.addComment("Effect", that, "防御减2");
                AttackedCard.def = AttackedCard.def - 2;
                if (AttackedCard.def < 0) {
                    AttackedCard.def = 0;
                }
                next();
            }, 300);
        }
    }]);
    return DarknessBlade;
}(MainCard);

var JujikeyAndMofuku = function (_Card) {
  inherits(JujikeyAndMofuku, _Card);

  function JujikeyAndMofuku() {
    classCallCheck(this, JujikeyAndMofuku);
    return possibleConstructorReturn(this, (JujikeyAndMofuku.__proto__ || Object.getPrototypeOf(JujikeyAndMofuku)).apply(this, arguments));
  }

  return JujikeyAndMofuku;
}(MainCard);

var GroundOfSnow = function (_Card) {
  inherits(GroundOfSnow, _Card);

  function GroundOfSnow() {
    classCallCheck(this, GroundOfSnow);
    return possibleConstructorReturn(this, (GroundOfSnow.__proto__ || Object.getPrototypeOf(GroundOfSnow)).apply(this, arguments));
  }

  createClass(GroundOfSnow, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      var ground = that.Ground;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = ground.CardMap["BL"];
              break;
            case "FR":
              card2 = ground.CardMap["BR"];
              break;
            case "BL":
              card2 = ground.CardMap["FL"];
              break;
            case "BR":
              card2 = ground.CardMap["FR"];
              break;
          }
          if (card2.id == "B6") {
            card2.att = card2.att + 1;
            that.comment.addComment("Effect", that, "组合搭档时地狱吹雪时触发，搭档攻击加1");
            next();
          } else {
            next();
          }
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return GroundOfSnow;
}(MainCard);

var LittleGirl = function (_Card) {
  inherits(LittleGirl, _Card);

  function LittleGirl() {
    classCallCheck(this, LittleGirl);
    return possibleConstructorReturn(this, (LittleGirl.__proto__ || Object.getPrototypeOf(LittleGirl)).apply(this, arguments));
  }

  createClass(LittleGirl, [{
    key: "Effect_Defeated",
    value: function Effect_Defeated(AttackerCard, next) {
      var that = this;
      var result = [];
      var card2 = void 0;
      var ground = that.Ground;
      switch (that.position) {
        case "FL":
          card2 = ground.CardMap["BL"];
          break;
        case "FR":
          card2 = ground.CardMap["BR"];
          break;
        case "BL":
          card2 = ground.CardMap["FL"];
          break;
        case "BR":
          card2 = ground.CardMap["FR"];
          break;
      }
      if (card2.hp > 0) {
        that.comment.addComment("Effect", that, "组合搭档攻击力加2");
        card2.att = card2.att + 2;
      }
      next();
    }
  }]);
  return LittleGirl;
}(MainCard);

var TeaBoy = function (_Card) {
  inherits(TeaBoy, _Card);

  function TeaBoy() {
    classCallCheck(this, TeaBoy);
    return possibleConstructorReturn(this, (TeaBoy.__proto__ || Object.getPrototypeOf(TeaBoy)).apply(this, arguments));
  }

  return TeaBoy;
}(MainCard);

var Forte = function (_Card) {
  inherits(Forte, _Card);

  function Forte() {
    classCallCheck(this, Forte);
    return possibleConstructorReturn(this, (Forte.__proto__ || Object.getPrototypeOf(Forte)).apply(this, arguments));
  }

  createClass(Forte, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      var ground = that.Ground;
      var card2 = void 0;
      if (that.Round.getRound() <= 1) {
        switch (that.position) {
          case "FL":
            card2 = ground.CardMap["BL"];
            break;
          case "FR":
            card2 = ground.CardMap["BR"];
            break;
          case "BL":
            card2 = ground.CardMap["FL"];
            break;
          case "BR":
            card2 = ground.CardMap["FR"];
            break;
        }
        card2.spd = card2.spd + 1;
        that.comment.addComment("Effect", that, "第一回合准备阶段触发，组合搭档速度加1");
        next();
      } else {
        next();
      }
    }
  }]);
  return Forte;
}(MainCard);

var TankTopTiger = function (_Card) {
  inherits(TankTopTiger, _Card);

  function TankTopTiger() {
    classCallCheck(this, TankTopTiger);
    return possibleConstructorReturn(this, (TankTopTiger.__proto__ || Object.getPrototypeOf(TankTopTiger)).apply(this, arguments));
  }

  return TankTopTiger;
}(MainCard);

var HammerHead = function (_Card) {
  inherits(HammerHead, _Card);

  function HammerHead() {
    classCallCheck(this, HammerHead);
    return possibleConstructorReturn(this, (HammerHead.__proto__ || Object.getPrototypeOf(HammerHead)).apply(this, arguments));
  }

  createClass(HammerHead, [{
    key: "Effect_checkoutStatus",
    value: function Effect_checkoutStatus(next) {
      var that = this;
      if (that.hp <= 0) {
        that.comment.addComment("Effect", that, "第一回合本卡片体力小于1时触发，本卡片体力变成1");
        that.hp = 1;
        next();
      } else {
        next();
      }
    }
  }]);
  return HammerHead;
}(MainCard);

var MonkeyAndEyelash = function (_Card) {
  inherits(MonkeyAndEyelash, _Card);

  function MonkeyAndEyelash() {
    classCallCheck(this, MonkeyAndEyelash);
    return possibleConstructorReturn(this, (MonkeyAndEyelash.__proto__ || Object.getPrototypeOf(MonkeyAndEyelash)).apply(this, arguments));
  }

  createClass(MonkeyAndEyelash, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      var ground = that.Ground;
      var card2 = void 0;
      setTimeout(function () {
        if (that.Round.getRound() <= 1) {
          switch (that.position) {
            case "FL":
              card2 = ground.CardMap["BL"];
              break;
            case "FR":
              card2 = ground.CardMap["BR"];
              break;
            case "BL":
              card2 = ground.CardMap["FL"];
              break;
            case "BR":
              card2 = ground.CardMap["FR"];
              break;
          }
          if (card2.id == "B6") {
            that.att = that.att + 1;
            that.comment.addComment("Effect", that, "组合搭档为地狱吹雪时触发，本卡攻击力加1");
            next();
          } else {
            next();
          }
        } else {
          next();
        }
      }, 300);
    }
  }]);
  return MonkeyAndEyelash;
}(MainCard);

var Lily = function (_Card) {
  inherits(Lily, _Card);

  function Lily() {
    classCallCheck(this, Lily);
    return possibleConstructorReturn(this, (Lily.__proto__ || Object.getPrototypeOf(Lily)).apply(this, arguments));
  }

  return Lily;
}(MainCard);

var SaitamaCitizen = function (_Card) {
  inherits(SaitamaCitizen, _Card);

  function SaitamaCitizen() {
    classCallCheck(this, SaitamaCitizen);
    return possibleConstructorReturn(this, (SaitamaCitizen.__proto__ || Object.getPrototypeOf(SaitamaCitizen)).apply(this, arguments));
  }

  createClass(SaitamaCitizen, [{
    key: 'Effect_RoundStartBuff',
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      if (that.Round.getRound() == 3) {
        that.comment.addComment("Effect", that, "觉醒!");
        var deckCard = that.deckCard;
        var item = CardSaitama.cards[Math.floor(Math.random() * CardSaitama.cards.length)];
        that = new item.class_({
          card: item,
          $el: that.$el,
          position: that.position,
          ground: that.Ground });
        that.deckCard = deckCard;
        that.deckCard.setCard(that);
        that.Ground.CardMap[that.position] = that;
      } else {}
      next();
    }
  }]);
  return SaitamaCitizen;
}(MainCard);

var SaitamaHero = function (_Card) {
  inherits(SaitamaHero, _Card);

  function SaitamaHero() {
    classCallCheck(this, SaitamaHero);
    return possibleConstructorReturn(this, (SaitamaHero.__proto__ || Object.getPrototypeOf(SaitamaHero)).apply(this, arguments));
  }

  createClass(SaitamaHero, [{
    key: "Effect_BattleAfter",
    value: function Effect_BattleAfter(AttackedCardArray, next) {
      var that = this;
      var AttackedCard = AttackedCardArray[0];
      setTimeout(function () {
        that.comment.addComment("Effect", that, "伤害翻倍!");
        var damage = that.att - AttackedCard.def;
        AttackedCard.hp = AttackedCard.hp - damage > 0 ? AttackedCard.hp - damage : 0;
        next();
      }, 300);
      next();
    }
  }]);
  return SaitamaHero;
}(MainCard);

var SaitamaMax = function (_Card) {
  inherits(SaitamaMax, _Card);

  function SaitamaMax() {
    classCallCheck(this, SaitamaMax);
    return possibleConstructorReturn(this, (SaitamaMax.__proto__ || Object.getPrototypeOf(SaitamaMax)).apply(this, arguments));
  }

  return SaitamaMax;
}(MainCard);

var SaitamaNightmare = function (_Card) {
  inherits(SaitamaNightmare, _Card);

  function SaitamaNightmare() {
    classCallCheck(this, SaitamaNightmare);
    return possibleConstructorReturn(this, (SaitamaNightmare.__proto__ || Object.getPrototypeOf(SaitamaNightmare)).apply(this, arguments));
  }

  createClass(SaitamaNightmare, [{
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next) {
      var that = this;
      that.comment.addComment("Effect", that, "攻防降低!");
      that.att = that.att - 2 > 0 ? that.att - 2 : 0;
      that.def = that.def - 2 > 0 ? that.def - 2 : 0;
      next();
    }
  }]);
  return SaitamaNightmare;
}(MainCard);

var SaitamaRookie = function (_Card) {
  inherits(SaitamaRookie, _Card);

  function SaitamaRookie() {
    classCallCheck(this, SaitamaRookie);
    return possibleConstructorReturn(this, (SaitamaRookie.__proto__ || Object.getPrototypeOf(SaitamaRookie)).apply(this, arguments));
  }

  createClass(SaitamaRookie, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      that.comment.addComment("Effect", that, "行动顺序最后");
      that.spd = -10;
      next();
    }
  }]);
  return SaitamaRookie;
}(MainCard);

var SaitamaSensei = function (_Card) {
    inherits(SaitamaSensei, _Card);

    function SaitamaSensei() {
        classCallCheck(this, SaitamaSensei);
        return possibleConstructorReturn(this, (SaitamaSensei.__proto__ || Object.getPrototypeOf(SaitamaSensei)).apply(this, arguments));
    }

    createClass(SaitamaSensei, [{
        key: "Effect_RoundStartBuff",
        value: function Effect_RoundStartBuff(next, ground2) {
            var that = this;
            var card2 = null;
            if (that.Round.getRound() <= 1) {
                switch (that.position) {
                    case "FL":
                        card2 = that.Ground.CardMap["BL"];
                        break;
                    case "FR":
                        card2 = that.Ground.CardMap["BR"];
                        break;
                    case "BL":
                        card2 = that.Ground.CardMap["FL"];
                        break;
                    case "BR":
                        card2 = that.Ground.CardMap["FR"];
                        break;
                }
                card2.$watch("spd", function (value, oldVal) {
                    if (value < oldVal) {
                        that.comment.addComment("Effect", that, "组合搭档攻击防御速度下降时触发，下降的数值恢复");
                        card2.spd = oldVal;
                    }
                });
                card2.$watch("def", function (value, oldVal) {
                    if (value < oldVal) {
                        that.comment.addComment("Effect", that, "组合搭档攻击防御速度下降时触发，下降的数值恢复");
                        card2.def = oldVal;
                    }
                });
                next();
            } else {
                next();
            }
        }
    }]);
    return SaitamaSensei;
}(MainCard);

var SaitamaTheBurst = function (_Card) {
  inherits(SaitamaTheBurst, _Card);

  function SaitamaTheBurst() {
    classCallCheck(this, SaitamaTheBurst);
    return possibleConstructorReturn(this, (SaitamaTheBurst.__proto__ || Object.getPrototypeOf(SaitamaTheBurst)).apply(this, arguments));
  }

  createClass(SaitamaTheBurst, [{
    key: "Effect_BattleAfter",
    value: function Effect_BattleAfter(AttackedCardArray, next) {
      var that = this;
      setTimeout(function () {
        that.comment.addComment("Effect", that, "退场!");
        that.hp = 0;
        next();
      }, 300);
      next();
    }
  }]);
  return SaitamaTheBurst;
}(MainCard);

var LordBoros = function (_Card) {
  inherits(LordBoros, _Card);

  function LordBoros() {
    classCallCheck(this, LordBoros);
    return possibleConstructorReturn(this, (LordBoros.__proto__ || Object.getPrototypeOf(LordBoros)).apply(this, arguments));
  }

  createClass(LordBoros, [{
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next) {
      var that = this;
      that.comment.addComment("Effect", that, "每次回合结束阶段触发，本卡片体力加3");
      that.hp = that.hp + 3;
      next();
    }
  }]);
  return LordBoros;
}(MainCard);

var LordBorosEx = function (_Card) {
  inherits(LordBorosEx, _Card);

  function LordBorosEx() {
    classCallCheck(this, LordBorosEx);
    return possibleConstructorReturn(this, (LordBorosEx.__proto__ || Object.getPrototypeOf(LordBorosEx)).apply(this, arguments));
  }

  createClass(LordBorosEx, [{
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next) {
      var that = this;
      that.comment.addComment("Effect", that, "每次回合结束阶段触发，本卡片体力减1");
      that.hp = that.hp - 1;
      next();
    }
  }, {
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      if (that.Round.getRound() <= 1) {
        card2 = ground.CardMap["FR"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["FL"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BR"];
        card2.hp > 0 && result.push(card2);
        card2 = ground.CardMap["BL"];
        card2.hp > 0 && result.push(card2);
        that.comment.addComment("Effect", that, "全场攻击");
      } else {
        result = card1;
      }
      return result;
    }
  }]);
  return LordBorosEx;
}(MainCard);

var GiantMeteor = function (_Card) {
  inherits(GiantMeteor, _Card);

  function GiantMeteor() {
    classCallCheck(this, GiantMeteor);
    return possibleConstructorReturn(this, (GiantMeteor.__proto__ || Object.getPrototypeOf(GiantMeteor)).apply(this, arguments));
  }

  createClass(GiantMeteor, [{
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next, ground) {
      var that = this;
      var card2 = void 0;
      that.comment.addComment("Effect", that, "全灭!");
      card2 = ground.CardMap["FR"];
      card2.hp = 0;
      card2 = ground.CardMap["FL"];
      card2.hp = 0;
      card2 = ground.CardMap["BR"];
      card2.hp = 0;
      card2 = ground.CardMap["BL"];
      card2.hp = 0;
      next();
    }
  }]);
  return GiantMeteor;
}(MainCard);

var Garou = function (_Card) {
  inherits(Garou, _Card);

  function Garou() {
    classCallCheck(this, Garou);
    return possibleConstructorReturn(this, (Garou.__proto__ || Object.getPrototypeOf(Garou)).apply(this, arguments));
  }

  createClass(Garou, [{
    key: "Effect_RoundEndBuff",
    value: function Effect_RoundEndBuff(next) {
      var that = this;
      that.comment.addComment("Effect", that, "攻击加1、防御加1、速度加1!");
      that.comment.addComment("", "不.....不可能!");
      that.comment.addComment("", "居然是血量加2，攻击加2、防御加2、速度加2!");
      that.hp = that.hp + 2;
      that.att = that.att + 2;
      that.def = that.def + 2;
      that.spd = that.spd + 2;
      next();
    }
  }, {
    key: "Effect_AfterAttacked",
    value: function Effect_AfterAttacked(AttackerCard, damage, next) {
      var that = this;
      that.comment.addComment("Effect", that, "反击!");
      var damageArr = that.attackTo([AttackerCard]);
      AttackerCard.updateHp(damageArr[0]);
      that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
      next();
    }
  }]);
  return Garou;
}(MainCard);

var KingOfStray = function (_Card) {
  inherits(KingOfStray, _Card);

  function KingOfStray() {
    classCallCheck(this, KingOfStray);
    return possibleConstructorReturn(this, (KingOfStray.__proto__ || Object.getPrototypeOf(KingOfStray)).apply(this, arguments));
  }

  createClass(KingOfStray, [{
    key: "attackTo",
    value: function attackTo(cardArray) {
      var that = this;
      var damageArray = [];
      var damage = void 0;
      cardArray.forEach(function (card) {
        damage = Math.floor(card.hp * 1.0 / 2);
        damageArray.push(damage);
      });
      that.comment.addComment("Effect", that, "被攻击的卡片体力减半!");
      return damageArray;
    }
  }]);
  return KingOfStray;
}(MainCard);

var BossOfVillain = function (_Card) {
  inherits(BossOfVillain, _Card);

  function BossOfVillain() {
    classCallCheck(this, BossOfVillain);
    return possibleConstructorReturn(this, (BossOfVillain.__proto__ || Object.getPrototypeOf(BossOfVillain)).apply(this, arguments));
  }

  createClass(BossOfVillain, [{
    key: "Effect_BeforeAttacked",
    value: function Effect_BeforeAttacked(AttackerCard, AttackedCardArray, next) {
      var that = this;
      if (AttackedCardArray.length > 1) {
        AttackerCard.attackTo = function (cardArray) {
          var card2 = this;
          var damageArray = [];
          var damage = void 0;
          cardArray.forEach(function (card) {
            damage = card2.att - card.def >= 0 ? card2.att - card.def : 0;
            damageArray.push(damage);
          });
          that.comment.addComment("Effect", that, "本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半");
          damageArray = damageArray.map(function (damage) {
            return Math.floor(damage * 1.0 / 2);
          });
          return damageArray;
        };
      }
      next();
    }
  }, {
    key: "getAttackedCard",
    value: function getAttackedCard(card1, ground) {
      var that = this;
      var result = [];
      var card2 = null;
      card1 = card1[0];
      result.push(card1);
      if (that.Round.getRound() <= 1) {
        switch (card1.position) {
          case "FL":
            card2 = ground.CardMap["FR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "FR":
            card2 = ground.CardMap["FL"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BL":
            card2 = ground.CardMap["BR"];
            card2.hp > 0 && result.push(card2);
            break;
          case "BR":
            card2 = ground.CardMap["BL"];
            card2.hp > 0 && result.push(card2);
            break;
        }
        that.comment.addComment("Effect", that, "横排AOE攻击");
      }
      return result;
    }
  }, {
    key: "Effect_AfterAttacked",
    value: function Effect_AfterAttacked(AttackerCard, damage, next) {
      AttackerCard.attackTo = function (cardArray) {
        var that = this;
        var damageArray = [];
        var damage = void 0;
        cardArray.forEach(function (card) {
          damage = that.att - card.def >= 0 ? that.att - card.def : 0;
          damageArray.push(damage);
        });
        return damageArray;
      };
      next();
    }
  }]);
  return BossOfVillain;
}(MainCard);

var CardRankS = {
  cards: [{ class_: Tatsumaki, id: "S1", name: "战栗龙卷", rank: "S", hp: 9, spd: 4, att: 7, def: 5, skill: "超念流风暴", effect: "第一回合准备阶段触发，本卡片攻击范围全场攻击" }, { class_: ChogokinKurobikari, id: "S2", name: "超合金黑光", rank: "S", hp: 10, spd: 3, att: 8, def: 5, skill: " 超合金火箭头槌", effect: "本卡片体力小于等于5时触发，本卡片攻击减3" }, { class_: Bang, id: "S3", name: "银色獠牙 邦古", rank: "S", hp: 8, spd: 5, att: 4, def: 7, skill: "流水岩碎拳", effect: "本卡片受到攻击后触发，对攻击来源卡片进行一次反击" }, { class_: Flash, id: "S4", name: "闪光弗莱什", rank: "S", hp: 9, spd: 5, att: 4, def: 4, skill: "闪光流影", effect: "本卡片的行动轮次可以触发，把这次行动机会转让给本卡片的组合搭档" }, { class_: AtomicZamurai, id: "S5", name: "原子武士", rank: "S", hp: 9, spd: 4, att: 9, def: 3, skill: "原子能流 纳米微尘斩", effect: "" }, { class_: King, id: "S6", name: "世上最强生物 KING", rank: "S", hp: 6, spd: 1, att: 1, def: 1, skill: "炼狱无双爆热波动炮！", effect: "第一回合准备阶段触发，对方卡片攻击力全部变成0，第一回合结束阶段对方卡片攻击力恢复" }, { class_: Blast, id: "S7", name: "深藏云雾中的男人 爆破", rank: "S", hp: 10, spd: 5, att: 5, def: 5, skill: "令人绝望的震慑", effect: "" }, { class_: Bump, id: "S8", name: "武术大师 邦普", rank: "S", hp: 8, spd: 5, att: 6, def: 5, skill: "疾风斩铁拳", effect: "和邦古组合搭档时触发，本两张卡片攻击加2" }]
};

var CardRankA = {
  cards: [{ class_: Genos, id: "A1", name: "鬼之改造人 杰诺斯", rank: "A", hp: 7, spd: 4, att: 7, def: 3, skill: "最大威力燃烧炮", effect: "本卡片退场时触发，对造成本卡片退场的卡片进行一次反击" }, { class_: ZombieMan, id: "A2", name: "僵尸男", rank: "A", hp: 10, spd: 2, att: 4, def: 5, skill: " 不死之躯", effect: "每回合结束本卡片体力小于等于9时触发，本卡片体力加2" }, { class_: AmaiMask, id: "A3", name: "甜心假面", rank: "A", hp: 8, spd: 4, att: 6, def: 4, skill: "恶尽斩", effect: "本卡片的行动轮次可以触发，本卡片攻击减2，本回合本卡片攻击范围变成全场攻击，回合结束时攻击数值恢复" }, { class_: BankenMan, id: "A4", name: "警犬侠", rank: "A", hp: 8, spd: 3, att: 3, def: 6, skill: "忠犬的守护", effect: "第一回合准备阶段触发，组合搭档体力加1、防御加1" }, { class_: KinzokuBat, id: "A5", name: "金属球棒", rank: "A", hp: 8, spd: 3, att: 7, def: 3, skill: "荒野球棒龙卷风", effect: "受到伤害时触发，本卡片攻击加1" }, { class_: MetalKnight, id: "A6", name: "金属骑士 波弗伊", rank: "A", hp: 7, spd: 2, att: 6, def: 5, skill: "导弹流星群！", effect: "第一回合准备阶段触发，本卡片攻击范围横排攻" }, { class_: Sonic, id: "A7", name: "音速的索尼克", rank: "A", hp: 8, spd: 5, att: 5, def: 2, skill: "奥义 十影葬", effect: "第一回合准备阶段触发，本卡片攻击范围横排攻击" }, { class_: DanganTenshi, id: "A8", name: "弹丸天使", rank: "A", hp: 8, spd: 4, att: 6, def: 3, skill: "零距离光束炮", effect: "第一回合准备阶段触发，本卡片攻击范围纵列攻击" }]
};

var CardRankB = {
  cards: [{ class_: TankTopMaster, id: "B1", name: "背心尊者", rank: "B", hp: 8, spd: 2, att: 6, def: 4, skill: "背心擒抱", effect: "本卡片发动攻击时触发，本卡片体力减1，被攻击的卡片体力减1" }, { class_: PuripuriPrisoner, id: "B2", name: "性感囚犯", rank: "B", hp: 7, spd: 2, att: 6, def: 4, skill: " 天使冲击", effect: "第一回合后的每次准备阶段触发，本卡片防御减1，受到本卡片攻击的卡片速度减1" }, { class_: Dotei, id: "B3", name: "天才儿童 童帝", rank: "B", hp: 7, spd: 4, att: 3, def: 3, skill: "王道攻略法", effect: "第一回合准备阶段触发，组合搭档攻击加1、防御加1、速度加1" }, { class_: Butagami, id: "B4", name: "猪神", rank: "B", hp: 7, spd: 1, att: 5, def: 3, skill: "无良吞食", effect: "本卡片攻击造成对方卡片退场时触发，本卡片体力加2" }, { class_: Iaian, id: "S5", name: "居合钢", rank: "B", hp: 7, spd: 3, att: 5, def: 2, skill: "必杀居合斩", effect: "每回合准备阶段触发，本卡片行动顺序排到第一位。出现复数居合钢卡片时，先进行随机数运算" }, { class_: Fubuki, id: "B6", name: "地狱吹雪", rank: "B", hp: 7, spd: 2, att: 3, def: 5, skill: "念流回转盾", effect: "本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半" }, { class_: KudohKishi, id: "B7", name: "驱动骑士", rank: "B", hp: 7, spd: 3, att: 3, def: 3, skill: "战术变型·银", effect: "组合搭档退场时触发，组合搭档以体力2的状态回到场上" }, { class_: Genus, id: "B8", name: "进化之家 吉纳斯博士", rank: "B", hp: 4, spd: 1, att: 1, def: 4, skill: "克隆技术", effect: "本卡片首次退场时触发，本卡片体力加2" }]
};

var CardRankC = {
  cards: [{ class_: RaikoGenji, id: "C1", name: "雷光源氏", rank: "C", hp: 6, spd: 4, att: 2, def: 2, skill: "电极二刀流", effect: "本卡片攻击时可以触发，被攻击的卡片速度减2" }, { class_: DeathGatlin, id: "C2", name: "死亡加特林", rank: "C", hp: 6, spd: 2, att: 4, def: 2, skill: "加特林扫射", effect: "第一回合准备阶段触发，本卡片攻击范围横排攻击" }, { class_: Banehige, id: "C3", name: "弹簧胡子", rank: "C", hp: 6, spd: 3, att: 2, def: 4, skill: "踏无暴威", effect: "本卡片体力等于1时触发，本卡片攻击变成4，防御变成2" }, { class_: Inazumax, id: "C4", name: "闪电麦克斯", rank: "C", hp: 5, spd: 4, att: 5, def: 1, skill: "闪电喷气式回旋飞踢", effect: "" }, { class_: Stinger, id: "C5", name: "毒刺小子", rank: "C", hp: 6, spd: 3, att: 2, def: 2, skill: "超巨型螺旋毒刺", effect: "第一回合准备阶段触发，本卡片攻击范围纵列攻击" }, { class_: Okamaitachi, id: "C6", name: "禁断恋爱之太刀 镰鼬", rank: "C", hp: 6, spd: 3, att: 4, def: 1, skill: "镰鼬真空斩", effect: "第一回合准备阶段触发，本卡片攻击范围远程攻击" }, { class_: BushiDrill, id: "C7", name: "钻头武士", rank: "C", hp: 6, spd: 2, att: 4, def: 2, skill: "钻头是我的灵魂啊!", effect: "我的钻头可是能突破天际的啊" }, { class_: BlueFire, id: "C8", name: "青炎", rank: "C", hp: 6, spd: 2, att: 3, def: 2, skill: "大火葬", effect: "本卡片的战斗伤害阶段触发，被攻击的卡片体力减1" }, { class_: BestPredictor, id: "C9", name: "大预言家 皱婆婆", rank: "C", hp: 5, spd: 1, att: 1, def: 2, skill: "先知的大预言", effect: "第一回合准备阶段触发，本卡片的组合搭档本回合额外进行一次攻击" }, { class_: JusenshaFundoshi, id: "C10", name: "重战车兜裆布", rank: "C", hp: 6, spd: 1, att: 4, def: 2, skill: "战车炮冲拳", effect: "组合搭档退场时触发，对攻击来源卡片进行一次反击" }, { class_: TejinaMan, id: "C11", name: "魔术妙手", rank: "C", hp: 6, spd: 2, att: 2, def: 2, skill: "魔幻烟雾", effect: "每回合本卡片受到第一次攻击时触发，这次攻击造成的伤害变成0" }, { class_: SmileMan, id: "C12", name: "微笑超人", rank: "C", hp: 5, spd: 2, att: 3, def: 3, skill: "剑玉连携攻击", effect: "组合搭档攻击、防御或速度数值下降时触发，下降的数值恢复" }]
};

var CardRankD = {
  cards: [{ class_: Snack, id: "D1", name: "蛇咬拳 斯内克", rank: "D", hp: 5, spd: 3, att: 3, def: 1, skill: "蛇形拳", effect: "本卡片体力等于1时触发，本回合本卡片不能进行攻击" }, { class_: MumenRider, id: "D2", name: "无证骑士", rank: "D", hp: 4, spd: 2, att: 1, def: 1, skill: "正义咆哮", effect: "本卡片退场时触发，如果存在组合搭档，组合搭档体力加3，如果组合搭档已退场，组合搭档以体力3的状态回到场上" }, { class_: OgonBall, id: "D3", name: "黄金球", rank: "D", hp: 4, spd: 1, att: 4, def: 1, skill: "形状记忆金弹", effect: "第一回合准备阶段触发，本卡片攻击范围横排攻击" }, { class_: TankTopBlackhole, id: "D4", name: "背心黑洞", rank: "D", hp: 6, spd: 2, att: 4, def: 1, skill: "200公斤握力", effect: "本卡片发动攻击时触发，本卡片体力减1，被攻击的卡片体力减1" }, { class_: DarknessBlade, id: "D5", name: "黑暗炎龙刀使", rank: "D", hp: 3, spd: 1, att: 1, def: 2, skill: "不知何处得来的自信", effect: "本卡片攻击的伤害阶段可以触发，被攻击的卡片防御减2" }, { class_: JujikeyAndMofuku, id: "D6", name: "十字键与丧服吊带", rank: "D", hp: 4, spd: 1, att: 1, def: 3, skill: "吊带回转风暴", effect: "" }, { class_: GroundOfSnow, id: "D7", name: "最大英雄组织 吹雪组", rank: "D", hp: 4, spd: 1, att: 2, def: 1, skill: "以多胜少的实力", effect: "组合搭档时地狱吹雪时触发，搭档攻击加1" }, { class_: LittleGirl, id: "D8", name: "小小萝莉", rank: "D", hp: 4, spd: 1, att: 1, def: 1, skill: "泪汪汪攻势", effect: "退场且存在搭档时触发，搭档本回合攻击加2" }, { class_: TeaBoy, id: "D9", name: "首席弟子 茶岚子", rank: "D", hp: 5, spd: 1, att: 2, def: 1, skill: "水球碳酸拳", effect: "" }, { class_: Forte, id: "D10", name: "节奏英雄福特", rank: "D", hp: 6, spd: 3, att: 1, def: 1, skill: "跟上我的节奏", effect: "第一回合准备阶段触发，组合搭档速度加1" }, { class_: TankTopTiger, id: "D11", name: "背心老虎", rank: "D", hp: 5, spd: 1, att: 2, def: 1, skill: "猛虎下山拳", effect: "" }, { class_: HammerHead, id: "D12", name: "钉头锤", rank: "D", hp: 4, spd: 1, att: 2, def: 2, skill: "车轮攻击", effect: "第一回合本卡片体力小于1时触发，本卡片体力变成1" }, { class_: MonkeyAndEyelash, id: "D13", name: "山猿和睫毛", rank: "D", hp: 5, spd: 2, att: 2, def: 1, skill: "美容修理组合拳", effect: "组合搭档为地狱吹雪时触发，本卡攻击力加1" }, { class_: Lily, id: "D14", name: "三节棍的莉莉", rank: "D", hp: 4, spd: 3, att: 2, def: 1, skill: "漆黑色的三连星", effect: "" }, { class_: SaitamaCitizen, id: "D15", name: "无业游民 琦玉", rank: "D", hp: 5, spd: 1, att: 2, def: 2, skill: "三年的地狱式磨练", effect: "第三回合准备简单触发，本卡片退场，随机选取其他琦玉卡片替换到本卡片的位置" }]
};

var CardSaitama = {
  cards: [{ class_: SaitamaHero, id: "Saitama1", name: "英雄琦玉", rank: "S", hp: 9, spd: 6, att: 8, def: 6, skill: "连续普通拳", effect: "本卡片行动的伤害计算阶段可以触发，这次伤害数值翻倍" }, { class_: SaitamaTheBurst, id: "Saitama2", name: "超爆发! 秃头琦玉之觉醒", rank: "S", hp: 3, spd: 10, att: 100, def: 2, skill: "超市特卖觉醒拳", effect: "本卡片行动结束时可以触发，本卡片退场" }, { class_: SaitamaNightmare, id: "Saitama3", name: "睡梦修罗 琦玉", rank: "A", hp: 6, spd: 5, att: 6, def: 8, skill: "地球有我来守护!", effect: "每回合结束阶段触发，本卡片攻击减2，防御减2" }, { class_: SaitamaRookie, id: "Saitama4", name: "菜鸟 琦玉", rank: "A", hp: 8, spd: 1, att: 8, def: 5, skill: "白菜都被消灭完了", effect: "每回合准备阶段触发，本卡片行动顺序变为最后一位" }, { class_: SaitamaSensei, id: "Saitama5", name: "琦玉 老师", rank: "S", hp: 9, spd: 5, att: 3, def: 4, skill: "随便才是上策", effect: "组合搭档攻击防御速度下降时触发，下降的数值恢复" }, { class_: SaitamaMax, id: "Saitama6", name: "英雄琦玉 认真模式", rank: "S", hp: 9, spd: 1, att: 1000, def: 1000, skill: "必杀 认真殴打", effect: "" }]
};

var CardBOSS = {
  cards: [{ class_: LordBoros, id: "BOSS1", name: "宇宙霸者 波罗斯", rank: "S", hp: 9, spd: 5, att: 7, def: 8, skill: "流星爆发", effect: "每次回合结束阶段触发，本卡片体力加3" }, { class_: LordBorosEx, id: "BOSS2", name: "波罗斯 流星爆发模式", rank: "S", hp: 7, spd: 6, att: 10, def: 7, skill: "崩星咆哮炮", effect: "第一回合准备阶段触发，本卡片攻击范围全场攻击。每次回合结束时触发，本卡片体力减1" }, { class_: GiantMeteor, id: "BOSS3", name: "巨大陨石", rank: "S", hp: 10, spd: 1, att: 0, def: 3, skill: "究极的毁灭阴影", effect: "第一回合结束阶段触发，本卡片的操纵方玩家直接获得胜利" }, { class_: Garou, id: "BOSS4", name: "英雄狩猎者 饿狼", rank: "A", hp: 9, spd: 4, att: 6, def: 5, skill: "怪害神杀拳", effect: "本卡片受到攻击后触发，对攻击来源卡片进行一次反击。每次回合结束阶段触发，本卡片攻击加1、防御加1、速度加1" }, { class_: KingOfStray, id: "BOSS5", name: "流浪帝 长谷川", rank: "S", hp: 9, spd: 2, att: 1, def: 2, skill: "神力的即死攻击", effect: "本卡片的战斗伤害阶段触发，被攻击的卡片体力减半" }, { class_: BossOfVillain, id: "BOSS6", name: "怪人协会首领 赛伊克斯", rank: "S", hp: 9, spd: 4, att: 6, def: 4, skill: "超重力念波", effect: "第一回合准备阶段触发，本卡片攻击范围横排攻击。本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半" }]
};

var card_database = {
  cards: Array.prototype.concat.apply([], [CardRankS.cards, CardRankA.cards, CardRankB.cards, CardRankC.cards, CardRankD.cards, CardBOSS.cards])
};

window.card_database = card_database;

var HalfGround = function () {
    function HalfGround() {
        classCallCheck(this, HalfGround);

        this.role = null;
        this.Player = null;
        this.Round = null;
        this.$el = null;
        this.$Name = null;
        this.$Cards = null;
        this.comment = null;
        this.$CardArray = [];
        this.CardMap = {};
        this.Cards = [];
        this.deck = null;
    }

    createClass(HalfGround, [{
        key: 'initParam',
        value: function initParam(player, role) {
            this.Player = player;
            this.role = role;
        }
    }, {
        key: 'initRound',
        value: function initRound(Round) {
            this.Round = Round;
        }
    }, {
        key: 'initNode',
        value: function initNode($el) {
            var $Name = createElement("div");
            var $Cards = createElement("div");
            $Name.classList.add('name');
            $Cards.classList.add('HalfGroundCards');
            $el.appendChild($Name);
            $el.appendChild($Cards);
            this.$el = $el;
            this.$Name = $Name;
            this.$Cards = $Cards;
            for (var i = 0; i < 4; i++) {
                var $Card = createElement("div");
                $Cards.appendChild($Card);
                $Card.classList.add('HalfGroundCard');
                var backrow = this.role == "host" ? function (i) {
                    return i > 1;
                } : function (i) {
                    return i < 2;
                };
                if (backrow(i)) {
                    $Card.classList.add('backrow');
                }
                this.$CardArray.push($Card);
            }
        }
    }, {
        key: 'setName',
        value: function setName() {
            var $div = createElement("div");
            this.$Name.appendChild($div);
            $div.textContent = this.Player.name;
        }
    }, {
        key: 'setCards',
        value: function setCards(arr) {
            var _this = this;

            var that = this;
            var cards = this.getCardsData(arr);
            var cards_order = this.role == "host" ? ["FL", "FR", "BL", "BR"] : ["BR", "BL", "FR", "FL"];
            cards_order.forEach(function (position, i) {
                var $Card = _this.$CardArray[i];
                var card = new cards[position]["class_"]({
                    card: cards[position],
                    $el: $Card,
                    position: position,
                    ground: that
                });
                _this.CardMap[position] = card;
            });
        }
    }, {
        key: 'getCardsData',
        value: function getCardsData(obj) {
            var cards_ = void 0;
            var cards = {};
            if (!obj) {
                cards_ = JSON.parse(JSON.stringify(card_database.cards));
                cards_.forEach(function (item, i) {
                    item.class_ = card_database.cards[i].class_;
                });
                for (var i = cards_.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var _ref = [cards_[j], cards_[i]];
                    cards_[i] = _ref[0];
                    cards_[j] = _ref[1];
                }
                cards.FL = cards_[0];
                cards.FR = cards_[1];
                cards.BL = cards_[2];
                cards.BR = cards_[3];
            } else {
                cards_ = JSON.parse(JSON.stringify(card_database.cards));
                cards_.forEach(function (item, i) {
                    item.class_ = card_database.cards[i].class_;
                });
                cards.FL = cards_.find(function (item) {
                    return item.id === obj.FL;
                });
                cards.FR = cards_.find(function (item) {
                    return item.id === obj.FR;
                });
                cards.BL = cards_.find(function (item) {
                    return item.id === obj.BL;
                });
                cards.BR = cards_.find(function (item) {
                    return item.id === obj.BR;
                });
            }
            return cards;
        }
    }, {
        key: 'setDeck',
        value: function setDeck(deck) {
            var _this2 = this;

            var that = this;
            this.deck = deck;
            if (this.role == "host") {
                deck.myReady();
            } else {
                if (deck.cards.length <= 4) {
                    (function () {
                        var cards_order = ["FL", "FR", "BL", "BR"];
                        var cardMap = {
                            FL: { x: 10000, y: -240 },
                            FR: { x: 10000, y: -240 },
                            BL: { x: 10000, y: -240 },
                            BR: { x: 10000, y: -240 }
                        };
                        cards_order.forEach(function (position) {
                            var card = deck.addCard();
                            card.enableDragging();
                            card.enableFlipping();
                            card.setCard(_this2.CardMap[position]);
                            card.setPosition({
                                x: cardMap[position].x,
                                y: cardMap[position].y
                            });
                            var DeckContainer = document.getElementById('DeckContainer');
                            deck.mount(DeckContainer);
                        });
                    })();
                }
                deck.rivalReady();
            }

            var cards_order = ["FL", "FR", "BL", "BR"];
            cards_order.forEach(function (position, i) {
                var deckCard = deck.cards[that.role == "host" ? i : i + 4];
                that.CardMap[position].deckCard = deckCard;
                that.CardMap[position].deckCard.disableDragging();
            });
        }
    }, {
        key: 'isActionOver',
        value: function isActionOver() {
            var that = this;
            var result = true;
            var cards_order = ["FL", "FR", "BL", "BR"];
            cards_order.forEach(function (position, i) {
                result = result && (that.CardMap[position].status.ActionOver || !!!that.CardMap[position].hp);
            });
            return result;
        }
    }, {
        key: 'RoundStart',
        value: function RoundStart() {
            var that = this;
            var result = true;
            var cards_order = ["FL", "FR", "BL", "BR"];
            cards_order.forEach(function (position, i) {
                that.CardMap[position].setActionable();
            });
            return result;
        }
    }, {
        key: 'getAlive',
        value: function getAlive() {
            var that = this;
            var result = [];
            var cards_order = ["FL", "FR", "BL", "BR"];
            cards_order.forEach(function (position, i) {
                if (that.CardMap[position].hp) {
                    result.push(that.CardMap[position]);
                }
            });
            return result;
        }
    }, {
        key: 'getAction',
        value: function getAction() {
            var that = this;
            var result = [];
            var cards_order = ["FL", "FR", "BL", "BR"];
            cards_order.forEach(function (position, i) {
                if (that.CardMap[position].hp && !that.CardMap[position].status.ActionOver) {
                    result.push(that.CardMap[position]);
                }
            });
            return result;
        }
    }, {
        key: 'isWashout',
        value: function isWashout() {
            var that = this;
            var result = true;
            var cards_order = ["FL", "FR", "BL", "BR"];
            cards_order.forEach(function (position, i) {
                result = result && !that.CardMap[position].hp;
            });
            return !!result;
        }
    }, {
        key: 'init',
        value: function init(_ref2) {
            var $el = _ref2.$el;
            var Player = _ref2.Player;
            var role = _ref2.role;
            var cards = _ref2.cards;
            var deck = _ref2.deck;

            var that = this;
            that.initParam(Player, role);
            that.initNode($el);
            that.setName();
            that.setCards(cards);
            that.setDeck(deck);
        }
    }]);
    return HalfGround;
}();

function Comment($el) {
    var self = {};
    self.$container = $el;
    self.$ul = null;
    self.init = function () {
        var $ul = newElement("ul", null, $el);
        self.$ul = $ul;
    };

    self.getCardName = function (Card) {
        var role = Card.role;
        var message = "";
        if (role == "host") {
            message = Card.name;
        } else if (role == "guest") {
            message = Card.Player.name + "的" + Card.name;
        } else {}
        return message;
    };
    self.addComment = function (Type) {
        var that = this;
        var $li = void 0;
        var host = void 0;
        var guest = void 0;
        var Carder = "";
        var Attacker = "";
        var Attacked = "";
        var damage = 0;
        var message = void 0;
        var Card = null;
        var AttackerCard = null;
        var AttackedCard = null;
        var ground1 = null;
        var ground2 = null;
        switch (Type) {
            case "Round":
                $li = newElement("li", Type, this.$ul, arguments.length <= 1 ? undefined : arguments[1], {});
                break;
            case "Br":
                $li = newElement("li", Type, this.$ul, "<br/>", {});
                break;
            case "Attack":
                AttackerCard = arguments.length <= 1 ? undefined : arguments[1];
                Attacker = that.getCardName(AttackerCard);
                message = Attacker + "使出 <span class='skill'>" + AttackerCard.skill + "</span>!";
                $li = newElement("li", Type, this.$ul, message, {});
                break;
            case "Damage":
                //Message [host, hostCardName, guest, guestCardName, attack]
                AttackerCard = arguments.length <= 1 ? undefined : arguments[1];
                AttackedCard = arguments.length <= 2 ? undefined : arguments[2];
                Attacker = that.getCardName(AttackerCard);
                Attacked = that.getCardName(AttackedCard);
                damage = arguments.length <= 3 ? undefined : arguments[3];
                if (Number(damage) <= 0) {
                    message = "没有对 " + Attacked + " 造成影响";
                } else {
                    message = Attacked + "损失了 <span class='damage'>" + damage + "</span> 的HP";
                }
                $li = newElement("li", Type, this.$ul, message, {});
                break;
            case "Defeated":
                //Message [host, hostCardName, guest, guestCardName, attack]
                AttackerCard = arguments.length <= 1 ? undefined : arguments[1];
                Attacker = that.getCardName(AttackerCard);
                message = Attacker + " <span class='damage'>落败!</span>";
                $li = newElement("li", Type, this.$ul, message, {});
                break;
            case "Effect":
                Card = arguments.length <= 1 ? undefined : arguments[1];
                message = arguments.length <= 2 ? undefined : arguments[2];
                Carder = that.getCardName(Card);
                message = Carder + " 特效发动: " + "<span class='damage'>" + message + "</span>" + " !";
                $li = newElement("li", Type, this.$ul, message, {});
                break;
            case "GameOver":
                ground1 = arguments.length <= 1 ? undefined : arguments[1];
                ground2 = arguments.length <= 2 ? undefined : arguments[2];
                host = ground1.Player.name;
                guest = ground2.Player.name;
                message = host + "获胜!";
                $li = newElement("li", Type, this.$ul, message, {});
                break;
            default:
                $li = newElement("li", Type, this.$ul, arguments.length <= 1 ? undefined : arguments[1], {});
                break;
        }
        that.$container.scrollTop = that.$ul.clientHeight;
    };

    self.init();
    return self;
}

function observable (target) {
    target || (target = {});
    var listeners = {};

    target.on = on;
    target.one = one;
    target.off = off;
    target.trigger = trigger;
    target.list = list;

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
        var args = Array.prototype.slice.call(arguments, 1);

        var currentListeners = listeners[name] || [];

        currentListeners.filter(function (listener) {
            listener.cb.apply(self, args);

            return !listener.once;
        });
    }

    function list(name) {
        var self = this;
        var currentListeners = listeners[name] || [];
        return currentListeners;
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

var queue = function () {
    function queue() {
        classCallCheck(this, queue);

        this.queueing = [];
    }

    createClass(queue, [{
        key: "queued",
        value: function queued(action, context) {
            var that = this;
            return function () {
                var self = this;
                var args = arguments;

                that.queue(function (next) {
                    action.apply(context, Array.prototype.concat.apply(next, args));
                });
            };
        }
    }, {
        key: "queue",
        value: function queue(action) {
            var self = this;
            if (!action) {
                return;
            }

            self.queueing.push(action);

            if (self.queueing.length === 1) {
                self.next();
            }
        }
    }, {
        key: "next",
        value: function next() {
            var self = this;
            self.queueing[0](function (err) {
                if (err) {
                    throw err;
                }

                self.queueing = self.queueing.slice(1);

                if (self.queueing.length) {
                    self.next();
                }
            });
        }
    }]);
    return queue;
}();

function Round(ground1, ground2) {
    var Round = 0;
    var self = void 0;
    var AttackerCard = null;
    var AttackedCardArray = [];
    var isGameOver = false;
    var $comment = document.getElementById('comment');
    var comment = Comment($comment);
    var player1 = ground1.Player;
    ground1.comment = comment;
    var player2 = ground2.Player;
    ground2.comment = comment;

    self = observable({ Round: Round });

    // 玩家点击卡片的逻辑
    self.on("select", function (card) {
        self.clickCardCallback(card);
    });
    self.clickCardCallback = function (card) {
        var that = this;
        if (!AttackerCard && !card.status.ActionOver) {
            AttackerCard = card;
            card.setSelected();
        } else if (!AttackerCard && card.status.ActionOver) {} else if (AttackerCard === card) {
            AttackerCard = null;
            card.setNotSelected();
        } else if (AttackerCard && AttackedCardArray.length == 0) {
            if (that.checkCardRole(card)) {
                AttackedCardArray = [card];
                card.setSelected();
                self.run(self.OnceBattleStep);
            }
        } else {
            throw "选择卡片机制抛出错误";
        }
    };

    // tool工具属性 有效帮助判断状态之类的
    self.checkCardRole = function (card) {
        if (AttackerCard.role !== card.role) {
            return true;
        } else {
            return false;
        }
    };
    self.getRound = function () {
        return Round;
    };

    // 流程控制运作器
    self.run = function (generator, callback) {
        var it = generator();

        function go(result) {
            if (result.done) {
                callback && callback();
                return result.value;
            }
            return result.value.then(function (value) {
                return go(it.next(value));
            }, function (error) {
                return go(it.throw(error));
            });
        }

        go(it.next());
    };

    // 流程控制-卡片战斗的逻辑
    var OnceBattleStep = regeneratorRuntime.mark(function OnceBattleStep() {
        var that, status, damageArray, AttackerCardAttackTime;
        return regeneratorRuntime.wrap(function OnceBattleStep$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        that = this;
                        status = void 0;
                        damageArray = void 0;
                        AttackerCardAttackTime = void 0;
                        _context.prev = 4;
                        _context.next = 7;
                        return that.initAttackedCards();

                    case 7:
                        _context.next = 9;
                        return that.initAttackerCardAttackTime();

                    case 9:
                        AttackerCardAttackTime = _context.sent;
                        _context.next = 12;
                        return that.OnceBattleStart();

                    case 12:
                        _context.next = 14;
                        return that.checkBeforeAttackerCardEvent();

                    case 14:
                        status = _context.sent;
                        _context.next = 17;
                        return that.checkBeforeAttackedCardsEvent();

                    case 17:
                        if (status.skipBattle) {
                            _context.next = 37;
                            break;
                        }

                    case 18:
                        if (!AttackerCardAttackTime) {
                            _context.next = 37;
                            break;
                        }

                        _context.next = 21;
                        return that.getAttackerCardDamage();

                    case 21:
                        damageArray = _context.sent;
                        _context.next = 24;
                        return that.getAttackedCardHp(damageArray);

                    case 24:
                        damageArray = _context.sent;
                        _context.next = 27;
                        return that.addDamageComment(damageArray);

                    case 27:
                        _context.next = 29;
                        return that.checkAfterAttackerCardEvent();

                    case 29:
                        _context.next = 31;
                        return that.checkAfterAttackedCardsEvent(damageArray);

                    case 31:
                        AttackerCardAttackTime--;

                        if (!(AttackerCardAttackTime >= 1)) {
                            _context.next = 35;
                            break;
                        }

                        _context.next = 35;
                        return that.addAttackTimeComment();

                    case 35:
                        _context.next = 18;
                        break;

                    case 37:
                        _context.next = 39;
                        return that.checkCardsEvent();

                    case 39:
                        _context.next = 41;
                        return that.checkDefeatedCards();

                    case 41:
                        _context.next = 43;
                        return that.OnceBattleCompleted();

                    case 43:
                        _context.next = 48;
                        break;

                    case 45:
                        _context.prev = 45;
                        _context.t0 = _context['catch'](4);
                        throw _context.t0;

                    case 48:
                    case 'end':
                        return _context.stop();
                }
            }
        }, OnceBattleStep, this, [[4, 45]]);
    });
    self.OnceBattleStep = function () {
        return OnceBattleStep.call(self);
    };
    self.initAttackedCards = function () {
        return new Promise(function (resolve, reject) {
            AttackedCardArray = AttackerCard.getAttackedCard(AttackedCardArray, ground1.role == AttackerCard.role ? ground2 : ground1);
            resolve();
        });
    };
    self.initAttackerCardAttackTime = function () {
        return new Promise(function (resolve, reject) {
            var Time = AttackerCard.getAttackTime();
            resolve(Time);
        });
    };
    self.addAttackTimeComment = function () {
        return new Promise(function (resolve, reject) {
            comment.addComment("", "发动连击!");
            resolve();
        });
    };
    self.updateAttackerCard = function () {
        return new Promise(function (resolve, reject) {
            AttackerCard.setNotSelected();
            resolve();
        });
    };
    self.updateAttackedCard = function () {
        return new Promise(function (resolve, reject) {
            AttackedCardArray.forEach(function (AttackedCard) {
                AttackedCard.setNotSelected();
            });
            resolve();
        });
    };
    self.addAttackComment = function () {
        return new Promise(function (resolve, reject) {
            comment.addComment("Attack", AttackerCard);
            resolve();
        });
    };
    self.OnceBattleStart = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            Promise.all([that.updateAttackerCard(), that.updateAttackedCard(), that.addAttackComment()]).then(function () {
                resolve();
            });
        });
    };
    self.checkBeforeAttackerCardEvent = function () {
        return new Promise(function (resolve, reject) {
            AttackerCard.Effect_BattleBefore(AttackedCardArray, function (result) {
                resolve(result);
            });
        });
    };
    self.checkBeforeAttackedCardEvent = function (Card) {
        return new Promise(function (resolve, reject) {
            Card.Effect_BeforeAttacked(AttackerCard, AttackedCardArray, function () {
                resolve();
            });
        });
    };
    self.checkBeforeAttackedCardsEvent = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            AttackedCardArray.forEach(function (item, i) {
                CardEventArray.push(that.checkBeforeAttackedCardEvent(item));
            });
            Promise.all(CardEventArray).then(function () {
                resolve();
            });
        });
    };
    self.checkAfterAttackerCardEvent = function () {
        return new Promise(function (resolve, reject) {
            AttackerCard.Effect_BattleAfter(AttackedCardArray, function () {
                resolve();
            });
        });
    };
    self.checkAfterAttackedCardEvent = function (Card, damage) {
        return new Promise(function (resolve, reject) {
            Card.Effect_AfterAttacked(AttackerCard, damage, function () {
                resolve();
            });
        });
    };
    self.checkAfterAttackedCardsEvent = function (damageArray) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            AttackedCardArray.forEach(function (item, i) {
                CardEventArray.push(that.checkAfterAttackedCardEvent(item, damageArray[i]));
            });
            Promise.all(CardEventArray).then(function () {
                resolve();
            });
        });
    };
    self.getAttackerCardDamage = function () {
        return new Promise(function (resolve, reject) {
            var damageArray = AttackerCard.attackTo(AttackedCardArray);
            resolve(damageArray);
        });
    };
    self.getAttackedCardHp = function (damageArray) {
        return new Promise(function (resolve, reject) {
            AttackedCardArray.forEach(function (AttackedCard, i) {
                damageArray[i] = AttackedCard.updateHp(damageArray[i]);
            });
            resolve(damageArray);
        });
    };
    self.addDamageComment = function (damageArray) {
        return new Promise(function (resolve, reject) {
            damageArray.forEach(function (damage, i) {
                (typeof damage === 'undefined' ? 'undefined' : _typeof(damage)) && comment.addComment("Damage", AttackerCard, AttackedCardArray[i], damage);
            });
            resolve();
        });
    };
    self.checkCardEvent = function (card) {
        return new Promise(function (resolve, reject) {
            card.Effect_checkoutStatus(function () {
                resolve();
            });
        });
    };
    self.checkCardsEvent = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            AttackedCardArray.concat([AttackerCard]).forEach(function (item) {
                CardEventArray.push(that.checkCardEvent(item));
            });
            Promise.all(CardEventArray).then(function () {
                resolve();
            });
        });
    };
    self.checkDefeatedCard = function (card) {
        return new Promise(function (resolve, reject) {
            if (card.hp <= 0) {
                card.defeatedExit(AttackerCard, function () {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    };
    self.checkDefeatedCards = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            AttackedCardArray.concat([AttackerCard]).forEach(function (item) {
                CardEventArray.push(that.checkDefeatedCard(item));
            });
            Promise.all(CardEventArray).then(function () {
                resolve();
            });
        });
    };
    self.OnceBattleCompleted = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            AttackerCard.setActionOver();
            AttackerCard = null;
            AttackedCardArray = [];
            comment.addComment("Br");
            self.trigger("ManualTransmission");
            resolve();
        });
    };

    // 流程控制-回合制战斗的逻辑
    var OnceRoundStep = regeneratorRuntime.mark(function OnceRoundStep() {
        var that, result, sortResult, beginBuff, endBuff, BattleResult;
        return regeneratorRuntime.wrap(function OnceRoundStep$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        that = this;
                        result = void 0;
                        sortResult = void 0;
                        beginBuff = void 0;
                        endBuff = void 0;
                        BattleResult = void 0;
                        _context2.prev = 6;

                    case 7:
                        if (isGameOver) {
                            _context2.next = 30;
                            break;
                        }

                        _context2.next = 10;
                        return that.StartRound();

                    case 10:
                        result = _context2.sent;
                        _context2.next = 13;
                        return that.sortCardsSpeed();

                    case 13:
                        sortResult = _context2.sent;
                        _context2.next = 16;
                        return that.checkCardsBeginBuff(sortResult);

                    case 16:
                        beginBuff = _context2.sent;
                        return _context2.delegateYield(that.startRoundBattle(), 't0', 18);

                    case 18:
                        isGameOver = _context2.t0;
                        _context2.next = 21;
                        return that.OnceRoundCompleted(isGameOver);

                    case 21:
                        if (isGameOver) {
                            _context2.next = 28;
                            break;
                        }

                        _context2.next = 24;
                        return that.sortCardsSpeed();

                    case 24:
                        sortResult = _context2.sent;
                        _context2.next = 27;
                        return that.checkCardsEndBuff(sortResult);

                    case 27:
                        endBuff = _context2.sent;

                    case 28:
                        _context2.next = 7;
                        break;

                    case 30:
                        _context2.next = 35;
                        break;

                    case 32:
                        _context2.prev = 32;
                        _context2.t1 = _context2['catch'](6);
                        throw _context2.t1;

                    case 35:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, OnceRoundStep, this, [[6, 32]]);
    });
    self.OnceRoundStep = function () {
        return OnceRoundStep.call(self);
    };
    self.StartRound = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.nextRound();
            resolve();
        });
    };
    self.sortCardsSpeed = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var G1ActionCards = ground1.getAction();
            var G2ActionCards = ground2.getAction();
            var AllActionCards = G1ActionCards.concat(G2ActionCards);
            AllActionCards.forEach(function (item) {
                var random = Math.random() * 0.25;
                item.spd_ = item.spd + random;
            });
            AllActionCards = AllActionCards.sort(function (itemA, itemB) {
                return itemA.spd_ < itemB.spd_;
            });
            resolve(AllActionCards);
        });
    };
    self.checkCardsBeginBuff = function (sortArray) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var queue$$ = new queue();
            sortArray.forEach(function (item) {
                queue$$.queued(item.Effect_RoundStartBuff, item)(ground1.role == item.role ? ground2 : ground1);
            });
            queue$$.queued(resolve)();
        });
    };
    var startRoundBattle = regeneratorRuntime.mark(function startRoundBattle() {
        var that, i, isAuto, sortResult;
        return regeneratorRuntime.wrap(function startRoundBattle$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        that = this;
                        i = void 0, isAuto = void 0, sortResult = void 0;
                        _context3.next = 4;
                        return that.sortCardsSpeed();

                    case 4:
                        sortResult = _context3.sent;

                    case 5:
                        if (!(sortResult.length > 0 && !ground1.isWashout() && !ground2.isWashout())) {
                            _context3.next = 22;
                            break;
                        }

                        _context3.next = 8;
                        return that.NextStepMoudle();

                    case 8:
                        isAuto = _context3.sent;

                        if (!isAuto) {
                            _context3.next = 17;
                            break;
                        }

                        _context3.next = 12;
                        return that.sortCardsSpeed();

                    case 12:
                        sortResult = _context3.sent;

                        AttackerCard = sortResult[0];
                        AttackedCardArray = sortResult[0].getPriorityAttackedCard(ground1.role == sortResult[0].role ? ground2 : ground1);
                        _context3.next = 17;
                        return that.startCardBattle();

                    case 17:
                        _context3.next = 19;
                        return that.sortCardsSpeed();

                    case 19:
                        sortResult = _context3.sent;
                        _context3.next = 5;
                        break;

                    case 22:
                        if (!(ground1.isWashout() || ground2.isWashout())) {
                            _context3.next = 26;
                            break;
                        }

                        return _context3.abrupt('return', true);

                    case 26:
                        return _context3.abrupt('return', false);

                    case 27:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, startRoundBattle, this);
    });
    self.startRoundBattle = function (argument) {
        return startRoundBattle.call(self, argument);
    };
    self.startCardBattle = function (argument) {
        var that = this;
        return new Promise(function (resolve, reject) {
            self.run(self.OnceBattleStep, function () {
                resolve();
            });
        });
    };
    self.OnceRoundCompleted = function (isGameOver) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (isGameOver) {
                if (ground1.isWashout() || ground2.isWashout()) {
                    ground1.isWashout() && that.GameOver(ground2, ground1) && resolve(true);
                    ground2.isWashout() && that.GameOver(ground1, ground2) && resolve(true);
                    return;
                }
            } else {
                if (ground1.isActionOver() && ground2.isActionOver()) {
                    ground1.RoundStart();
                    ground2.RoundStart();
                    resolve(false);
                }
            }
        });
    };
    self.checkCardsEndBuff = function (sortArray) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var queue$$ = new queue();
            sortArray.forEach(function (item) {
                queue$$.queued(item.Effect_RoundEndBuff, item)(ground1.role == item.role ? ground2 : ground1);
            });
            queue$$.queued(resolve)();
        });
    };
    self.nextRound = function () {
        Round++;
        comment.addComment("Round", "Round" + Round);
    };
    self.GameOver = function (ground1, ground2) {
        comment.addComment("GameOver", ground1, ground2);
        return true;
    };
    self.NextStepMoudle = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var thing = function thing() {
                resolve(true);
            };
            removeListener$1(document.getElementById("test"), 'mousedown', thing);
            addListener$1(document.getElementById("test"), 'mousedown', thing);
            self.off("ManualTransmission");
            self.on("ManualTransmission", function () {
                resolve(false);
            });
        });
    };
    return self;
}

function addListener$1(target, name, listener) {
    target.addEventListener(name, listener);
}
function removeListener$1(target, name, listener) {
    target.removeEventListener(name, listener);
}

var docElem = window.document.documentElement;
// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;

    return function () {
        var context = scope || this;
        var now = +new Date(),
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
        bottom: offset.bottom + scrollY()
    };
}
function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

var Droppable = function () {
    function Droppable(droppableEl, options) {
        classCallCheck(this, Droppable);

        this.el = droppableEl;
        this.draggableObj = null;
        this.options = extend({}, this.options);
        extend(this.options, options);
    }

    createClass(Droppable, [{
        key: 'isDroppable',
        value: function isDroppable(draggableEl) {
            var offset1 = getOffset(draggableEl),
                width1 = draggableEl.offsetWidth,
                height1 = draggableEl.offsetHeight,
                offset2 = getOffset(this.el),
                width2 = this.el.offsetWidth,
                height2 = this.el.offsetHeight;
            offset2 = {
                left: (offset2.left + offset2.right) / 2 - width2 / 2,
                top: (offset2.top + offset2.bottom) / 2 - height2 / 2
            };
            return !(offset2.left > offset1.left + width1 - width1 / 2 || offset2.left + width2 < offset1.left + width1 / 2 || offset2.top > offset1.top + height1 - height1 / 2 || offset2.top + height2 < offset1.top + height1 / 2);
        }
    }, {
        key: 'highlight',
        value: function highlight(draggableEl) {
            if (this.isDroppable(draggableEl)) this.options.setDroppabledHighLight(this);else this.options.removeDroppabledHighLight(this);
        }
    }, {
        key: 'collect',
        value: function collect(draggableEl, draggableObj) {
            this.options.removeDroppabledHighLight(this);
            this.options.onDrop(this, draggableEl, draggableObj);
        }
    }]);
    return Droppable;
}();

var Draggable = function () {
    function Draggable(dragEl, dragObj, dragObjMethod, droppables, options) {
        classCallCheck(this, Draggable);

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

        };
        this.initEvents();
    }

    createClass(Draggable, [{
        key: 'initEvents',
        value: function initEvents() {
            this.draggie.on('pointerDown', this.events.onDragStart);
            this.draggie.on('pointerMove', this.events.onDragMove);
            this.draggie.on('pointerUp', this.events.onDragEnd);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.draggie.off('pointerDown', this.events.onDragStart);
            this.draggie.off('pointerMove', this.events.onDragMove);
            this.draggie.off('pointerUp', this.events.onDragEnd);
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(instance, event, pointer) {
            if (this.FirstStatus) {
                this.options.onFirstStart();
                this.FirstStatus = false;
            }
            this.options.onStart();

            this.highlightDroppables();
        }
    }, {
        key: 'onDragMove',
        value: function onDragMove(instance, event, pointer) {
            this.options.onDrag();
            this.highlightDroppables();
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(instance, event, pointer) {
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
    }, {
        key: 'highlightDroppables',
        value: function highlightDroppables(el) {
            for (var i = 0, len = this.droppables.length; i < len; ++i) {
                this.droppables[i].highlight(this.el);
            }
        }
    }]);
    return Draggable;
}();

Draggable.prototype.options = {
    draggabilly: {},
    // if the item should animate back to its original position
    animBack: true,
    // clone the draggable and insert it on the same position while dragging the original one
    helper: false,
    // callbacks
    onStart: function onStart() {
        return false;
    },
    onDrag: function onDrag() {
        return false;
    },
    onEnd: function onEnd(wasDropped) {
        return false;
    }
};

function SelectCard($el, next) {
    var self = {};
    self.$container = $el;
    var RankContainer = document.getElementById('RankContainer');
    var RankCardContainer = document.getElementById('RankCardContainer');
    var dropOverlay = document.getElementById('drop-overlay');
    var SelectedCardContainer = document.getElementById('SelectedCardContainer');
    var DeckContainer = document.getElementById('DeckContainer');
    var body = document.body;
    var prefix = Deck.prefix;
    var transform = prefix('transform');
    var translate = Deck.translate;
    self.deck = Deck();

    self.configRank = [{ RankS: CardRankS }, { RankA: CardRankA }, { RankB: CardRankB }, { RankC: CardRankC }, { RankD: CardRankD }];
    self.next = next;

    self.setDroppables = function () {
        var droppableArr = [];
        self.droppableArr = droppableArr;
        [].slice.call(document.querySelectorAll('#SelectedCardContainer .drop-area__item')).forEach(function (el) {
            droppableArr.push(new Droppable(el, {
                onDrop: function onDrop(instance, draggableEl, draggableObj) {
                    if (!instance.draggableObj) {
                        instance.draggableObj = draggableObj;
                    } else {
                        (function () {
                            instance.el.innerHTML = "";
                            var card = instance.draggableObj;
                            if (self.deck.cards.filter(function (item) {
                                return !item.isStaticNode();
                            }).filter(function (item) {
                                return item.card.id == card.card.id;
                            }).length == 0) {
                                card.toDragNode();
                                card.AutoMoveBack();
                            } else {
                                self.deck.cards = self.deck.cards.filter(function (item) {
                                    return !(item.isStaticNode() && item.card.id == card.card.id);
                                });
                                card.unmount();
                            }
                            instance.draggableObj = draggableObj;
                        })();
                    }
                },
                isDroppable: function isDroppable(draggableObj) {
                    var dropedCardArr = droppableArr.filter(function (item) {
                        return item.draggableObj;
                    }).map(function (item) {
                        return item.draggableObj.card;
                    });
                    dropedCardArr = dropedCardArr.filter(function (item) {
                        var boolean = item.name == draggableObj.dragObjMethod.card.name;
                        return boolean;
                    });
                    if (dropedCardArr.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                },

                setDroppabledHighLight: function setDroppabledHighLight(instance) {
                    instance.el.classList.add('highlight');
                },
                removeDroppabledHighLight: function removeDroppabledHighLight(instance) {
                    instance.el.classList.remove('highlight');
                }
            }));
        });
        return droppableArr;
    };

    var Droppables = self.setDroppables();

    self.init = function () {
        var that = this;
        that.bind();
        that.initRankItem();
    };
    self.initRankItem = function () {
        var that = this;
        that.configRank.forEach(function (item) {
            var grid__item = newElement("div", "grid__item", that.$container, Object.keys(item)[0], {});
            grid__item.Rank = Object.keys(item)[0];
            grid__item.RankCards = item[grid__item.Rank];
            (function (grid__item) {
                addListener$2(grid__item, "click", function () {
                    that.showCards(grid__item);
                });
            })(grid__item);
        });
    };
    self.bind = function () {
        addListener$2(dropOverlay, "click", function () {
            self.deck.cleanDragCard();
            body.classList.remove('drag-active');
            RankCardContainer.classList.remove('show');
        });
    };
    self.showCards = function (Rank) {
        var that = this;
        body.classList.add('drag-active');
        RankCardContainer.classList.add('show');
        var RankCards = Rank.RankCards.cards;
        self.deck.cleanDragCard();
        RankCards.forEach(function (RankCard) {
            var card = self.deck.addCard();
            card.enableDragging();
            card.enableFlipping();
            card.setCard(RankCard);
            var card_ = new Draggable(card.dragObj.element, card.dragObj, card, Droppables, {
                onFirstStart: function onFirstStart() {
                    self.ShowSelectedCardContainer();
                    card.setAutoMoveBack();
                },
                onStart: function onStart() {
                    self.ShowSelectedCardContainer();
                },
                onDrag: function onDrag() {
                    self.ShowSelectedCardContainer();
                },
                onEnd: function onEnd(wasDropped, droppableEl) {
                    if (!wasDropped) {
                        card.AutoMoveBack();
                        self.HideSelectedCardContainer();
                    } else {
                        card.toStaticNode(droppableEl, function () {
                            self.HideSelectedCardContainer();
                            self.checkoutCards();
                        });
                    }
                }
            });
            card.DraggableObj = card_;
        });
        self.deck.mount(DeckContainer);
        self.deck.intro();
        self.deck.sort();
        self.deck.poker();
    };
    self.checkoutCards = function () {
        var that = this;
        var droppableArr = self.droppableArr;
        var dropedCardArr = droppableArr.filter(function (item) {
            return item.draggableObj;
        }).map(function (item) {
            return item.draggableObj.card.id;
        });
        var Player_Cards = { FL: dropedCardArr[0], FR: dropedCardArr[1], BL: dropedCardArr[2], BR: dropedCardArr[3] };

        if (dropedCardArr.length == 4) {
            self.ExitFromSelectedCard(Player_Cards);
            self.next && self.next(Player_Cards, self.deck);
        }
    };

    self.ExitFromSelectedCard = function (Player_Cards) {
        body.classList.remove('drag-active');
        RankCardContainer.classList.remove('show');
        RankContainer.style.display = "none";
        SelectedCardContainer.classList.remove('show');
        self.deck.cards.forEach(function (item) {
            !item.isStaticNode() && item.unmount();
        });
        self.deck.cards = self.deck.cards.filter(function (item) {
            return item.isStaticNode();
        });
        self.deck.cards = self.deck.cards.map(function (card, i) {
            card.id = i;
            return card;
        });
        self.deck.cards.forEach(function (item) {
            item.toDragNode();
            item.DraggableObj.destroy();
            item.setNotMoveBack();
        });
        //根据选择的卡片再次整理
        var Selected_Card = [Player_Cards.FL, Player_Cards.FR, Player_Cards.BL, Player_Cards.BR];
        self.deck.cards.forEach(function (item) {
            Selected_Card.forEach(function (item_, i) {
                if (item.card.id == item_) item.card.sort_id = i;
            });
        });
        self.deck.cards.sort(function (itemA, itemB) {
            return itemA.card.sort_id - itemB.card.sort_id;
        });
        self.deck.cards.forEach(function (item, i) {
            item.i = i;
            delete item.card.sort_id;
        });
        [].slice.call(document.querySelectorAll('#SelectedCardContainer .drop-area__item')).forEach(function (el) {
            el.innerHTML = "";
        });
    };

    self.ShowSelectedCardContainer = function () {
        SelectedCardContainer.classList.add('show');
    };
    self.HideSelectedCardContainer = function () {
        SelectedCardContainer.classList.remove('show');
    };

    self.init();
    return self;
}

function addListener$2(target, name, listener) {
    target.addEventListener(name, listener);
}

var $live = document.getElementById('live');
var $Ground1 = createElement("div");
var $Ground2 = createElement("div");
$Ground1.classList.add('HalfGround');
$Ground2.classList.add('HalfGround');
$live.appendChild($Ground1);
$live.appendChild($Ground2);

var selectItems = document.getElementById('grid');
SelectCard(selectItems, function (Player1_Cards, deck) {
    var GameContainer = document.getElementById('GameContainer');
    GameContainer.classList.add("show");

    var Player1 = new Player("Player1");
    var Ground1 = new HalfGround();
    var Player2 = new Player("Player2");
    var Player2_Cards = { FL: "BOSS2", FR: "BOSS3", BL: "BOSS4", BR: "BOSS5" };
    var Ground2 = new HalfGround();

    var round = Round(Ground1, Ground2);
    Ground1.initRound(round);
    Ground2.initRound(round);
    Ground1.init({ $el: $Ground2, Player: Player1, role: "host", cards: Player1_Cards, deck: deck });
    Ground2.init({ $el: $Ground1, Player: Player2, role: "guest", cards: Player2_Cards, deck: deck });

    window.G1 = Ground1;
    window.G2 = Ground2;

    round.run(round.OnceRoundStep);
});

}());
//# sourceMappingURL=index.js.map
