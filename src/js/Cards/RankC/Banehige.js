import Card from '../../Module/MainCard/index.js'
export default class Banehige extends Card {
  Effect_RoundStartBuff(next) {
    let that = this;
    setTimeout(() => {
      if (that.hp == 1 && (that.att == 2) && (that.def == 4)) {
        that.comment.addComment("Effect", that, "本卡片攻击变成4，防御变成2");
        that.att = 4;
        that.def = 2;
        next();
      } else {
        next();
      }
    }, 300);
  }

  Effect_checkoutStatus(next) {
    this.Effect_RoundStartBuff(next);
  }
}
