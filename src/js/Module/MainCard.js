import {createElement, newElement} from '../tool.js'
export default class MainCard {
  constructor({card, $el, position, ground}) {
    Object.assign(this, card);
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
      ActionOver: false,//是否行动完毕？
    };
    this.init();
  }

  drawCard() {
    //$el.textContent = this.name;\
    let that = this;
    let $el = that.$el;
    let $CardContain = createElement("div");
    $CardContain.classList.add('cardContainer');
    let $row1 = createElement("div");//name
    let $row2 = createElement("div");//rank type
    let $row3 = createElement("div");//spd hp
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
          $body1 = newElement("div", "body3", $row, that.effect, {title: that.effect});
          break;
      }
    });
    $el.appendChild($CardContain);
    that.$CardContain = $CardContain;
    that.status.ActionOver && that.setActionOver();
  }

  bind(){
    let that = this;
    addListener(that.$CardContain, 'mousedown', onMousedown);
    function onMousedown (e) {
      var starttime = Date.now();
      that.Round.trigger("select", that);
      e.preventDefault();
      return
    }
  }

  setSelected(){
    let that = this;
    that.$CardContain.classList.add("selected");
  }

  setNotSelected(){
    let that = this;
    that.$CardContain.classList.remove("selected");
  }

  setActionOver(){
    this.status.ActionOver = true;
    this.$CardContain.classList.add("actionOver");
  }

  setActionable(){
    this.status.ActionOver = false;
    this.$CardContain.classList.remove("actionOver");
  }

  attackTo(card){
    let that = this;
    let damage = ((that.att - card.def) >= 0)?(that.att - card.def):0;
    card.hp = ((card.hp - damage)>=0)?(card.hp - damage):0;
    return damage;
  }

  getAttackedObject(ground){
    let that = this;
    let ObjectArray = ground.getAlive();
    ObjectArray = ObjectArray.sort((itemA, itemB)=>{
      return (ToInteger(that.att - itemA.def)/itemA.hp ) < (ToInteger(that.att - itemB.def)/itemB.hp );
    });
    function ToInteger(number){
      return (number<=0)?0:number;
    }
    return ObjectArray;
  }

  defeatedExit(callback){
    let that = this;
    that.$CardContain.style.display = "none";
    that.status.ActionOver = true;
    that.deckCard.unmount();
    callback && callback();
  }

  update(callback){
    let that = this;
    that.$el.innerHTML = "";
    that.drawCard();
    that.bind();
    callback && callback();
  }

  init() {
    let that = this;
    that.drawCard();
    that.bind();
  }

  //特效部分
  //回合开始前加BUFF
  Effect_RoundStartBuff(next){
    let that = this;
    next();
  }
  //回合结束后加BUFF
  Effect_RoundEndBuff(){
  }
  //攻击范围
  Effect_setAttackedRange(){
  }
  //攻击前事件
  Effect_BattleBefore(){
  }
  //战斗结束后事件
  Effect_BattleAfter(){
  }
  //战败事件
  Effect_Defeated(){

  }
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}

function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}