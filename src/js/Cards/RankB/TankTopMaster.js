import Card from '../../Module/MainCard/index.js'
export default class TankTopMaster extends Card {
  Effect_BattleBefore(AttackedCardArray, next) {
    let that = this;
    let result = {};
    let AttackedCard = AttackedCardArray[0];
    setTimeout(() => {
      that.comment.addComment("Effect", that, "双方体力减1");
      that.hp = ((that.hp - 1) >= 0) ? (that.hp - 1) : 0;
      AttackedCard.hp = ((AttackedCard.hp - 1) >= 0) ? (AttackedCard.hp - 1) : 0;
      if ((that.hp == 0) || (AttackedCard.hp == 0)) {
        result = {
          skipBattle: true
        }
      }
      next(result);
    }, 300);
  }
}
