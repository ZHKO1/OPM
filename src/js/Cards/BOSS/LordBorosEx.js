import Card from '../../Module/MainCard/index.js'
export default class LordBorosEx extends Card {
  Effect_RoundEndBuff(next){
    let that = this;
    that.comment.addComment("Effect", that, "每次回合结束阶段触发，本卡片体力减1");
    that.hp = that.hp - 1;
    next();
  }

  getAttackedCard(card1, ground) {
    let that = this;
    let result = [];
    let card2 =  null;
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
    }else{
      result = card1;
    }
    return result;
  }
}
