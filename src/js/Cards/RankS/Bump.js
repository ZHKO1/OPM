import Card from '../../Module/MainCard/index.js'
export default class Bump extends Card {
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
        if(card2.id == "S3"){
          card2.att = card2.att + 2;
          that.att = that.att + 2;
          that.comment.addComment("Effect", that, "和邦古组合搭档时触发，本两张卡片攻击加2");
          next();
        }else{
          next();
        }
      } else {
        next();
      }
    }, 300);
  }
}
