import {createElement, newElement} from '../lib/tool.js'
import {CardRankS, CardRankA, CardRankB, CardRankC, CardRankD, CardSaitama, card_database} from '../card_database.js'
import {Draggable, Droppable} from '../lib/dragdrop.js'

export default function SelectCard($el, next) {
    let self = {};
    self.$container = $el;
    let RankContainer = document.getElementById('RankContainer');
    let RankCardContainer = document.getElementById('RankCardContainer');
    let dropOverlay = document.getElementById('drop-overlay');
    let SelectedCardContainer = document.getElementById('SelectedCardContainer');
    let DeckContainer = document.getElementById('DeckContainer')
    var body = document.body;
    var prefix = Deck.prefix;
    var transform = prefix('transform')
    var translate = Deck.translate
    self.deck = Deck();

    self.configRank = [
        {RankS: CardRankS},
        {RankA: CardRankA},
        {RankB: CardRankB},
        {RankC: CardRankC},
        {RankD: CardRankD}
    ];
    self.next = next;

    self.setDroppables = function () {
        let droppableArr = [];
        self.droppableArr = droppableArr;
        [].slice.call(document.querySelectorAll('#SelectedCardContainer .drop-area__item')).forEach((el) => {
            droppableArr.push(new Droppable(el, {
                onDrop: (instance, draggableEl, draggableObj) => {
                    if (!instance.draggableObj) {
                        instance.draggableObj = draggableObj;
                    } else {
                        instance.el.innerHTML = "";
                        let card = instance.draggableObj;
                        if ((self.deck.cards.filter(function(item){
                              return !item.isStaticNode();
                          }).filter(function(item){
                              return item.card.id == card.card.id
                          }).length == 0)){
                            card.toDragNode();
                            card.AutoMoveBack();
                        } else {
                            self.deck.cards = self.deck.cards.filter(function(item){
                                return !(item.isStaticNode() && (item.card.id == card.card.id));
                            });
                            card.unmount();
                        }
                        instance.draggableObj = draggableObj;
                    }
                },
                isDroppable(draggableObj){
                    let dropedCardArr = droppableArr.filter((item) => {
                        return item.draggableObj;
                    }).map((item) => {
                        return item.draggableObj.card;
                    });
                    dropedCardArr = dropedCardArr.filter((item) => {
                        let boolean = (item.name == draggableObj.dragObjMethod.card.name);
                        return boolean;
                    });
                    if (dropedCardArr.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                },
                setDroppabledHighLight: (instance) => {
                    instance.el.classList.add('highlight')
                },
                removeDroppabledHighLight: (instance) => {
                    instance.el.classList.remove('highlight')
                },
            }));
        });
        return droppableArr;
    };

    let Droppables = self.setDroppables();

    self.init = function () {
        let that = this;
        that.bind();
        that.initRankItem();
    };
    self.initRankItem = function () {
        let that = this;
        that.configRank.forEach((item) => {
            let grid__item = newElement("div", "grid__item", that.$container, Object.keys(item)[0], {});
            grid__item.Rank = Object.keys(item)[0];
            grid__item.RankCards = item[grid__item.Rank];
            ((grid__item) => {
                addListener(grid__item, "click", () => {
                    that.showCards(grid__item);
                })
            })(grid__item);
        });
    };
    self.bind = function () {
        addListener(dropOverlay, "click", () => {
            self.deck.cleanDragCard();
            body.classList.remove('drag-active');
            RankCardContainer.classList.remove('show');
        })
    };
    self.showCards = function (Rank) {
        let that = this;
        body.classList.add('drag-active');
        RankCardContainer.classList.add('show');
        let RankCards = Rank.RankCards.cards;
        self.deck.cleanDragCard();
        RankCards.forEach(function(RankCard){
            var card = self.deck.addCard();
            card.enableDragging();
            card.enableFlipping();
            card.setCard(RankCard);
            let card_ = new Draggable(card.dragObj.element, card.dragObj, card, Droppables, {
                onFirstStart: () => {
                    self.ShowSelectedCardContainer();
                    card.setAutoMoveBack();
                },
                onStart: () => {
                    self.ShowSelectedCardContainer();
                },
                onDrag: () => {
                    self.ShowSelectedCardContainer();

                },
                onEnd: (wasDropped, droppableEl) => {
                    if (!wasDropped) {
                        card.AutoMoveBack();
                        self.HideSelectedCardContainer();
                    } else {
                        card.toStaticNode(droppableEl, () => {
                            self.HideSelectedCardContainer();
                            self.checkoutCards();
                        });
                    }
                }
            });
            card.DraggableObj = card_;
        });
        self.deck.mount(DeckContainer);
        self.deck.intro();
        self.deck.sort();
        self.deck.poker();
    };
    self.checkoutCards = function () {
        let that = this;
        let droppableArr = self.droppableArr;
        let dropedCardArr = droppableArr.filter((item) => {
            return item.draggableObj;
        }).map((item) => {
            return item.draggableObj.card.id;
        });
        let Player_Cards = {FL: dropedCardArr[0], FR: dropedCardArr[1], BL: dropedCardArr[2], BR: dropedCardArr[3]};

        if (dropedCardArr.length == 4) {
            self.ExitFromSelectedCard(Player_Cards);
            self.next && self.next(Player_Cards, self.deck);
        }
    };

    self.ExitFromSelectedCard = function (Player_Cards) {
        body.classList.remove('drag-active');
        RankCardContainer.classList.remove('show');
        RankContainer.style.display = "none";
        SelectedCardContainer.classList.remove('show');
        self.deck.cards.forEach((item) => {
            (!item.isStaticNode()) && (item.unmount());
        });
        self.deck.cards = self.deck.cards.filter((item) => {
            return item.isStaticNode();
        });
        self.deck.cards = self.deck.cards.map(function(card,i){
            card.id = i;
            return card;
        });
        self.deck.cards.forEach((item) => {
            item.toDragNode();
            item.DraggableObj.destroy();
            item.setNotMoveBack();
        });
        //根据选择的卡片再次整理
        var Selected_Card = [Player_Cards.FL, Player_Cards.FR, Player_Cards.BL, Player_Cards.BR];
        self.deck.cards.forEach((item) => {
            Selected_Card.forEach((item_, i) => {
                if (item.card.id == item_)
                    item.card.sort_id = i;
            });
        });
        self.deck.cards.sort((itemA, itemB) => {
            return itemA.card.sort_id - itemB.card.sort_id
        });
        self.deck.cards.forEach((item, i) => {
            item.i = i;
            delete item.card.sort_id;
        });
        [].slice.call(document.querySelectorAll('#SelectedCardContainer .drop-area__item')).forEach((el) => {
            el.innerHTML = "";
        });
    };

    self.ShowSelectedCardContainer = function () {
        SelectedCardContainer.classList.add('show');
    };
    self.HideSelectedCardContainer = function () {
        SelectedCardContainer.classList.remove('show');
    };

    self.init();
    return self;
}

function addListener(target, name, listener) {
    target.addEventListener(name, listener)
}

function removeListener(target, name, listener) {
    target.removeEventListener(name, listener)
}