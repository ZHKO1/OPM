import Card from '../../Module/MainCard/index.js'
export default class AmaiMask extends Card {
  Effect_RoundStartBuff(next, ground2) {
    let that = this;
    that.comment.addComment("Effect", that, "攻击力减2!");
    that.backUpAbitily(["att"]);
    that.att = that.att - 2;
    next();
  }

  getAttackedCard(card1, ground) {
    let that = this;
    let result = [];
    let card2 =  null;
    card1 = card1[0]
    result.push(card1);
    if(that.Round.getRound() <= 1){
      card2 = ground.CardMap["FR"];
      (card2.hp > 0) && result.push(card2);
      card2 = ground.CardMap["FL"];
      (card2.hp > 0) && result.push(card2);
      card2 = ground.CardMap["BR"];
      (card2.hp > 0) && result.push(card2);
      card2 = ground.CardMap["BL"];
      (card2.hp > 0) && result.push(card2);
      that.comment.addComment("Effect", that, "全场攻击");
    }
    return result;
  }

  Effect_RoundEndBuff(next, ground2){
    let that = this;
    that.comment.addComment("Effect", that, "攻击力恢复!");
    that.returnToAbility(["att"]);
    next();
  }
}
