(function () {
'use strict';

var card_database = {
  cards: [{ id: "1", name: "蛇咬拳 斯内克", rank: "D", hp: 5, spd: 3, att: 3, def: 1, skill: "蛇形拳", effect: "体力剩余1时无法发动攻击" }, { id: "2", name: "无证骑士", rank: "D", hp: 4, spd: 2, att: 1, def: 1, skill: "正义咆哮", effect: "战败后组合搭档恢复至半血,(包括复活)" }, { id: "3", name: "黄金球", rank: "D", hp: 4, spd: 1, att: 4, def: 1, skill: "形状记忆金弹", effect: "攻击范围两格" }, { id: "4", name: "背心黑洞", rank: "D", hp: 6, spd: 2, att: 4, def: 1, skill: "200公斤握力", effect: "战斗时自己的体力减1,给予对手的伤害加1" }, { id: "5", name: "黑暗炎龙使者", rank: "D", hp: 3, spd: 1, att: 1, def: 2, skill: "不知何处得来的自信", effect: "对手防御减2" }, { id: "6", name: "十字键与丧服吊带", rank: "D", hp: 4, spd: 1, att: 1, def: 3, skill: "吊带回转风暴", effect: "" }]
};

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

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var Player = function Player(x) {
  classCallCheck(this, Player);

  this.name = x;
};

var Card = function () {
  function Card(_ref) {
    var card = _ref.card;
    var $el = _ref.$el;
    var player = _ref.player;
    var role = _ref.role;
    var round = _ref.round;
    classCallCheck(this, Card);

    _extends(this, card);
    this.Player = player;
    this.role = role;
    this.Round = round;
    this.$CardContain = null;
    this.$el = $el || null;
    this.status = {
      ActionOver: false };
    this.init();
  }

  createClass(Card, [{
    key: 'drawCard',
    value: function drawCard() {
      //$el.textContent = this.name;\
      var that = this;
      var $el = that.$el;
      var $CardContain = createElement("div");
      $CardContain.classList.add('cardContainer');
      var $row1 = createElement("div"); //name
      var $row2 = createElement("div"); //rank type
      var $row3 = createElement("div"); //spd hp
      var $row4 = createElement("div"); //skill
      var $row5 = createElement("div"); //att def
      var $row6 = createElement("div"); //effect
      var array = [$row1, $row2, $row3, $row4, $row5, $row6];
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
            $body1 = newElement("div", "body3", $row, that.name);
            break;
          case 1:
            $head1 = newElement("div", "head", $row, "Rank");
            $body1 = newElement("div", "body1", $row, that.rank);
            $head2 = newElement("div", "head", $row, " ");
            $body2 = newElement("div", "body1", $row, " ");
            break;
          case 2:
            $head1 = newElement("div", "head", $row, "Speed");
            $body1 = newElement("div", "body1", $row, that.spd);
            $head2 = newElement("div", "head", $row, "Hp");
            $body2 = newElement("div", "body1", $row, that.hp);
            break;
          case 3:
            $head1 = newElement("div", "head", $row, "Skill");
            $body1 = newElement("div", "body3", $row, that.skill);
            break;
          case 4:
            $head1 = newElement("div", "head", $row, "Att");
            $body1 = newElement("div", "body1", $row, that.att);
            $head2 = newElement("div", "head", $row, "Def");
            $body2 = newElement("div", "body1", $row, that.def);
            break;
          case 5:
            $head1 = newElement("div", "head", $row, "Effect");
            $body1 = newElement("div", "body3", $row, that.effect, { title: that.effect });
            break;
        }
      });
      $el.appendChild($CardContain);
      that.$CardContain = $CardContain;
      that.status.ActionOver && that.disableSelected();
    }
  }, {
    key: 'bind',
    value: function bind() {
      var that = this;
      addListener(that.$CardContain, 'mousedown', onMousedown);
      function onMousedown(e) {
        var starttime = Date.now();
        that.Round.trigger("select", that);
        e.preventDefault();
        return;
      }
    }
  }, {
    key: 'setSelected',
    value: function setSelected() {
      var that = this;
      that.$CardContain.classList.add("selected");
    }
  }, {
    key: 'setNotSelected',
    value: function setNotSelected() {
      var that = this;
      that.$CardContain.classList.remove("selected");
    }
  }, {
    key: 'disableSelected',
    value: function disableSelected() {
      this.status.ActionOver = true;
      this.$CardContain.classList.add("actionOver");
    }
  }, {
    key: 'enableSelected',
    value: function enableSelected() {
      this.status.ActionOver = false;
      this.$CardContain.classList.remove("actionOver");
    }
  }, {
    key: 'attackTo',
    value: function attackTo(card) {
      var that = this;
      var damage = that.att - card.def >= 0 ? that.att - card.def : 0;
      card.hp = card.hp - damage >= 0 ? card.hp - damage : 0;
      return damage;
    }
  }, {
    key: 'defeatedExit',
    value: function defeatedExit(callback) {
      var that = this;
      that.$CardContain.style.display = "none";
      that.status.ActionOver = true;
      callback && callback();
    }
  }, {
    key: 'update',
    value: function update(callback) {
      var that = this;
      that.$el.innerHTML = "";
      that.drawCard();
      that.bind();
      callback && callback();
    }
  }, {
    key: 'init',
    value: function init() {
      var that = this;
      that.drawCard();
      that.bind();
    }
  }]);
  return Card;
}();

