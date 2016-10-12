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

var MainCard = function () {
  function MainCard(_ref) {
    var card = _ref.card;
    var $el = _ref.$el;
    var position = _ref.position;
    var ground = _ref.ground;
    classCallCheck(this, MainCard);

    _extends(this, card);
    this.position = position;
    this.Ground = ground;
    this.Player = this.Ground.Player;
    this.comment = this.Ground.comment;
    this.role = this.Ground.role;
    this.Round = this.Ground.Round;
    this.$CardContain = null;
    this.$el = $el || null;
    this.deckCard = null;
    this.status = {
      ActionOver: false };
    this.init();
  }

  createClass(MainCard, [{
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
      that.status.ActionOver && that.setActionOver();
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
    key: 'setActionOver',
    value: function setActionOver() {
      this.status.ActionOver = true;
      this.$CardContain.classList.add("actionOver");
    }
  }, {
    key: 'setActionable',
    value: function setActionable() {
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
    key: 'getAttackedObject',
    value: function getAttackedObject(ground) {
      var that = this;
      var ObjectArray = ground.getAlive();
      ObjectArray = ObjectArray.sort(function (itemA, itemB) {
        return ToInteger(that.att - itemA.def) / itemA.hp < ToInteger(that.att - itemB.def) / itemB.hp;
      });
      function ToInteger(number) {
        return number <= 0 ? 0 : number;
      }
      return ObjectArray;
    }
  }, {
    key: 'defeatedExit',
    value: function defeatedExit(callback) {
      var that = this;
      that.$CardContain.style.display = "none";
      that.status.ActionOver = true;
      that.deckCard.unmount();
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

    //特效部分
    //回合开始前加BUFF

  }, {
    key: 'Effect_RoundStartBuff',
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      next();
    }
    //回合结束后加BUFF

  }, {
    key: 'Effect_RoundEndBuff',
    value: function Effect_RoundEndBuff() {}
    //攻击范围

  }, {
    key: 'Effect_setAttackedRange',
    value: function Effect_setAttackedRange() {}
    //攻击前事件

  }, {
    key: 'Effect_BattleBefore',
    value: function Effect_BattleBefore() {}
    //战斗结束后事件

  }, {
    key: 'Effect_BattleAfter',
    value: function Effect_BattleAfter() {}
    //战败事件

  }, {
    key: 'Effect_Defeated',
    value: function Effect_Defeated() {}
  }]);
  return MainCard;
}();

function addListener(target, name, listener) {
  target.addEventListener(name, listener);
}

var Snack = function (_Card) {
  inherits(Snack, _Card);

  function Snack() {
    classCallCheck(this, Snack);
    return possibleConstructorReturn(this, (Snack.__proto__ || Object.getPrototypeOf(Snack)).apply(this, arguments));
  }

  return Snack;
}(MainCard);

var MumenRider = function (_Card) {
  inherits(MumenRider, _Card);

  function MumenRider() {
    classCallCheck(this, MumenRider);
    return possibleConstructorReturn(this, (MumenRider.__proto__ || Object.getPrototypeOf(MumenRider)).apply(this, arguments));
  }

  return MumenRider;
}(MainCard);

var OgonBall = function (_Card) {
  inherits(OgonBall, _Card);

  function OgonBall() {
    classCallCheck(this, OgonBall);
    return possibleConstructorReturn(this, (OgonBall.__proto__ || Object.getPrototypeOf(OgonBall)).apply(this, arguments));
  }

  return OgonBall;
}(MainCard);

var TankTopBlackhole = function (_Card) {
  inherits(TankTopBlackhole, _Card);

  function TankTopBlackhole() {
    classCallCheck(this, TankTopBlackhole);
    return possibleConstructorReturn(this, (TankTopBlackhole.__proto__ || Object.getPrototypeOf(TankTopBlackhole)).apply(this, arguments));
  }

  return TankTopBlackhole;
}(MainCard);

var DarknessBlade = function (_Card) {
  inherits(DarknessBlade, _Card);

  function DarknessBlade() {
    classCallCheck(this, DarknessBlade);
    return possibleConstructorReturn(this, (DarknessBlade.__proto__ || Object.getPrototypeOf(DarknessBlade)).apply(this, arguments));
  }

  createClass(DarknessBlade, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      setTimeout(function () {
        that.comment.addComment("Effect", that, "防御减2");
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

var SaitamaCitizen = function (_Card) {
  inherits(SaitamaCitizen, _Card);

  function SaitamaCitizen() {
    classCallCheck(this, SaitamaCitizen);
    return possibleConstructorReturn(this, (SaitamaCitizen.__proto__ || Object.getPrototypeOf(SaitamaCitizen)).apply(this, arguments));
  }

  return SaitamaCitizen;
}(MainCard);

var SaitamaHero = function (_Card) {
  inherits(SaitamaHero, _Card);

  function SaitamaHero() {
    classCallCheck(this, SaitamaHero);
    return possibleConstructorReturn(this, (SaitamaHero.__proto__ || Object.getPrototypeOf(SaitamaHero)).apply(this, arguments));
  }

  return SaitamaHero;
}(MainCard);

var SaitamaMax = function (_Card) {
  inherits(SaitamaMax, _Card);

  function SaitamaMax() {
    classCallCheck(this, SaitamaMax);
    return possibleConstructorReturn(this, (SaitamaMax.__proto__ || Object.getPrototypeOf(SaitamaMax)).apply(this, arguments));
  }

  createClass(SaitamaMax, [{
    key: "Effect_RoundStartBuff",
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      setTimeout(function () {
        that.comment.addComment("Effect", that, "防御减2");
        next();
      }, 300);
    }
  }]);
  return SaitamaMax;
}(MainCard);

var SaitamaNightmare = function (_Card) {
  inherits(SaitamaNightmare, _Card);

  function SaitamaNightmare() {
    classCallCheck(this, SaitamaNightmare);
    return possibleConstructorReturn(this, (SaitamaNightmare.__proto__ || Object.getPrototypeOf(SaitamaNightmare)).apply(this, arguments));
  }

  return SaitamaNightmare;
}(MainCard);

var SaitamaRookie = function (_Card) {
  inherits(SaitamaRookie, _Card);

  function SaitamaRookie() {
    classCallCheck(this, SaitamaRookie);
    return possibleConstructorReturn(this, (SaitamaRookie.__proto__ || Object.getPrototypeOf(SaitamaRookie)).apply(this, arguments));
  }

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
    value: function Effect_RoundStartBuff(next) {
      var that = this;
      setTimeout(function () {
        that.comment.addComment("Effect", that, "防御减2");
        next();
      }, 300);
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

  return SaitamaTheBurst;
}(MainCard);

var CardRankD = {
  cards: [{ class_: Snack, id: "D1", name: "蛇咬拳 斯内克", rank: "D", hp: 5, spd: 3, att: 3, def: 1, skill: "蛇形拳", effect: "本卡片体力等于1时触发，本回合本卡片不能进行攻击" }, { class_: MumenRider, id: "D2", name: "无证骑士", rank: "D", hp: 4, spd: 2, att: 1, def: 1, skill: "正义咆哮", effect: "本卡片退场时触发，如果存在组合搭档，组合搭档体力加3，如果组合搭档已退场，组合搭档以体力3的状态回到场上" }, { class_: OgonBall, id: "D3", name: "黄金球", rank: "D", hp: 4, spd: 1, att: 4, def: 1, skill: "形状记忆金弹", effect: "第一回合准备阶段触发，本卡片攻击范围横排攻击" }, { class_: TankTopBlackhole, id: "D4", name: "背心黑洞", rank: "D", hp: 6, spd: 2, att: 4, def: 1, skill: "200公斤握力", effect: "本卡片发动攻击时触发，本卡片体力减1，被攻击的卡片体力减1" }, { class_: DarknessBlade, id: "D5", name: "黑暗炎龙使者", rank: "D", hp: 3, spd: 1, att: 1, def: 2, skill: "不知何处得来的自信", effect: "本卡片攻击的伤害阶段可以触发，被攻击的卡片防御减2" }, { class_: JujikeyAndMofuku, id: "D6", name: "十字键与丧服吊带", rank: "D", hp: 4, spd: 1, att: 1, def: 3, skill: "吊带回转风暴", effect: "" }, { class_: SaitamaCitizen, id: "D7", name: "无业游民 琦玉", rank: "D", hp: 5, spd: 1, att: 2, def: 2, skill: "三年的地狱式磨练", effect: "第三回合准备简单触发，本卡片退场，随机选取其他琦玉卡片替换到本卡片的位置" }]
};
var card_database = {
  cards: Array.prototype.concat.apply([], [CardRankD.cards /*, CardSaitama.cards*/])
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
      var cards = this.getCards(arr);
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
    key: 'getCards',
    value: function getCards(obj) {
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
      console.log(deck.cards);
      cards_order.forEach(function (position, i) {
        var deckCard = deck.cards[_this2.role == "host" ? i : i + 4];
        _this2.CardMap[position].deckCard = deckCard;
        _this2.CardMap[position].deckCard.disableDragging();
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
      case "Effect":
        Card = arguments.length <= 1 ? undefined : arguments[1];
        message = arguments.length <= 2 ? undefined : arguments[2];
        Carder = that.getCardName(Card);
        message = Carder + " 发动了特效: " + "<span class='damage'>" + message + "</span>" + " !";
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
  var AttackedCard = null;
  var isGameOver = false;
  var $comment = document.getElementById('comment');
  var comment = Comment($comment);
  var player1 = ground1.Player;
  ground1.comment = comment;
  var player2 = ground2.Player;
  ground2.comment = comment;

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
    var that, status, damage, result1, result2, result3;
    return regeneratorRuntime.wrap(function OnceBattleStep$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            that = this;
            _context.prev = 1;
            _context.next = 4;
            return that.CardBattleBefore();

          case 4:
            status = _context.sent;
            _context.next = 7;
            return that.CardBattle();

          case 7:
            damage = _context.sent;
            _context.next = 10;
            return that.updateCards(damage);

          case 10:
            result1 = _context.sent;
            _context.next = 13;
            return that.checkDefeatedCard();

          case 13:
            result2 = _context.sent;
            _context.next = 16;
            return that.OnceBattleCompleted(result1);

          case 16:
            result3 = _context.sent;
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](1);
            throw _context.t0;

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, OnceBattleStep, this, [[1, 19]]);
  });
  self.OnceBattleStep = function () {
    return OnceBattleStep.call(self);
  };
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
  self.CardBattleBefore = function () {
    return new Promise(function (resolve, reject) {
      var status = AttackerCard.Effect_BattleBefore();
      resolve(status);
    });
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
      AttackerCard.setActionOver();
      AttackerCard = null;
      AttackedCard = null;
      self.trigger("ManualTransmission");
      resolve();
    });
  };

  //流程控制-回合制战斗的逻辑
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
              _context2.next = 29;
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
            _context2.next = 23;
            return that.sortCardsSpeed();

          case 23:
            sortResult = _context2.sent;
            _context2.next = 26;
            return that.checkCardsEndBuff(sortResult);

          case 26:
            endBuff = _context2.sent;
            _context2.next = 7;
            break;

          case 29:
            _context2.next = 34;
            break;

          case 31:
            _context2.prev = 31;
            _context2.t1 = _context2['catch'](6);
            throw _context2.t1;

          case 34:
          case 'end':
            return _context2.stop();
        }
      }
    }, OnceRoundStep, this, [[6, 31]]);
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
        queue$$.queued(item.Effect_RoundStartBuff, item)();
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
            AttackedCard = sortResult[0].getAttackedObject(ground1.role == sortResult[0].role ? ground2 : ground1)[0];
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
      resolve();
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
  var body = document.body;
  var prefix = Deck.prefix;
  var transform = prefix('transform');
  var translate = Deck.translate;
  var DeckContainer = document.getElementById('DeckContainer');
  var deck;

  self.configRank = [{ RankD: CardRankD }, { "???": card_database }];
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
            instance.el.innerHTML = "";
            var card = instance.draggableObj;
            card.toDragNode();
            card.AutoMoveBack();
            instance.draggableObj = draggableObj;
          };
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
      deck.unmount();
      body.classList.remove('drag-active');
      RankCardContainer.classList.remove('show');
    });
  };
  self.showCards = function (Rank) {
    var that = this;
    body.classList.add('drag-active');
    RankCardContainer.classList.add('show');
    deck = Deck(Rank.RankCards.cards.length);
    var RankCards = Rank.RankCards.cards;
    deck.cards.forEach(function (card, i) {
      card.enableDragging();
      card.enableFlipping();
      card.setCard(RankCards[i]);
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

    deck.mount(DeckContainer);
    deck.intro();
    deck.sort();
    deck.poker();
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
      self.ExitFromSelectedCard();
      self.next && self.next(Player_Cards, deck);
    }
  };

  self.ExitFromSelectedCard = function () {
    body.classList.remove('drag-active');
    RankCardContainer.classList.remove('show');
    RankContainer.style.display = "none";
    SelectedCardContainer.classList.remove('show');
    deck.cards.forEach(function (item) {
      !item.isStaticNode() && item.unmount();
    });
    deck.cards = deck.cards.filter(function (item) {
      return item.isStaticNode();
    });
    deck.cards.forEach(function (item) {
      item.toDragNode();
      item.DraggableObj.destroy();
      item.setNotMoveBack();
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
  var Player2_Cards = { FL: "D1", FR: "D2", BL: "D3", BR: "D4" };
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
