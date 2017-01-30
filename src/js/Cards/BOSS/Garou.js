import Card from '../../Module/MainCard/index.js'
export default class Garou extends Card {
  Effect_RoundEndBuff(next){
    let that = this;
    that.comment.addComment("Effect", that, "攻击加1、防御加1、速度加1!");
    that.comment.addComment("","不.....不可能!");
    that.comment.addComment("","居然是血量加2，攻击加2、防御加2、速度加2!");
    that.hp = that.hp + 2;
    that.att = that.att + 2;
    that.def = that.def + 2;
    that.spd = that.spd + 2;
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
