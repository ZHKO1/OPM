import {createElement, newElement} from '../tool.js'
import {CardRankD, CardSaitama, card_database} from '../card_database.js'
import {Draggable, Droppable} from '../lib/dragdrop.js'

export default function SelectCard($el, next) {
  let self = {};
  self.$container = $el;
  let RankContainer = document.getElementById('RankContainer');
  let RankCardContainer = document.getElementById('RankCardContainer');
  let dropOverlay = document.getElementById('drop-overlay');
  let SelectedCardContainer = document.getElementById('SelectedCardContainer');
  var body = document.body;
  var prefix = Deck.prefix;
  var transform = prefix('transform')
  var translate = Deck.translate
  var DeckContainer = document.getElementById('DeckContainer')
  var deck;

  self.configRank = [
    {RankD:CardRankD},
    {"???":card_database},
  ];
  self.next = next;

  self.setDroppables = function() {
    let droppableArr = [];
    self.droppableArr = droppableArr;
    [].slice.call( document.querySelectorAll( '#SelectedCardContainer .drop-area__item' )).forEach( (el)=> {
      droppableArr.push( new Droppable( el, {
        onDrop : ( instance, draggableEl , draggableObj) => {
          if(!instance.draggableObj){
            instance.draggableObj = draggableObj;
          }else{
            instance.el.innerHTML = "";
            let card  = instance.draggableObj;
            card.toDragNode();
            card.AutoMoveBack();
            instance.draggableObj = draggableObj;
          };
        },
        isDroppable(draggableObj){
          let dropedCardArr = droppableArr.filter((item)=>{
            return item.draggableObj;
          }).map((item)=>{
            return item.draggableObj.card;
          });
          dropedCardArr = dropedCardArr.filter((item)=>{
            let boolean = (item.name == draggableObj.dragObjMethod.card.name);
            return boolean;
          });
          if(dropedCardArr.length != 0){
            return false;
          }else{
            return true;
          }
        },
        setDroppabledHighLight : (instance)=>{
          instance.el.classList.add('highlight')
        },
        removeDroppabledHighLight : (instance)=>{
          instance.el.classList.remove('highlight')
        },
      }));
    });
    return droppableArr;
  };
  let Droppables = self.setDroppables();

  self.init = function(){
    let that = this;
    that.bind();
    that.initRankItem();
  };
  self.initRankItem = function(){
    let that = this;
    that.configRank.forEach((item)=>{
      let grid__item = newElement("div", "grid__item", that.$container, Object.keys(item)[0], {});
      grid__item.Rank = Object.keys(item)[0];
      grid__item.RankCards = item[grid__item.Rank];
      ((grid__item)=>{
        addListener(grid__item,"click",()=>{
          that.showCards(grid__item);
        })
      })(grid__item);
    });
  };
  self.bind = function() {
    addListener(dropOverlay,"click",()=>{
      deck.unmount();
      body.classList.remove('drag-active');
      RankCardContainer.classList.remove('show');
    })
  };
  self.showCards = function(Rank) {
    let that = this;
    body.classList.add('drag-active');
    RankCardContainer.classList.add('show');
    deck = Deck(Rank.RankCards.cards.length);
    let RankCards = Rank.RankCards.cards;
    deck.cards.forEach(function (card, i) {
      card.enableDragging();
      card.enableFlipping();
      card.setCard(RankCards[i]);
      let card_ = new Draggable(card.dragObj.element, card.dragObj, card, Droppables, {
        onFirstStart : () => {
          self.ShowSelectedCardContainer();
          card.setAutoMoveBack();
        },
        onStart : () => {
          self.ShowSelectedCardContainer();
        },
        onDrag : () => {
          self.ShowSelectedCardContainer();

        },
        onEnd : (wasDropped, droppableEl) => {
          if(!wasDropped){
            card.AutoMoveBack();
            self.HideSelectedCardContainer();
          }else{
            card.toStaticNode(droppableEl, ()=>{
              self.HideSelectedCardContainer();
              self.checkoutCards();
            });
          }
        }
      });
      card.DraggableObj = card_;
    });

    deck.mount(DeckContainer);
    deck.intro();
    deck.sort();
    deck.poker();
  };
  self.checkoutCards = function() {
    let that = this;
    let droppableArr = self.droppableArr;
    let dropedCardArr = droppableArr.filter((item)=>{
      return item.draggableObj;
    }).map((item)=>{
      return item.draggableObj.card.id;
    });
    let Player_Cards = {FL: dropedCardArr[0], FR: dropedCardArr[1], BL: dropedCardArr[2], BR: dropedCardArr[3]};

    if(dropedCardArr.length == 4){
      self.ExitFromSelectedCard();
      self.next && self.next(Player_Cards, deck);
    }
  };

  self.ExitFromSelectedCard = function(){
    body.classList.remove('drag-active');
    RankCardContainer.classList.remove('show');
    RankContainer.style.display = "none";
    SelectedCardContainer.classList.remove('show');
    deck.cards.forEach((item)=>{
      (!item.isStaticNode()) && (item.unmount());
    });
    deck.cards = deck.cards.filter((item)=>{
      return item.isStaticNode();
    });
    deck.cards.forEach((item)=>{
      item.toDragNode();
      item.DraggableObj.destroy();
      item.setNotMoveBack();
    });
    [].slice.call( document.querySelectorAll( '#SelectedCardContainer .drop-area__item' )).forEach( (el)=> {
      el.innerHTML = "";
    });
  };

  self.ShowSelectedCardContainer = function(){
    SelectedCardContainer.classList.add('show');
  };
  self.HideSelectedCardContainer = function(){
    SelectedCardContainer.classList.remove('show');
  };

  self.init();
  return self;
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}

function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}