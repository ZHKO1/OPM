import Card from '../../Module/MainCard/index.js'
export default class Iaian extends Card {
  Effect_RoundStartBuff(next, ground2) {
    let that = this;
    that.comment.addComment("Effect", that, "先手!");
    that.backUpAbitily(["spd"]);
    that.spd = 1000;
    next();

  }

  Effect_RoundEndBuff(next, ground2){
    let that = this;
    that.returnToAbility(["spd"]);
    next();
  }
}
