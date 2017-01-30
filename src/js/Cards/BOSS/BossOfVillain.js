import Card from '../../Module/MainCard/index.js'
export default class BossOfVillain extends Card {
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
  getAttackedCard(card1, ground) {
    let that = this;
    let result = [];
    let card2 =  null;
    card1 = card1[0]
    result.push(card1);
    if(that.Round.getRound() <= 1){
      switch (card1.position){
        case "FL":
          card2 = ground.CardMap["FR"];
          (card2.hp > 0) && result.push(card2);
          break;
        case "FR":
          card2 = ground.CardMap["FL"];
          (card2.hp > 0) && result.push(card2);
          break;
        case "BL":
          card2 = ground.CardMap["BR"];
          (card2.hp > 0) && result.push(card2);
          break;
        case "BR":
          card2 = ground.CardMap["BL"];
          (card2.hp > 0) && result.push(card2);
          break;
      }
      that.comment.addComment("Effect", that, "横排AOE攻击");
    }
    return result;
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
