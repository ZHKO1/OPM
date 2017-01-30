import Card from '../../Module/MainCard/index.js'
export default class SaitamaRookie extends Card {
  Effect_RoundStartBuff(next) {
    let that = this;
    that.comment.addComment("Effect", that, "行动顺序最后");
    that.spd = -10;
    next();
  }
}
