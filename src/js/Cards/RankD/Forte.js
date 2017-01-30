import Card from '../../Module/MainCard/index.js'
export default class Forte extends Card {
  Effect_RoundStartBuff(next) {
    let that = this;
    let ground = that.Ground;
    let card2;
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
      card2.spd = card2.spd + 1;
      that.comment.addComment("Effect", that, "第一回合准备阶段触发，组合搭档速度加1");
      next();
    } else {
      next();
    }
  }
}