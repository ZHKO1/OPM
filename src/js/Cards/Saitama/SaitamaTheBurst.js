import Card from '../../Module/MainCard/index.js'
export default class SaitamaTheBurst extends Card {
  Effect_BattleAfter(AttackedCardArray, next) {
    let that = this;
    setTimeout(() => {
      that.comment.addComment("Effect", that, "退场!");
      that.hp = 0;
      next();
    }, 300);
    next();
  }
}
