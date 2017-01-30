import Card from '../../Module/MainCard/index.js'
export default class PuripuriPrisoner extends Card {
  Effect_BattleAfter(AttackedCardArray, next) {
    let that = this;
    let result = {};
    let AttackedCard = AttackedCardArray[0];
    setTimeout(() => {
      if (that.Round.getRound() <= 1) {
        that.comment.addComment("Effect", that, "本卡片防御减1，受到本卡片攻击的卡片速度减1");
        that.def = ((that.def - 1) >= 0) ? (that.def - 1) : 0;
        AttackedCard.spd = ((AttackedCard.spd - 1) >= 0) ? (AttackedCard.spd - 1) : 0;
        next(result);
      } else {
        next();
      }
    }, 300);
  }
}