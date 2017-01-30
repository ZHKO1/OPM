import Card from '../../Module/MainCard/index.js'
export default class Okamaitachi extends Card {
  getAttackedCard(card1, ground) {
    let that = this;
    let result = [];
    let card2 =  null;
    card1 = card1[0]
    if(that.Round.getRound() <= 1){
      card2 = ground.CardMap["BL"];
      (card2.hp > 0) && result.push(card2);
      card2 = ground.CardMap["BR"];
      (card2.hp > 0) && result.push(card2);
      that.comment.addComment("Effect", that, "远程AOE攻击");
    }
    return result;
  }
}
