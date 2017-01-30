import Card from '../../Module/MainCard/index.js'
export default class BlueFire extends Card {
  Effect_BattleAfter(AttackedCardArray, next) {
    let that = this;
    let AttackedCard = AttackedCardArray[0];
    setTimeout(() => {
      that.comment.addComment("Effect", that, "速度减2");
      AttackedCard.spd = AttackedCard.spd - 2;
      if (AttackedCard.spd < 0) {
        AttackedCard.spd = 0;
      }
      next();
    }, 300);
  }
}
