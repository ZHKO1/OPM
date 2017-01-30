import Card from '../../Module/MainCard/index.js'
export default class KinzokuBat extends Card {
  Effect_AfterAttacked(AttackerCard, damage, next) {
    let that = this;
    if(damage > 0){
      that.comment.addComment("Effect", that, "攻击力加1");
      that.att = that.att + 1;
    }
    next();
  }
}
