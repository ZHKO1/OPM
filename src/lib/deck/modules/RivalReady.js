
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    deck.rivalReady = deck.queued(rivalReady)

    function rivalReady (next) {
      var cards = deck.cards

      fontSize = getFontSize()

      cards = deck.cards.slice(4,8);

      cards.forEach(function (card) {
        card.rivalReady(function (i) {
          if (i === cards.length - 1) {
            next()
          }
        })
      })
    }
  },
  card: function (card) {
    var rank = card.rank
    var suit = card.suit

    var cardMap = [
      {x : -261, y : -240},
      {x : -87, y : -240},
      {x : 87, y : -240},
      {x : 261, y : -240}
    ];

    var positionMap = [
      {x : 20, y : -93},
      {x : -304, y : -93},
      {x : 20, y : -246},
      {x : -304, y : -246}
    ];

    card.rivalReady = function (cb) {
      var i = card.i - 4;
      var delay = 0

      card.animateTo({
        delay: delay + 100 * i,
        duration: 400,

        x: cardMap[i].x,
        y: cardMap[i].y,
        rot: 0
      })

      card.animateTo({
        delay: 1000,
        duration: 400,

        x: positionMap[i].x,
        y: positionMap[i].y,
        rot: 0,

        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}
