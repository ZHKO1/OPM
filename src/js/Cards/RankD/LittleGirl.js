import Card from '../../Module/MainCard/index.js'
export default class LittleGirl extends Card {
  Effect_Defeated(AttackerCard, next) {
    let that = this;
    let result = [];
    let card2;
    let ground = that.Ground;
    switch (that.position) {
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
    if (card2.hp > 0) {
      that.comment.addComment("Effect", that, "组合搭档攻击力加2");
      card2.att = card2.att + 2;
    }
    next();
  }
}