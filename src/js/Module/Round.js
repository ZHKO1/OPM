import {createElement, newElement} from '../tool.js'
import Player from './Player.js'
import HalfGround from './HalfGround.js'
import Comment from './Comment.js'
import observable from '../observable'
import Queue from '../queue.js'

export default function Round(ground1, ground2) {
  let Round = 0;
  let self;
  let AttackerCard = null;
  let AttackedCard = null;
  let isGameOver = false;
  let $comment = document.getElementById('comment')
  let comment = Comment($comment);
  let player1 = ground1.Player;
  ground1.comment = comment;
  let player2 = ground2.Player;
  ground2.comment = comment;

  self = observable({Round});

  //玩家点击卡片的逻辑
  self.on("select",function(card){
    self.clickCardCallback(card);
  });
  self.clickCardCallback = function(card) {
    let that = this;
    if((!AttackerCard) && (!card.status.ActionOver)){
      AttackerCard = card;
      card.setSelected();
    }else if((!AttackerCard) && (card.status.ActionOver)){
    }else if(AttackerCard === card){
      AttackerCard = null;
      card.setNotSelected();
    }else if((AttackerCard) && ((!AttackedCard))){
      if(that.checkCardRole(card)){
        AttackedCard = card;
        card.setSelected();
        self.run(self.OnceBattleStep);
      }
    }else{
      throw "选择卡片机制抛出错误";
    }
  };

  //tool工具属性 有效帮助判断状态之类的
  self.checkCardRole = function(card){
    if(AttackerCard.role !== card.role){
      return true;
    }else{
      return false;
    }
  };

  //流程控制-卡片战斗的逻辑
  let OnceBattleStep = function *(){
    let that = this;
    try{
      let status = yield that.CardBattleBefore();
      let damage = yield that.CardBattle();
      let result1 = yield that.updateCards(damage);
      let result2 = yield that.checkDefeatedCard();
      let result3 = yield that.OnceBattleCompleted(result1);
    }catch(e){
      throw e;
    }
  };
  self.OnceBattleStep = function(){
    return OnceBattleStep.call(self);
  };
  self.run  = function(generator,callback) {
    var it = generator();
    function go(result) {
      if (result.done){
        callback && callback();
        return result.value;
      }
      return result.value.then(function (value) {
        return go(it.next(value));
      }, function (error) {
        return go(it.throw(error));
      });
    }
    go(it.next());
  };
  self.CardBattleBefore = function(){
    return new Promise(function (resolve, reject){
      let status = AttackerCard.Effect_BattleBefore();
      resolve(status);
    });
  };
  self.CardBattle = function(){
    return new Promise(function (resolve, reject){
      var damage = AttackerCard.attackTo(AttackedCard);
      resolve(damage);
    });
  };
  self.updateAttackerCard = function(){
    return new Promise(function (resolve, reject){
      AttackerCard.update(function(){
        resolve();
      });
    })
  };
  self.updateAttackedCard = function(){
    return new Promise(function (resolve, reject){
      AttackedCard.update(function(){
        resolve();
      });
    })
  };
  self.addComment = function(damage){
    return new Promise(function (resolve, reject){
      comment.addComment("Attack", AttackerCard, AttackedCard, damage);
      resolve();
    })
  };
  self.updateCards = function(damage){
    var that = this;
    return new Promise(function (resolve, reject){
      Promise.all([
        that.updateAttackerCard(),
        that.updateAttackedCard(),
        that.addComment(damage)
      ]).then(()=>{
        resolve();
      });
    })
  };
  self.checkDefeatedCard = function(){
    let that = this;
    return new Promise(function (resolve, reject){
      if(AttackedCard.hp <= 0){
        AttackedCard.defeatedExit(function () {
          resolve();
        });
      }else{
        resolve();
      }
    })
  };
  self.OnceBattleCompleted  = function() {
    let that = this;
    return new Promise(function (resolve, reject){
      AttackerCard.setActionOver();
      AttackerCard = null;
      AttackedCard = null;
      self.trigger("ManualTransmission");
      resolve();
    })
  };

  //流程控制-回合制战斗的逻辑
  let OnceRoundStep = function *(){
    let that = this;
    let result;
    let sortResult;
    let beginBuff;
    let endBuff;
    let BattleResult;
    try{
      while(!isGameOver){
        result = yield that.StartRound();
        sortResult = yield that.sortCardsSpeed();
        beginBuff = yield that.checkCardsBeginBuff(sortResult);
        isGameOver = yield * that.startRoundBattle();//自动根据速度排序进行下一步或者玩家自行操作
        yield that.OnceRoundCompleted(isGameOver);
        sortResult = yield that.sortCardsSpeed();
        endBuff = yield that.checkCardsEndBuff(sortResult);
      }
    }catch(e){
      throw e;
    }
  };
  self.OnceRoundStep = function(){
    return OnceRoundStep.call(self);
  };
  self.StartRound = function(){
    let that = this;
    return new Promise(function (resolve, reject){
      that.nextRound();
      resolve();
    })
  };
  self.sortCardsSpeed = function(){
    let that = this;
    return new Promise(function (resolve, reject){
      let G1ActionCards = ground1.getAction();
      let G2ActionCards = ground2.getAction();
      let AllActionCards = G1ActionCards.concat(G2ActionCards);
      AllActionCards.forEach((item)=>{
        let random = Math.random() * 0.25;
        item.spd_ = item.spd + random;
      });
      AllActionCards = AllActionCards.sort((itemA, itemB)=>{
        return itemA.spd_ < itemB.spd_
      });
      resolve(AllActionCards);
    })
  };
  self.checkCardsBeginBuff = function(sortArray){
    let that = this;
    return new Promise(function (resolve, reject){
      let queue = new Queue();
      sortArray.forEach((item)=>{
        queue.queued(item.Effect_RoundStartBuff, item)();
      });
      queue.queued(resolve)();
    })
  };
  let startRoundBattle = function *(){
    let that = this;
    let i,isAuto, sortResult;
    sortResult = yield that.sortCardsSpeed();
    while((sortResult.length>0) && (!ground1.isWashout() && !ground2.isWashout())){
      isAuto = yield that.NextStepMoudle();
      if(isAuto){
        sortResult = yield that.sortCardsSpeed();
        AttackerCard = sortResult[0];
        AttackedCard = sortResult[0].getAttackedObject((ground1.role == sortResult[0].role)?ground2:ground1)[0];
        yield that.startCardBattle();
      }
      sortResult = yield that.sortCardsSpeed();
    }
    if(ground1.isWashout() || ground2.isWashout()){
      return true;
    }else{
      return false;
    }
  };
  self.startRoundBattle = function(argument){
    return startRoundBattle.call(self,argument);
  };
  self.startCardBattle = function(argument){
    let that = this;
    return new Promise(function (resolve, reject){
      self.run(self.OnceBattleStep,()=>{
        resolve();
      });
    })
  };
  self.OnceRoundCompleted = function(isGameOver){
    let that = this;
    return new Promise(function (resolve, reject){
      if(isGameOver){
        if(ground1.isWashout() || ground2.isWashout()){
          ground1.isWashout() && that.GameOver(ground2, ground1) && resolve(true);
          ground2.isWashout() && that.GameOver(ground1, ground2) && resolve(true);
          return;
        }
      }else{
        if(ground1.isActionOver() && ground2.isActionOver()){
          ground1.RoundStart();
          ground2.RoundStart();
          resolve(false);
        }
      }
    })
  };
  self.checkCardsEndBuff = function(sortArray){
    let that = this;
    return new Promise(function (resolve, reject){
      resolve();
    })
  };

  self.nextRound = function(){
    Round ++;
    comment.addComment("Round", "Round" + Round);
  };
  self.GameOver = function(ground1, ground2){
    comment.addComment("GameOver", ground1, ground2);
    return true;
  };
  self.NextStepMoudle = function(){
    let that = this;
    return new Promise(function (resolve, reject){
      let thing = function(){ resolve(true);}
      removeListener(document.getElementById("test"), 'mousedown', thing);
      addListener(document.getElementById("test"), 'mousedown', thing);
      self.off("ManualTransmission");
      self.on("ManualTransmission",function(){
        resolve(false);
      });
    })
  };
  return self;
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}
function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}