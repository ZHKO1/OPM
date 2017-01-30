import Card from '../../Module/MainCard/index.js'
export default class Genos extends Card {
  Effect_Defeated(AttackerCard, next) {
    let that = this;
    let result = [];
    that.comment.addComment("Effect", that, "绝地反击!");
    let damageArr = that.attackTo([AttackerCard]);
    AttackerCard.updateHp(damageArr[0]);
    that.comment.addComment("Damage", that, AttackerCard, damageArr[0]);
    next();
  }
}
