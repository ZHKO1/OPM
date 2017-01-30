import Card from '../../Module/MainCard/index.js'
export default class SaitamaNightmare extends Card {
  Effect_RoundEndBuff(next) {
    let that = this;
    that.comment.addComment("Effect", that, "攻防降低!");
    that.att = ((that.att - 2) > 0) ? (that.att - 2) : 0;
    that.def = ((that.def - 2) > 0) ? (that.def - 2) : 0;
    next();
  }
}
