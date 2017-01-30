import Card from '../../Module/MainCard/index.js'
export default class BestPredictor extends Card {
  Effect_RoundStartBuff(next, ground2) {
    let that = this;
    let card2 = null;
    setTimeout(() => {
      if (that.Round.getRound() <= 1) {
        that.comment.addComment("Effect", that, "本卡片的组合搭档本回合额外进行一次攻击");
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
        card2.AttackTime = 2;
        next();
      } else {
        next();
      }
    }, 300);
  }
}
