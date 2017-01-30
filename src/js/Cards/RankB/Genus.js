import Card from '../../Module/MainCard/index.js'
export default class Genus extends Card {
  constructor({card, $el, position, ground}) {
    super({card, $el, position, ground});
    this.EffectStatus = false;
  }

  Effect_Defeated(AttackerCard, next) {
    let that = this;
    if ((that.hp <= 0) && (!that.EffectStatus)) {
      that.comment.addComment("Effect", that, "复活!体力为2");
      that.hp = 2;
      that.reviveBack();
      that.EffectStatus = true;
    }
    next();
  }
}
