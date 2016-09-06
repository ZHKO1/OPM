import {createElement, newElement} from '../tool.js'
import Player from './Player.js'
import Card from './Card.js'
import HalfGround from './HalfGround.js'
import Comment from './Comment.js'
import observable from '../observable'

export default function Round(ground1, ground2) {
  let Round = 0;
  let self;
  let AttackerCard = null;
  let AttackedCard = null;
  let $comment = document.getElementById('comment')
  let comment = Comment($comment);
  let player1 = ground1.Player;
  let player2 = ground2.Player;

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
      console.log(AttackedCard);
      console.log(AttackerCard);
      console.log(card);
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
  self.run  = function(generator) {
    var it = generator();
    function go(result) {
      if (result.done) return result.value;
      return result.value.then(function (value) {
        return go(it.next(value));
      }, function (error) {
        return go(it.throw(error));
      });
    }
    go(it.next());
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
      AttackerCard.disableSelected();
      AttackerCard = null;
      AttackedCard = null;
      if(ground1.isWashout() || ground2.isWashout()){
        ground1.isWashout() && that.GameOver(ground2, ground1) && resolve();
        ground2.isWashout() && that.GameOver(ground1, ground2) && resolve();
        return;
      }
      if(ground1.isActionOver() && ground2.isActionOver()){
        ground1.RoundStart();
        ground2.RoundStart();
        that.nextRound();
      }
      resolve();
    })
  };

  //流程控制-回合制战斗的逻辑
  self.StartGame = function(){
    self.nextRound();
  };
  self.nextRound = function(){
    Round ++;
    comment.addComment("Round", "Round" + Round);
  };
  self.GameOver = function(ground1, ground2){
    comment.addComment("GameOver", ground1, ground2);
    return true;
  };

  return self;
}
