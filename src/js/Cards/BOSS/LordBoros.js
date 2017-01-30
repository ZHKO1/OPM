import Card from '../../Module/MainCard/index.js'
export default class LordBoros extends Card {
  Effect_RoundEndBuff(next){
    let that = this;
    that.comment.addComment("Effect", that, "每次回合结束阶段触发，本卡片体力加3");
    that.hp = that.hp + 3;
    next();
  }
}
