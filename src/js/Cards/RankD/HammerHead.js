import Card from '../../Module/MainCard/index.js'
export default class HammerHead extends Card {
  Effect_checkoutStatus(next) {
    let that = this;
    if (that.hp <= 0) {
      that.comment.addComment("Effect", that, "第一回合本卡片体力小于1时触发，本卡片体力变成1");
      that.hp = 1;
      next();
    } else {
      next();
    }
  }
}