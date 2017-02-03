import Card from '../../Module/MainCard/index.js'
export default class BlueFire extends Card {
  Effect_BattleAfter(AttackedCardArray, next) {
    let that = this;
    let AttackedCard = AttackedCardArray[0];
    setTimeout(() => {
      that.comment.addComment("Effect", that, "体力减1");
      AttackedCard.hp = AttackedCard.hp - 1;
      if (AttackedCard.hp < 0) {
        AttackedCard.hp = 0;
      }
      next();
    }, 300);
  }
}
