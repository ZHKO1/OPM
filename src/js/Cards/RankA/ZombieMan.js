import Card from '../../Module/MainCard/index.js'
export default class ZombieMan extends Card {
  Effect_RoundEndBuff(next, ground2){
    let that = this;
    if (that.hp <= 9) {
      that.hp = that.hp + 2;
      that.comment.addComment("Effect", that, "Hp加2");
      next();
    } else {
      next();
    }
  }
}
