import Card from '../../Module/MainCard/index.js'
export default class Garou extends Card {
  Effect_RoundEndBuff(next){
    let that = this;
    that.comment.addComment("Effect", that, "攻击加1、防御加1、速度加1!");
    that.att = that.att + 1;
    that.def = that.def + 1;
    that.spd = that.spd + 1;
    next();
  }
  Effect_AfterAttacked(AttackerCard, damage, next) {
    let that = this;
    that.comment.addComment("Effect", that, "反击!");
    let damageArr = that.attackTo([AttackerCard]);
    AttackerCard.updateHp(damageArr[0]);
    that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
    next();
  }
}
