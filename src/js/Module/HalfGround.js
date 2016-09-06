import {createElement, newElement} from '../tool.js'
import {card_database} from '../card_database.js'
import Player from './Player.js'
import Card from './Card.js'
export default class HalfGround {
  constructor() {
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

  initParam(player, role) {
    this.Player = player;
    this.role = role;
  }

  initRound(Round){
    this.Round = Round;
  }

  initNode($el) {
    let $Name = createElement("div");
    let $Cards = createElement("div");
    $Name.classList.add('name');
    $Cards.classList.add('cards');
    $el.appendChild($Name);
    $el.appendChild($Cards);
    this.$el = $el;
    this.$Name = $Name;
    this.$Cards = $Cards;
    for (let i = 0; i < 4; i++) {
      let $Card = createElement("div");
      $Cards.appendChild($Card);
      $Card.classList.add('card');
      var backrow = (this.role == "host") ? ((i) => i > 1) : ((i) => i < 2);
      if (backrow(i)) {
        $Card.classList.add('backrow');
      }
      this.$CardArray.push($Card);
    }
  }

  setHalfGround() {

  }

  setName() {
    let $div = createElement("div");
    this.$Name.appendChild($div);
    $div.textContent = this.Player.name;
  }

  setCards(arr) {
    let that = this;
    let cards = this.getCards(arr);
    let cards_order = (this.role == "host") ? ["FL", "FR", "BL", "BR"] : ["BR", "BL", "FR", "FL"];
    cards_order.forEach((position, i)=> {
      let $Card = this.$CardArray[i];
      let card = new Card({
        card: cards[position],
        $el: $Card,
        player: that.Player,
        role: that.role,
        round: that.Round,
        position:position
      });
      this.CardMap[position] = card;
    });
  }

  getCards(obj) {
    let cards_;
    let cards = {};
    if (!obj) {
      cards_ = JSON.parse(JSON.stringify(card_database.cards));
      for (let i = cards_.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards_[i],cards_[j]]=[cards_[j], cards_[i]];
      }
      cards.FL = cards_[0];
      cards.FR = cards_[1];
      cards.BL = cards_[2];
      cards.BR = cards_[3];
    } else {
      cards_ = JSON.parse(JSON.stringify(card_database.cards));
      cards.FL = cards_.find((item)=> {
        return Number(item.id) === Number(obj.FL)
      });
      cards.FR = cards_.find((item)=> {
        return Number(item.id) === Number(obj.FR)
      });
      cards.BL = cards_.find((item)=> {
        return Number(item.id) === Number(obj.BL)
      });
      cards.BR = cards_.find((item)=> {
        return Number(item.id) === Number(obj.BR)
      });
    }
    return cards;
  }

  isActionOver(){
    let that = this;
    let result = true;
    let cards_order = ["FL", "FR", "BL", "BR"];
    cards_order.forEach((position, i)=> {
      result  = result && (that.CardMap[position].status.ActionOver || (!!!that.CardMap[position].hp));
    });
    return result;
  }

  RoundStart(){
    let that = this;
    let result = true;
    let cards_order = ["FL", "FR", "BL", "BR"];
    cards_order.forEach((position, i)=> {
      that.CardMap[position].enableSelected();
    });
    return result;
  }

  isWashout(){
    let that = this;
    let result = true;
    let cards_order = ["FL", "FR", "BL", "BR"];
    cards_order.forEach((position, i)=> {
      result  = (result && (!that.CardMap[position].hp));
    });
    return !!result;
  }

  init({$el, Player, role, cards}) {
    let that = this;
    that.initParam(Player, role);
    that.initNode($el);
    that.setName();
    that.setCards(cards);
    that.setHalfGround();
  }
}