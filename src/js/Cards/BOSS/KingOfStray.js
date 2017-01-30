import Card from '../../Module/MainCard/index.js'
export default class KingOfStray extends Card {
  attackTo(cardArray) {
    let that = this;
    let damageArray = [];
    let damage;
    cardArray.forEach(function (card) {
      damage = Math.floor(card.hp * 1.0 /2);
      damageArray.push(damage);
    });
    that.comment.addComment("Effect", that, "被攻击的卡片体力减半!");
    return damageArray;
  }
}