function addListener(target, name, listener) {
  target.addEventListener(name, listener);
}

var HalfGround = function () {
  function HalfGround() {
    classCallCheck(this, HalfGround);

    this.role = null;
    this.Player = null;
    this.Round = null;
    this.$el = null;
    this.$Name = null;
    this.$Cards = null;
    this.$CardArray = [];
    this.CardMap = {};
    this.Cards = [];
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
      $Cards.classList.add('cards');
      $el.appendChild($Name);
      $el.appendChild($Cards);
      this.$el = $el;
      this.$Name = $Name;
      this.$Cards = $Cards;
      for (var i = 0; i < 4; i++) {
        var $Card = createElement("div");
        $Cards.appendChild($Card);
        $Card.classList.add('card');
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
    key: 'setHalfGround',
    value: function setHalfGround() {}
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
      var cards = this.getCards(arr);
      var cards_order = this.role == "host" ? ["FL", "FR", "BL", "BR"] : ["BR", "BL", "FR", "FL"];
      cards_order.forEach(function (position, i) {
        var $Card = _this.$CardArray[i];
        var card = new Card({
          card: cards[position],
          $el: $Card,
          player: that.Player,
          role: that.role,
          round: that.Round,
          position: position
        });
        _this.CardMap[position] = card;
      });
    }
  }, {
    key: 'getCards',
    value: function getCards(obj) {
      var cards_ = void 0;
      var cards = {};
      if (!obj) {
        cards_ = JSON.parse(JSON.stringify(card_database.cards));
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
        cards.FL = cards_.find(function (item) {
          return Number(item.id) === Number(obj.FL);
        });
        cards.FR = cards_.find(function (item) {
          return Number(item.id) === Number(obj.FR);
        });
        cards.BL = cards_.find(function (item) {
          return Number(item.id) === Number(obj.BL);
        });
        cards.BR = cards_.find(function (item) {
          return Number(item.id) === Number(obj.BR);
        });
      }
      return cards;
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
        that.CardMap[position].enableSelected();
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

      var that = this;
      that.initParam(Player, role);
      that.initNode($el);
      that.setName();
      that.setCards(cards);
      that.setHalfGround();
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
    var Attacker = "";
    var Attacked = "";
    var damage = 0;
    var message = void 0;
    var AttackerCard = null;
    var AttackedCard = null;
    var ground1 = null;
    var ground2 = null;
    switch (Type) {
      case "Round":
        $li = newElement("li", Type, this.$ul, arguments.length <= 1 ? undefined : arguments[1], {});
        break;
      case "Attack":
        //Message [host, hostCardName, guest, guestCardName, attack]
        AttackerCard = arguments.length <= 1 ? undefined : arguments[1];
        AttackedCard = arguments.length <= 2 ? undefined : arguments[2];
        Attacker = that.getCardName(AttackerCard);
        Attacked = that.getCardName(AttackedCard);
        message = Attacker + "使出 <span class='skill'>" + AttackerCard.skill + "</span>!";
        $li = newElement("li", Type, this.$ul, message, {});
        damage = arguments.length <= 3 ? undefined : arguments[3];
        if (Number(damage) <= 0) {
          message = "没有对 " + Attacked + " 造成影响";
        } else {
          message = Attacked + "损失了 <span class='damage'>" + damage + "</span> 的HP";
        }
        if (AttackedCard.hp == 0) {
          message = message + ", <span class='damage'>落败!</span>";
        }
        $li = newElement("li", Type, this.$ul, message, {});
        $li = newElement("li", Type, this.$ul, "<br/>", {});
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

function Round(ground1, ground2) {
  var Round = 0;
  var self = void 0;
  var AttackerCard = null;
  var AttackedCard = null;
  var $comment = document.getElementById('comment');
  var comment = Comment($comment);
  var player1 = ground1.Player;
  var player2 = ground2.Player;

  self = observable({ Round: Round });

  //玩家点击卡片的逻辑
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
    } else if (AttackerCard && !AttackedCard) {
      if (that.checkCardRole(card)) {
        AttackedCard = card;
        card.setSelected();
        self.run(self.OnceBattleStep);
      }
    } else {
      console.log(AttackedCard);
      console.log(AttackerCard);
      console.log(card);
      throw "选择卡片机制抛出错误";
    }
  };

  //tool工具属性 有效帮助判断状态之类的
  self.checkCardRole = function (card) {
    if (AttackerCard.role !== card.role) {
      return true;
    } else {
      return false;
    }
  };

  //流程控制-卡片战斗的逻辑
  var OnceBattleStep = regeneratorRuntime.mark(function OnceBattleStep() {
    var that, damage, result1, result2, result3;
    return regeneratorRuntime.wrap(function OnceBattleStep$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            that = this;
            _context.prev = 1;
            _context.next = 4;
            return that.CardBattle();

          case 4:
            damage = _context.sent;
            _context.next = 7;
            return that.updateCards(damage);

          case 7:
            result1 = _context.sent;
            _context.next = 10;
            return that.checkDefeatedCard();

          case 10:
            result2 = _context.sent;
            _context.next = 13;
            return that.OnceBattleCompleted(result1);

          case 13:
            result3 = _context.sent;
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](1);
            throw _context.t0;

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, OnceBattleStep, this, [[1, 16]]);
  });
  self.OnceBattleStep = function () {
    return OnceBattleStep.call(self);
  };
  self.run = function (generator) {
    var it = generator();
    function go(result) {
      if (result.done) return result.value;
      return result.value.then(function (value) {
        return go(it.next(value));
      }, function (error) {
        return go(it.throw(error));
      });
    }
    go(it.next());
  };
  self.CardBattle = function () {
    return new Promise(function (resolve, reject) {
      var damage = AttackerCard.attackTo(AttackedCard);
      resolve(damage);
    });
  };
  self.updateAttackerCard = function () {
    return new Promise(function (resolve, reject) {
      AttackerCard.update(function () {
        resolve();
      });
    });
  };
  self.updateAttackedCard = function () {
    return new Promise(function (resolve, reject) {
      AttackedCard.update(function () {
        resolve();
      });
    });
  };
  self.addComment = function (damage) {
    return new Promise(function (resolve, reject) {
      comment.addComment("Attack", AttackerCard, AttackedCard, damage);
      resolve();
    });
  };
  self.updateCards = function (damage) {
    var that = this;
    return new Promise(function (resolve, reject) {
      Promise.all([that.updateAttackerCard(), that.updateAttackedCard(), that.addComment(damage)]).then(function () {
        resolve();
      });
    });
  };
  self.checkDefeatedCard = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (AttackedCard.hp <= 0) {
        AttackedCard.defeatedExit(function () {
          resolve();
        });
      } else {
        resolve();
      }
    });
  };
  self.OnceBattleCompleted = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      AttackerCard.disableSelected();
      AttackerCard = null;
      AttackedCard = null;
      if (ground1.isWashout() || ground2.isWashout()) {
        ground1.isWashout() && that.GameOver(ground2, ground1) && resolve();
        ground2.isWashout() && that.GameOver(ground1, ground2) && resolve();
        return;
      }
      if (ground1.isActionOver() && ground2.isActionOver()) {
        ground1.RoundStart();
        ground2.RoundStart();
        that.nextRound();
      }
      resolve();
    });
  };

  //流程控制-回合制战斗的逻辑
  self.StartGame = function () {
    self.nextRound();
  };
  self.nextRound = function () {
    Round++;
    comment.addComment("Round", "Round" + Round);
  };
  self.GameOver = function (ground1, ground2) {
    comment.addComment("GameOver", ground1, ground2);
    return true;
  };

  return self;
}

var $live = document.getElementById('live');
var $Ground1 = createElement("div");
var $Ground2 = createElement("div");
$Ground1.classList.add('HalfGround');
$Ground2.classList.add('HalfGround');
$live.appendChild($Ground1);
$live.appendChild($Ground2);

var Player1 = new Player("Player1");
var Ground1 = new HalfGround();
//let Player1_Cards = {FL: 1, FR: 2, BL: 3, BR: 4};
//let Player2_Cards = {FL: 1, FR: 2, BL: 3, BR: 4};

var Player2 = new Player("Player2");
var Ground2 = new HalfGround();

var round = Round(Ground1, Ground2);
Ground1.initRound(round);
Ground2.initRound(round);
Ground1.init({ $el: $Ground2, Player: Player1, role: "host", cards: Player1_Cards });
Ground2.init({ $el: $Ground1, Player: Player2, role: "guest", cards: Player2_Cards });

//TODO 测试专用
window.G1 = Ground1;
window.G2 = Ground2;

round.StartGame();

}());
//# sourceMappingURL=index.js.map
