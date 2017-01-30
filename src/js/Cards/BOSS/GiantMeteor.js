import Card from '../../Module/MainCard/index.js'
export default class GiantMeteor extends Card {
  Effect_RoundEndBuff(next,ground){
    let that = this;
    let card2;
    that.comment.addComment("Effect", that, "全灭!");
    card2 = ground.CardMap["FR"];
    (card2.hp = 0)
    card2 = ground.CardMap["FL"];
    (card2.hp = 0)
    card2 = ground.CardMap["BR"];
    (card2.hp = 0)
    card2 = ground.CardMap["BL"];
    (card2.hp = 0)
    next();
  }
}
