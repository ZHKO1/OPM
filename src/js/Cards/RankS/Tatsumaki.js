import Card from '../../Module/MainCard/index.js'
export default class Tatsumaki extends Card {
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
