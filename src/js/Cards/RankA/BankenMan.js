import Card from '../../Module/MainCard/index.js'
export default class BankenMan extends Card {
  Effect_RoundStartBuff(next) {
    let that = this;
    let ground = that.Ground;
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
        card2.hp = card2.hp + 1;
        card2.att = card2.att + 1;
        that.comment.addComment("Effect", that, "组合搭档体力加1、防御加1");
        next();
      } else {
        next();
      }
    }, 300);
  }
}
