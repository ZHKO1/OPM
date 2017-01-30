import Card from '../../Module/MainCard/index.js'
export default class Bang extends Card {
  Effect_AfterAttacked(AttackerCard, damage, next) {
    let that = this;
    that.comment.addComment("Effect", that, "反击!");
    let damageArr = that.attackTo([AttackerCard]);
    AttackerCard.updateHp(damageArr[0]);
    that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
    next();
  }
}
