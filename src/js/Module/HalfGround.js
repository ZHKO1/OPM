import {createElement, newElement} from '../lib/tool.js'
import Player from './Player.js'
import {CardRankD, CardSaitama, card_database} from '../card_database.js'
export default class HalfGround {
    constructor() {
        this.role = null;
        this.Player = null;
        this.Round = null;
        this.$el = null;
        this.$Name = null;
        this.$Cards = null;
        this.comment = null;
        this.$CardArray = [];
        this.CardMap = {};
        this.Cards = [];
        this.deck = null;
    }

    initParam(player, role) {
        this.Player = player;
        this.role = role;
    }

    initRound(Round) {
        this.Round = Round;
    }

    initNode($el) {
        let $Name = createElement("div");
        let $Cards = createElement("div");
        $Name.classList.add('name');
        $Cards.classList.add('HalfGroundCards');
        $el.appendChild($Name);
        $el.appendChild($Cards);
        this.$el = $el;
        this.$Name = $Name;
        this.$Cards = $Cards;
        for (let i = 0; i < 4; i++) {
            let $Card = createElement("div");
            $Cards.appendChild($Card);
            $Card.classList.add('HalfGroundCard');
            var backrow = (this.role == "host") ? ((i) => i > 1) : ((i) => i < 2);
            if (backrow(i)) {
                $Card.classList.add('backrow');
            }
            this.$CardArray.push($Card);
        }
    }

    setName() {
        let $div = createElement("div");
        this.$Name.appendChild($div);
        $div.textContent = this.Player.name;
    }

    setCards(arr) {
        let that = this;
        let cards = this.getCardsData(arr);
        let cards_order = (this.role == "host") ? ["FL", "FR", "BL", "BR"] : ["BR", "BL", "FR", "FL"];
        cards_order.forEach((position, i) => {
            let $Card = this.$CardArray[i];
            let card = new cards[position]["class_"]({
                card: cards[position],
                $el: $Card,
                position: position,
                ground: that
            });
            this.CardMap[position] = card;
        });
    }

    getCardsData(obj) {
        let cards_;
        let cards = {};
        if (!obj) {
            cards_ = JSON.parse(JSON.stringify(card_database.cards));
            cards_.forEach((item, i) => {
                item.class_ = card_database.cards[i].class_;
            });
            for (let i = cards_.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [cards_[i], cards_[j]] = [cards_[j], cards_[i]];
            }
            cards.FL = cards_[0];
            cards.FR = cards_[1];
            cards.BL = cards_[2];
            cards.BR = cards_[3];
        } else {
            cards_ = JSON.parse(JSON.stringify(card_database.cards));
            cards_.forEach((item, i) => {
                item.class_ = card_database.cards[i].class_;
            });
            cards.FL = cards_.find((item) => {
                return (item.id) === (obj.FL)
            });
            cards.FR = cards_.find((item) => {
                return (item.id) === (obj.FR)
            });
            cards.BL = cards_.find((item) => {
                return (item.id) === (obj.BL)
            });
            cards.BR = cards_.find((item) => {
                return (item.id) === (obj.BR)
            });
        }
        return cards;
    }

    setDeck(deck) {
        var that = this;
        this.deck = deck;
        if (this.role == "host") {
            deck.myReady();
        } else {
            if (deck.cards.length <= 4) {
                let cards_order = ["FL", "FR", "BL", "BR"];
                let cardMap = {
                    FL: {x: 10000, y: -240},
                    FR: {x: 10000, y: -240},
                    BL: {x: 10000, y: -240},
                    BR: {x: 10000, y: -240}
                };
                cards_order.forEach((position) => {
                    let card = deck.addCard();
                    card.enableDragging();
                    card.enableFlipping();
                    card.setCard(this.CardMap[position]);
                    card.setPosition({
                        x: cardMap[position].x,
                        y: cardMap[position].y
                    });
                    var DeckContainer = document.getElementById('DeckContainer')
                    deck.mount(DeckContainer);
                });
            }
            deck.rivalReady();
        }

        let cards_order = ["FL", "FR", "BL", "BR"];
        cards_order.forEach(function (position, i) {
            let deckCard = deck.cards[(that.role == "host") ? i : (i + 4)];
            that.CardMap[position].deckCard = deckCard;
            that.CardMap[position].deckCard.disableDragging();
        });
    }

    isActionOver() {
        let that = this;
        let result = true;
        let cards_order = ["FL", "FR", "BL", "BR"];
        cards_order.forEach((position, i) => {
            result = result && (that.CardMap[position].status.ActionOver || (!!!that.CardMap[position].hp));
        });
        return result;
    }

    RoundStart() {
        let that = this;
        let result = true;
        let cards_order = ["FL", "FR", "BL", "BR"];
        cards_order.forEach((position, i) => {
            that.CardMap[position].setActionable();
        });
        return result;
    }

    getAlive() {
        let that = this;
        let result = [];
        let cards_order = ["FL", "FR", "BL", "BR"];
        cards_order.forEach((position, i) => {
            if (that.CardMap[position].hp) {
                result.push(that.CardMap[position]);
            }
        });
        return result;
    }

    getAction() {
        let that = this;
        let result = [];
        let cards_order = ["FL", "FR", "BL", "BR"];
        cards_order.forEach((position, i) => {
            if (that.CardMap[position].hp && (!that.CardMap[position].status.ActionOver)) {
                result.push(that.CardMap[position]);
            }
        });
        return result;
    }

    isWashout() {
        let that = this;
        let result = true;
        let cards_order = ["FL", "FR", "BL", "BR"];
        cards_order.forEach((position, i) => {
            result = (result && (!that.CardMap[position].hp));
        });
        return !!result;
    }

    init({$el, Player, role, cards, deck}) {
        let that = this;
        that.initParam(Player, role);
        that.initNode($el);
        that.setName();
        that.setCards(cards);
        that.setDeck(deck);
    }
}