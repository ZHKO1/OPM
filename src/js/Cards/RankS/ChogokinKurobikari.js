import Card from '../../Module/MainCard/index.js'
export default class ChogokinKurobikari extends Card {
  constructor({card, $el, position, ground}) {
    super({card, $el, position, ground});
    this.EffectStatus = false;
  }

  Effect_checkoutStatus(next) {
    let that = this;
    if ((that.hp <= 5) && (that.hp > 0) && (that.EffectStatus == false)) {
      that.comment.addComment("Effect", that, "攻击减3");
      that.att = that.att - 3;
      that.EffectStatus = true;
      next();
    } else {
      next();
    }
  }
}
