import Card from '../../Module/MainCard/index.js'
export default class KudohKishi extends Card {
  constructor({card, $el, position, ground}) {
    super({card, $el, position, ground});
    this.EffectStatus = false;
  }

  Effect_RoundStartBuff(next, ground) {
    let that = this;
    let card2;
    setTimeout(() => {
      if (that.Round.getRound() <= 1) {
        switch (that.position){
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
        card2.defeatedExit = function(AttackerCard, callback) {
          let card2 = this;
          card2.$CardContain.style.display = "none";
          card2.deckCard.hide();
          card2.comment.addComment("Defeated", card2);
          card2.Effect_Defeated(AttackerCard, function(){
            if(card2.hp <= 0 && (!that.EffectStatus)){
              that.EffectStatus = true;
              that.comment.addComment("Effect", that, "组合搭档退场时触发，组合搭档以体力2的状态回到场上");
              card2.hp = 2;
              card2.reviveBack();
            }
            callback && callback();
          })
        }
        next();
      } else {
        next();
      }
    }, 300);
  }
}
