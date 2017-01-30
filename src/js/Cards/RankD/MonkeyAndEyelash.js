import Card from '../../Module/MainCard/index.js'
export default class MonkeyAndEyelash extends Card {
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
        if(card2.id == "B6"){
          that.att = that.att + 1;
          that.comment.addComment("Effect", that, "组合搭档为地狱吹雪时触发，本卡攻击力加1");
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