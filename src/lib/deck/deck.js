import createElement from './createElement'

import animationFrames from './animationFrames'
import ease from './ease'
import bysuit from './modules/bysuit'
import fan from './modules/fan'
import intro from './modules/intro'
import poker from './modules/poker'
import shuffle from './modules/shuffle'
import sort from './modules/sort'
import flip from './modules/flip'
import myReady from './modules/MyReady'
import rivalReady from './modules/RivalReady'

import observable from './observable'
import queue from './queue'
import prefix from './prefix'
import translate from './translate'

import Card from './card'

export default function Deck() {
    // init cards array
    var cards = []

    var $el = createElement('div')
    var self = observable({mount, unmount, cleanDragCard, cards, $el})
    var $root

    var modules = Deck.modules
    var module

    // make queueable
    queue(self)

    // load modules
    for (module in modules) {
        addModule(modules[module])
    }

    // add class
    $el.classList.add('deck')

    var card

    // create cards
    for (var i = cards.length; i; i--) {
        card = cards[i - 1] = Card(i - 1)
        card.mount($el)
    }

    self.addCard = function () {
        var card;
        var i = self.cards.length;
        self.cards.push(null);
        card = self.cards[i] = Card(i)
        card.mount($el);
        return card;
    }

    return self

    function mount(root) {
        // mount deck to root
        $root = root
        $root.appendChild($el)
    }

    function unmount() {
        // unmount deck from root
        $root.removeChild($el);
        self.queueing = []
    }

    function addModule(module) {
        module.deck && module.deck(self)
    }

    function cleanDragCard(){
        self.cards.forEach(function(card){
            (!card.isStaticNode()) && card.unmount();
        });
        self.cards = self.cards.filter(function(card){
            return card.isStaticNode();
        });
    }
}
Deck.animationFrames = animationFrames
Deck.ease = ease
Deck.modules = {bysuit, fan, intro, poker, shuffle, sort, flip, myReady, rivalReady}
Deck.Card = Card
Deck.prefix = prefix
Deck.translate = translate
