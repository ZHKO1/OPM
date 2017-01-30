import {createElement, newElement} from '../../lib/tool.js'
import {observe} from './observer.js'
import {Watcher} from './watcher.js'
import {Compile} from './compile.js'

export default class MainCard {
    constructor({card, $el, position, ground}) {
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
            att : 0,
            spd : 0,
            def : 0
        };

        this.AttackTime = 1;

        Object.keys(data).forEach(function (key) {
            that._proxy(key);
        });
        observe(data, this);
        that.init();
        that.$compile = new Compile(this.$el || document.body, this)
    }

    _proxy(key) {
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

    drawCard() {
        //$el.textContent = this.name;\
        let that = this;
        let $el = that.$el;
        that.$el.innerHTML = "";
        let $CardContain = createElement("div");
        $CardContain.classList.add('cardContainer');
        $CardContain.setAttribute("v-class", "[status.defaultClass,status.ActionOver?status.ActionOverClass:status.NullClass,status.Selected?status.SelectedClass:status.NullClass]");
        let $row1 = createElement("div");//name
        let $row2 = createElement("div");//rank type
        let $row3 = createElement("div");//hp speed
        let $row4 = createElement("div");//skill
        let $row5 = createElement("div");//att def
        let $row6 = createElement("div");//effect
        let array = [$row1, $row2, $row3, $row4, $row5, $row6];
        //$row1.style.display = "none";
        //$row2.style.display = "none";
        //$row4.style.display = "none";
        //$row6.style.display = "none";
        array.forEach(function ($row, i) {
            let $head1, $body1, $head2, $body2;
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
                    $body1 = newElement("div", "body3", $row, "{{effect}}", {"v-title": "effect"});
                    break;
            }
        });
        $el.appendChild($CardContain);
        that.$CardContain = $CardContain;
        that.status.ActionOver && that.setActionOver();
    }

    bind() {
        let that = this;
        addListener(that.$CardContain, 'mousedown', onMousedown);
        function onMousedown(e) {
            that.Round.trigger("select", that);
            e.preventDefault();
            return
        }
    }

    setSelected() {
        this.status.Selected = true;
    }

    setNotSelected() {
        this.status.Selected = false;
    }

    setActionOver() {
        this.status.ActionOver = true;
    }

    setActionable() {
        this.status.ActionOver = false;
    }

    getAttackTime(){
        return this.AttackTime;
    }

    attackTo(cardArray) {
        let that = this;
        let damageArray = [];
        let damage;
        cardArray.forEach(function (card) {
            damage = ((that.att - card.def) >= 0) ? (that.att - card.def) : 0;
            damageArray.push(damage);
        });
        return damageArray;
    }

    updateHp(damage){
        let that = this;
        that.hp = ((that.hp - damage) >= 0) ? (that.hp - damage) : 0;
        return damage
    }

    getPriorityAttackedCard(ground) {
        let that = this;
        let ObjectArray = ground.getAlive();
        ObjectArray = ObjectArray.sort((itemA, itemB) => {
            return (ToInteger(that.att - itemA.def) / itemA.hp ) < (ToInteger(that.att - itemB.def) / itemB.hp );
        });
        function ToInteger(number) {
            return (number <= 0) ? 0 : number;
        }

        return [ObjectArray[0]];
    }

    getAttackedCard(card, ground) {
        return card;
    }

    defeatedExit(AttackerCard, callback) {
        let that = this;
        that.$CardContain.style.display = "none";
        //that.status.ActionOver = true;
        that.deckCard.hide();
        this.comment.addComment("Defeated", that);
        that.Effect_Defeated(AttackerCard, function(){
            callback && callback();
        })
    }

    reviveBack(callback) {
        let that = this;
        that.$CardContain.style.display = "";
        //that.status.ActionOver = false;
        that.deckCard.show();
    }

    init() {
        let that = this;
        that.drawCard();
        that.bind();
    }

    $watch(key, cb) {
        new Watcher(this, key, cb);
    }

    backUpAbitily(arr){
        let that = this;
        arr.forEach(function(item){
            that.originData[item] = that[item];
        });
    }

    returnToAbility(arr){
        let that = this;
        arr.forEach(function(item){
            that[item] = that.originData[item];
        });
    }

    // 特效部分
    // 回合开始前加BUFF
    Effect_RoundStartBuff(next) {
        next();
    }
    // 回合结束后加BUFF
    Effect_RoundEndBuff(next) {
        next();
    }

    // 攻击范围
    Effect_setAttackedRange() {
    }

    // 攻击前事件
    Effect_BattleBefore(AttackedCardArray, next) {
        next({});
    }
    // 战斗结束后事件
    Effect_BattleAfter(AttackedCardArray, next) {
        next();
    }

    Effect_BeforeAttacked(AttackerCard, AttackedCardArray, next){
        next();
    }
    // 战斗过程中检查自身状态触发事件
    Effect_checkoutStatus(next) {
        next();
    }
    // 被攻击后触发事件
    Effect_AfterAttacked(AttackerCard, damage, next) {
        next();
    }

    // 战败事件
    Effect_Defeated(AttackerCard, next) {
        next();
    }
}

function addListener(target, name, listener) {
    target.addEventListener(name, listener)
}

function removeListener(target, name, listener) {
    target.removeEventListener(name, listener)
}