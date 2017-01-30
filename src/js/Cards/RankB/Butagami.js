import Card from '../../Module/MainCard/index.js'
export default class Butagami extends Card {
  Effect_RoundStartBuff(next, ground) {
    let that = this;
    let card2;
    setTimeout(() => {
      if (that.Round.getRound() <= 1) {
        ["BL","BR","FL","FR"].forEach(function(position){
          card2 = ground.CardMap[position];
          card2.defeatedExit = function(AttackerCard, callback) {
            let card2 = this;
            card2.$CardContain.style.display = "none";
            card2.status.ActionOver = true;
            card2.deckCard.hide();
            card2.comment.addComment("Defeated", that);
            card2.Effect_Defeated(AttackerCard, function(){
              callback && callback();
              if((that.hp > 0) && (that.id == AttackerCard.id)){
                that.comment.addComment("Effect", that, "造成对方卡片退场时触发，本卡片体力加2");
                that.hp = that.hp + 2;
              }
              callback && callback();
            })
          }
        });
        next();
      } else {
        next();
      }
    }, 300);
  }
}
