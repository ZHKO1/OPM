import Card from '../../Module/MainCard/index.js'
export default class SaitamaHero extends Card {
  Effect_BattleAfter(AttackedCardArray, next) {
    let that = this;
    let AttackedCard = AttackedCardArray[0];
    setTimeout(() => {
      that.comment.addComment("Effect", that, "伤害翻倍!");
      var damage = that.att - AttackedCard.def;
      AttackedCard.hp = ((AttackedCard.hp - damage) > 0) ? (AttackedCard.hp - damage) : 0;
      next();
    }, 300);
    next();
  }
}