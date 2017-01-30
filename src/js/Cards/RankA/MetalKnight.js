import Card from '../../Module/MainCard/index.js'
export default class MetalKnight extends Card {
  getAttackedCard(card1, ground) {
    let that = this;
    let result = [];
    let card2 =  null;
    card1 = card1[0]
    result.push(card1);
    if(that.Round.getRound() <= 1){
      switch (card1.position){
        case "FL":
          card2 = ground.CardMap["FR"];
          (card2.hp > 0) && result.push(card2);
          break;
        case "FR":
          card2 = ground.CardMap["FL"];
          (card2.hp > 0) && result.push(card2);
          break;
        case "BL":
          card2 = ground.CardMap["BR"];
          (card2.hp > 0) && result.push(card2);
          break;
        case "BR":
          card2 = ground.CardMap["BL"];
          (card2.hp > 0) && result.push(card2);
          break;
      }
      that.comment.addComment("Effect", that, "横排AOE攻击");
    }
    return result;
  }
}
