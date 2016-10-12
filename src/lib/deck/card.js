
import Deck from './deck'

import animationFrames from './animationFrames'
import createElement from './createElement'
import Ease from './ease'
import translate from './translate'
import prefix from './prefix'
import Draggabilly from './draggabilly/draggabilly.js'

var maxZ = 100

export default function (i) {
  var transform = prefix('transform')

  // calculate rank/suit, etc..
  var rank = i % 13 + 1
  var suit = i / 13 | 0
  var z = (52 - i) / 4

  // create elements
  var $el = createElement('div')
  var $face = createElement('div')
  var $back = createElement('div')

  // states
  var isDraggable = false
  var isStaticNode = false
  var isFlippable = false
  var isMoveBackable = false

  // self = card
  var self = {i, rank, suit, pos: i, $el, mount, unmount, setSide}

  var modules = Deck.modules
  var module

  // add classes
  $face.classList.add('face')
  $back.classList.add('back')

  // add default transform
  $el.style[transform] = translate(-z + 'px', -z + 'px')

  // add default values
  self.x = -z
  self.y = -z
  self.z = z
  self.rot = 0

  self.PosStatus = {
    startPos : {},
    pos : {},
    starttime : 0,
    originPosX : 0,
    originPosY : 0,
  };
  self.$container = null;

  // set default side to back
  self.setSide('back')

  // add drag/click listeners
  self.dragObj = new Draggabilly($el, {});
  self.onMousedown = function(e){
    var startPos = self.PosStatus.startPos
    var pos = self.PosStatus.pos

    var starttime = Date.now()
    self.PosStatus.starttime = starttime

    e.preventDefault()

    if (e.type === 'mousedown') {
      startPos.x = pos.x = e.clientX
      startPos.y = pos.y = e.clientY
    } else {
      startPos.x = pos.x = e.touches[0].clientX
      startPos.y = pos.y = e.touches[0].clientY
    }

    if (!isDraggable) {
      // is not draggable, do nothing
      return
    }

    // move card
    $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '')
    $el.style.zIndex = maxZ++
  }
  self.onMousemove = function(e){
    var startPos = self.PosStatus.startPos
    var pos = self.PosStatus.pos

    if (!isDraggable) {
      // is not draggable, do nothing
      return
    }
    if (e.type === 'mousemove') {
      pos.x = e.clientX
      pos.y = e.clientY
    } else {
      pos.x = e.touches[0].clientX
      pos.y = e.touches[0].clientY
    }

    // move card
    $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '')

  };
  self.onMouseup = function(e){
    var startPos = self.PosStatus.startPos
    var pos = self.PosStatus.pos
    var starttime = self.PosStatus.starttime


    if (isFlippable && Date.now() - starttime < 200) {
      // flip sides
      self.setSide(self.side === 'front' ? 'back' : 'front')
    }
    if (!isDraggable) {
      // is not draggable, do nothing
      return
    }

    // set current position
    self.x = self.x + pos.x - startPos.x
    self.y = self.y + pos.y - startPos.y
  };
  self.dragObj.on("pointerDown", self.onMousedown);
  self.dragObj.on("pointerMove", self.onMousemove);
  self.dragObj.on("pointerUp", self.onMouseup);

  // load modules
  for (module in modules) {
    addModule(modules[module])
  }

  self.animateTo = function (params) {
    var {delay, duration, x = self.x, y = self.y, rot = self.rot, ease, onStart, onProgress, onComplete} = params
    var startX, startY, startRot
    var diffX, diffY, diffRot

    animationFrames(delay, duration)
      .start(function () {
        startX = self.x || 0
        startY = self.y || 0
        startRot = self.rot || 0
        onStart && onStart()
      })
      .progress(function (t) {
        var et = Ease[ease || 'cubicInOut'](t)

        diffX = x - startX
        diffY = y - startY
        diffRot = rot - startRot

        onProgress && onProgress(t, et)

        self.x = startX + diffX * et
        self.y = startY + diffY * et
        self.rot = startRot + diffRot * et

        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '')
      })
      .end(function () {
        onComplete && onComplete()
      })
  }

  self.setAutoMoveBack = function(){
    isMoveBackable = true;
    self.dragObj.on("pointerDown", self.AutoMoveBackEvent);
  };
  self.setNotMoveBack = function(){
    isMoveBackable = false;
    self.PosStatus.originPosX = 0;
    self.PosStatus.originPosY = 0;
    self.dragObj.off("pointerDown", self.AutoMoveBackEvent);
  };
  self.AutoMoveBackEvent = function(){
    let startPos = self.PosStatus.startPos
    let pos = self.PosStatus.pos
    self.PosStatus.originPosX = self.x + pos.x - startPos.x;
    self.PosStatus.originPosY = self.y + pos.y - startPos.y;
    self.dragObj.off("pointerDown", self.AutoMoveBackEvent);
  };
  self.AutoMoveBack = function(){
    if(isMoveBackable){
      self.animateTo({
        delay: 0,
        duration: 300,

        x: self.PosStatus.originPosX,
        y: self.PosStatus.originPosY,
        rot: 0
      });
    }
  };

  self.toStaticNode = function(droppableEl, callback){
    let $StaticContainer = droppableEl.el;
    isStaticNode = true;
    self.moveToStaticNode(droppableEl, ()=>{
      self.unmount();
      let $el = createElement('div');
      let $face = createElement('div');
      let $back = createElement('div');
      $face.classList.add('face');
      $back.classList.add('back');
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
      $el.style.position = 'relative';
      $el.style.left = '0px';
      $el.style.top = '0px';
      $el.setAttribute("data-name" , self.card.name);
      $StaticContainer.innerHTML = "";
      $StaticContainer.appendChild($el);
      addListener($el, 'click', ()=>{
        $StaticContainer.removeChild($el)
        self.toDragNode();
      });
      callback && callback();
    });
  };
  self.moveToStaticNode = function(droppableEl, callback){
    let $StaticContainer = droppableEl.el;
    let offset2 = getOffset( $StaticContainer ), width2 = $StaticContainer.offsetWidth, height2 = $StaticContainer.offsetHeight;
    let bodyoffset = getOffset( body ), bodywidth = document.documentElement.clientWidth, bodyheight = document.documentElement.clientHeight;
    offset2  = {
      left : (offset2.left + offset2.right)/2 - width2/2,
      top : (offset2.top + offset2.bottom)/2 - height2/2
    }
    self.animateTo({
      delay: 0,
      duration: 300,

      x: offset2.left - bodywidth/2 + width2/2 ,
      y: offset2.top - bodyheight/2 + height2/2 - 10,
      rot: 0,
      onComplete:()=>{
        callback && callback();
      }
    });
  };
  self.isStaticNode = function(){
    return isStaticNode;
  };

  self.toDragNode = function(){
    isStaticNode = false;
    self.mount(self.$container);
  };

  // set rank & suit
  self.setRankSuit = function (rank, suit) {
    var suitName = SuitName(suit)
    $el.setAttribute('class', 'card ' + suitName + ' rank' + rank)
  }

  self.setRankSuit(rank, suit)

  self.enableDragging = function () {
    // this activates dragging
    if (isDraggable) {
      // already is draggable, do nothing
      return
    }
    isDraggable = true
    $el.style.cursor = 'move'
  }

  self.enableFlipping = function () {
    if (isFlippable) {
      // already is flippable, do nothing
      return
    }
    isFlippable = true
  }

  self.disableFlipping = function () {
    if (!isFlippable) {
      // already disabled flipping, do nothing
      return
    }
    isFlippable = false
  }

  self.disableDragging = function () {
    if (!isDraggable) {
      // already disabled dragging, do nothing
      return
    }
    isDraggable = false
    $el.style.cursor = ''
  }

  self.setCard = function (card) {
    self.card  = card;
    $el.setAttribute("data-name" , card.name);
  }
  self.setPosition = function ({x,y,z}) {
    $el.style[transform] = translate(x + 'px', y + 'px')

    self.x = x
    self.y = y
  }

  return self

  function addModule (module) {
    // add card module
    module.card && module.card(self)
  }

  function mount (target) {
    // mount card to target (deck)
    target.appendChild($el)
    self.$container = target;
    self.$root = target
  }

  function unmount () {
    // unmount from root (deck)
    self.$root && self.$root.removeChild($el)
    self.$root = null
  }

  function setSide (newSide) {
    // flip sides
    if (newSide === 'front') {
      if (self.side === 'back') {
        $el.removeChild($back)
      }
      self.side = 'front'
      $el.appendChild($face)
      self.setRankSuit(self.rank, self.suit)
    } else {
      if (self.side === 'front') {
        $el.removeChild($face)
      }
      self.side = 'back'
      $el.appendChild($back)
      $el.setAttribute('class', 'card')
    }
  }
}

function SuitName (suit) {
  // return suit name from suit value
  return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker'
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}

function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}

var body = document.body, docElem = window.document.documentElement,
  transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' };
function getOffset( el ) {
  var offset = el.getBoundingClientRect();
  return {
    top : offset.top + scrollY(),
    left : offset.left + scrollX(),
    right : offset.right + scrollX(),
    bottom : offset.bottom + scrollY(),
  }
}
function scrollX() { return window.pageXOffset || docElem.scrollLeft; }
function scrollY() { return window.pageYOffset || docElem.scrollTop; }
