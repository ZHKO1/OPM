import Card from '../../Module/MainCard/index.js'
export default class Fubuki extends Card {
  Effect_BeforeAttacked(AttackerCard, AttackedCardArray, next){
    let that = this;
    if(AttackedCardArray.length > 1){
      AttackerCard.attackTo = function(cardArray) {
        let card2 = this;
        let damageArray = [];
        let damage;
        cardArray.forEach(function (card) {
          damage = ((card2.att - card.def) >= 0) ? (card2.att - card.def) : 0;
          damageArray.push(damage);
        });
        that.comment.addComment("Effect", that, "本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半");
        damageArray = damageArray.map(function(damage){
          return Math.floor(damage * 1.0 / 2);
        });
        return damageArray;
      }
    }
    next();
  }
  Effect_AfterAttacked(AttackerCard, damage, next) {
    AttackerCard.attackTo = function(cardArray) {
      let that = this;
      let damageArray = [];
      let damage;
      cardArray.forEach(function (card) {
        damage = ((that.att - card.def) >= 0) ? (that.att - card.def) : 0;
        damageArray.push(damage);
      });
      return damageArray;
    }
    next();
  }
}
