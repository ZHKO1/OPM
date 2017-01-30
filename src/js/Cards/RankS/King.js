import Card from '../../Module/MainCard/index.js'
export default class King extends Card {
  Effect_RoundStartBuff(next, ground2) {
    let that = this;
    let ground = ground2;
    let card2;
    if (that.Round.getRound() <= 1) {
      that.comment.addComment("Effect", that, "对面攻击力为0!");
      card2 = ground.CardMap["BL"];
      card2.backUpAbitily(["att"]);
      card2.att = 0;
      card2 = ground.CardMap["BR"];
      card2.backUpAbitily(["att"]);
      card2.att = 0;
      card2 = ground.CardMap["FL"];
      card2.backUpAbitily(["att"]);
      card2.att = 0;
      card2 = ground.CardMap["FR"];
      card2.backUpAbitily(["att"]);
      card2.att = 0;
      next();
    } else {
      next();
    }
  }

  Effect_RoundEndBuff(next, ground2){
    let that = this;
    let ground = ground2;
    let card2;
    if (that.Round.getRound() <= 1) {
      card2 = ground.CardMap["BL"];
      card2.returnToAbility(["att"]);
      card2 = ground.CardMap["BR"];
      card2.returnToAbility(["att"]);
      card2 = ground.CardMap["FL"];
      card2.returnToAbility(["att"]);
      card2 = ground.CardMap["FR"];
      card2.returnToAbility(["att"]);
      next();
    } else {
      next();
    }
  }
}
