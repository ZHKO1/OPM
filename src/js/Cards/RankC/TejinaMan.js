import Card from '../../Module/MainCard/index.js'
export default class TejinaMan extends Card {
  Effect_RoundStartBuff(next, ground2) {
    this.RoundFirst = true;
    next();
  }

  updateHp(damage){
    let that = this;
    if(that.RoundFirst){
      that.comment.addComment("Effect", that, "每回合本卡片受到第一次攻击时触发，这次攻击造成的伤害变成0");
      that.RoundFirst = false;
      damage = 0;
    }else{
      that.hp = ((that.hp - damage) >= 0) ? (that.hp - damage) : 0;
    }
    return damage;
  }

}
