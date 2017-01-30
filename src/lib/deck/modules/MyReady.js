import getFontSize from '../fontSize'

var fontSize

export default {
    deck: function (deck) {
        deck.myReady = deck.queued(myReady)

        function myReady(next) {
            var cards;

            fontSize = getFontSize()

            cards = deck.cards.filter(function(card){
                return (!card.isStaticNode());
            }).slice(0, 4);

            cards.forEach(function (card) {
                card.myReady(function (i) {
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

        var positionMap = [
            {x: -304, y: 70},
            {x: 20, y: 70},
            {x: -304, y: 221},
            {x: 20, y: 221}
        ];

        card.myReady = function (cb) {
            var i = card.i
            var delay = 0

            card.animateTo({
                delay: delay,
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
