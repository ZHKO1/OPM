import Card from '../../Module/MainCard/index.js'
import {CardRankD, CardSaitama, card_database} from '../../card_database.js'

export default class SaitamaCitizen extends Card {
  Effect_RoundStartBuff(next) {
    let that = this;
    if(that.Round.getRound() == 3){
      that.comment.addComment("Effect", that, "觉醒!");
      var deckCard = that.deckCard;
      var item = CardSaitama.cards[Math.floor(Math.random() * CardSaitama.cards.length)];
      that = new item.class_ ({
        card : item,
        $el : that.$el,
        position : that.position,
        ground : that.Ground});
      that.deckCard = deckCard;
      that.deckCard.setCard(that);
      that.Ground.CardMap[that.position] = that;
    }else{

    }
    next();
  }
}
