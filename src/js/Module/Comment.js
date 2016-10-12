import {createElement, newElement} from '../tool.js'

export default function Comment($el) {
  let self = {};
  self.$container = $el;
  self.$ul = null;
  self.init = function(){
    let $ul = newElement("ul", null, $el);
    self.$ul = $ul;
  };

  self.getCardName = function(Card){
    let role = Card.role;
    let message = "";
    if(role == "host"){
      message = Card.name;
    }else if(role == "guest"){
      message = Card.Player.name + "的" + Card.name;
    }else{
    }
    return message;
  };
  self.addComment = function(Type, ...Message){
    let that = this;
    let $li;
    let host;
    let guest;
    let Carder = "";
    let Attacker = "";
    let Attacked = "";
    let damage = 0;
    let message;
    let Card = null;
    let AttackerCard = null;
    let AttackedCard = null;
    let ground1 = null;
    let ground2 = null;
    switch (Type){
      case "Round":
        $li = newElement("li", Type, this.$ul, Message[0], {});
        break;
      case "Attack":
        //Message [host, hostCardName, guest, guestCardName, attack]
        AttackerCard = Message[0];
        AttackedCard = Message[1];
        Attacker = that.getCardName(AttackerCard);
        Attacked = that.getCardName(AttackedCard);
        message = Attacker + "使出 <span class='skill'>" + AttackerCard.skill + "</span>!";
        $li = newElement("li", Type, this.$ul, message, {});
        damage = Message[2];
        if(Number(damage) <= 0){
          message = "没有对 " + Attacked + " 造成影响";
        }else{
          message = Attacked + "损失了 <span class='damage'>" + damage + "</span> 的HP";
        }
        if(AttackedCard.hp == 0){
          message = message + ", <span class='damage'>落败!</span>"
        }
        $li = newElement("li", Type, this.$ul, message, {});
        $li = newElement("li", Type, this.$ul, "<br/>", {});
        break;
      case "Effect":
        Card = Message[0];
        message = Message[1];
        Carder = that.getCardName(Card);
        message = Carder + " 发动了特效: " + "<span class='damage'>" + message + "</span>" + " !";
        $li = newElement("li", Type, this.$ul, message, {});
        break;
      case "GameOver":
        ground1 = Message[0];
        ground2 = Message[1];
        host = ground1.Player.name;
        guest = ground2.Player.name;
        message = host + "获胜!";
        $li = newElement("li", Type, this.$ul, message, {});
        break;
      default :
        $li = newElement("li", Type, this.$ul, Message[0], {});
        break;
    }
    that.$container.scrollTop = that.$ul.clientHeight;
  };

  self.init();
  return self;
}
