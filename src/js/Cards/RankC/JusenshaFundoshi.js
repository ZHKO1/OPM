import Card from '../../Module/MainCard/index.js'
export default class JusenshaFundoshi extends Card {
  Effect_RoundStartBuff(next, ground) {
    let that = this;
    let card2;
    setTimeout(() => {
      if (that.Round.getRound() <= 1) {
        switch (that.position){
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
        card2.defeatedExit = function(AttackerCard, callback) {
          let card2 = this;
          card2.$CardContain.style.display = "none";
          card2.status.ActionOver = true;
          card2.deckCard.hide();
          card2.comment.addComment("Defeated", card2);
          card2.Effect_Defeated(AttackerCard, function(){
            if((that.hp > 0) && (AttackerCard.hp > 0)){
              that.comment.addComment("Effect", that, "组合搭档退场时触发，对攻击来源卡片进行一次反击");
              let damageArr = that.attackTo([AttackerCard]);
              AttackerCard.updateHp(damageArr[0]);
              that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
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
