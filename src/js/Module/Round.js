import {createElement, newElement} from '../lib/tool.js'
import Player from './Player.js'
import HalfGround from './HalfGround.js'
import Comment from './Comment.js'
import observable from '../lib/observable'
import Queue from '../lib/queue.js'

export default function Round(ground1, ground2) {
    let Round = 0;
    let self;
    let AttackerCard = null;
    let AttackedCardArray = [];
    let isGameOver = false;
    let $comment = document.getElementById('comment')
    let comment = Comment($comment);
    let player1 = ground1.Player;
    ground1.comment = comment;
    let player2 = ground2.Player;
    ground2.comment = comment;

    self = observable({Round});

    // 玩家点击卡片的逻辑
    self.on("select", function (card) {
        self.clickCardCallback(card);
    });
    self.clickCardCallback = function (card) {
        let that = this;
        if ((!AttackerCard) && (!card.status.ActionOver)) {
            AttackerCard = card;
            card.setSelected();
        } else if ((!AttackerCard) && (card.status.ActionOver)) {
        } else if (AttackerCard === card) {
            AttackerCard = null;
            card.setNotSelected();
        } else if ((AttackerCard) && (AttackedCardArray.length == 0)) {
            if (that.checkCardRole(card)) {
                AttackedCardArray = [card];
                card.setSelected();
                self.run(self.OnceBattleStep);
            }
        } else {
            throw "选择卡片机制抛出错误";
        }
    };

    // tool工具属性 有效帮助判断状态之类的
    self.checkCardRole = function (card) {
        if (AttackerCard.role !== card.role) {
            return true;
        } else {
            return false;
        }
    };
    self.getRound = function(){
        return Round;
    }

    // 流程控制运作器
    self.run = function (generator, callback) {
        var it = generator();

        function go(result) {
            if (result.done) {
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

    // 流程控制-卡片战斗的逻辑
    let OnceBattleStep = function *() {
        let that = this;
        let status;
        let damageArray;
        let AttackerCardAttackTime;
        try {
            yield that.initAttackedCards();
            AttackerCardAttackTime = yield that.initAttackerCardAttackTime();
            yield that.OnceBattleStart();
            status = yield that.checkBeforeAttackerCardEvent();
            yield that.checkBeforeAttackedCardsEvent();
            if (!status.skipBattle) {
                while(AttackerCardAttackTime){
                    damageArray = yield that.getAttackerCardDamage();
                    damageArray = yield that.getAttackedCardHp(damageArray);
                    yield that.addDamageComment(damageArray);
                    yield that.checkAfterAttackerCardEvent();
                    yield that.checkAfterAttackedCardsEvent(damageArray);
                    AttackerCardAttackTime--;
                    if(AttackerCardAttackTime >= 1){
                        yield that.addAttackTimeComment();
                    }
                }
            }
            yield that.checkCardsEvent();
            yield that.checkDefeatedCards();
            yield that.OnceBattleCompleted();
        } catch (e) {
            throw e;
        }
    };
    self.OnceBattleStep = function () {
        return OnceBattleStep.call(self);
    };
    self.initAttackedCards = function () {
        return new Promise(function (resolve, reject) {
            AttackedCardArray = AttackerCard.getAttackedCard(AttackedCardArray, (ground1.role == AttackerCard.role) ? ground2 : ground1);
            resolve();
        })
    };
    self.initAttackerCardAttackTime = function () {
        return new Promise(function (resolve, reject) {
            let Time = AttackerCard.getAttackTime();
            resolve(Time);
        })
    };
    self.addAttackTimeComment = function () {
        return new Promise(function (resolve, reject) {
            comment.addComment("", "发动连击!");
            resolve();
        })
    };
    self.updateAttackerCard = function () {
        return new Promise(function (resolve, reject) {
            AttackerCard.setNotSelected();
            resolve();
        })
    };
    self.updateAttackedCard = function () {
        return new Promise(function (resolve, reject) {
            AttackedCardArray.forEach(function(AttackedCard){
                AttackedCard.setNotSelected();
            })
            resolve();
        })
    };
    self.addAttackComment = function () {
        return new Promise(function (resolve, reject) {
            comment.addComment("Attack", AttackerCard);
            resolve();
        })
    };
    self.OnceBattleStart = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            Promise.all([
                that.updateAttackerCard(),
                that.updateAttackedCard(),
                that.addAttackComment()
            ]).then(() => {
                resolve();
            });
        })
    };
    self.checkBeforeAttackerCardEvent = function () {
        return new Promise(function (resolve, reject) {
            AttackerCard.Effect_BattleBefore(AttackedCardArray, function (result) {
                resolve(result);
            });
        });
    };
    self.checkBeforeAttackedCardEvent = function (Card) {
        return new Promise(function (resolve, reject) {
            Card.Effect_BeforeAttacked(AttackerCard, AttackedCardArray, function () {
                resolve();
            });
        });
    };
    self.checkBeforeAttackedCardsEvent = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            (AttackedCardArray).forEach(function(item, i){
                CardEventArray.push(that.checkBeforeAttackedCardEvent(item));
            });
            Promise.all(CardEventArray).then(() => {
                resolve();
            });
        })
    };
    self.checkAfterAttackerCardEvent = function () {
        return new Promise(function (resolve, reject) {
            AttackerCard.Effect_BattleAfter(AttackedCardArray, function () {
                resolve();
            });
        });
    };
    self.checkAfterAttackedCardEvent = function (Card, damage) {
        return new Promise(function (resolve, reject) {
            Card.Effect_AfterAttacked(AttackerCard, damage, function () {
                resolve();
            });
        });
    };
    self.checkAfterAttackedCardsEvent = function (damageArray) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            (AttackedCardArray).forEach(function(item, i){
                CardEventArray.push(that.checkAfterAttackedCardEvent(item, damageArray[i]));
            });
            Promise.all(CardEventArray).then(() => {
                resolve();
            });
        })
    };
    self.getAttackerCardDamage = function () {
        return new Promise(function (resolve, reject) {
            var damageArray = AttackerCard.attackTo(AttackedCardArray);
            resolve(damageArray);
        });
    };
    self.getAttackedCardHp = function (damageArray) {
        return new Promise(function (resolve, reject) {
            AttackedCardArray.forEach(function(AttackedCard, i){
                damageArray[i] = AttackedCard.updateHp(damageArray[i]);
            });
            resolve(damageArray);
        });
    };
    self.addDamageComment = function (damageArray) {
        return new Promise(function (resolve, reject) {
            damageArray.forEach(function (damage, i) {
                (typeof damage) && comment.addComment("Damage", AttackerCard, AttackedCardArray[i], damage);
            });
            resolve();
        })
    };
    self.checkCardEvent = function (card) {
        return new Promise(function (resolve, reject) {
            card.Effect_checkoutStatus(function () {
                resolve();
            });
        })
    };
    self.checkCardsEvent = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            (AttackedCardArray.concat([AttackerCard])).forEach(function(item){
                CardEventArray.push(that.checkCardEvent(item));
            });
            Promise.all(CardEventArray).then(() => {
                resolve();
            });
        })
    };
    self.checkDefeatedCard = function (card) {
        return new Promise(function (resolve, reject) {
            if (card.hp <= 0) {
                card.defeatedExit(AttackerCard, function () {
                    resolve();
                });
            } else {
                resolve();
            }
        })
    };
    self.checkDefeatedCards = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            var CardEventArray = [];
            (AttackedCardArray.concat([AttackerCard])).forEach(function(item){
                CardEventArray.push(that.checkDefeatedCard(item));
            });
            Promise.all(CardEventArray).then(() => {
                resolve();
            });
        })
    };
    self.OnceBattleCompleted = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            AttackerCard.setActionOver();
            AttackerCard = null;
            AttackedCardArray = [];
            comment.addComment("Br");
            self.trigger("ManualTransmission");
            resolve();
        })
    };

    // 流程控制-回合制战斗的逻辑
    let OnceRoundStep = function *() {
        let that = this;
        let result;
        let sortResult;
        let beginBuff;
        let endBuff;
        let BattleResult;
        try {
            while (!isGameOver) {
                result = yield that.StartRound();
                sortResult = yield that.sortCardsSpeed();
                beginBuff = yield that.checkCardsBeginBuff(sortResult);
                isGameOver = yield * that.startRoundBattle();//自动根据速度排序进行下一步或者玩家自行操作
                yield that.OnceRoundCompleted(isGameOver);
                if(!isGameOver){
                    sortResult = yield that.sortCardsSpeed();
                    endBuff = yield that.checkCardsEndBuff(sortResult);
                }
            }
        } catch (e) {
            throw e;
        }
    };
    self.OnceRoundStep = function () {
        return OnceRoundStep.call(self);
    };
    self.StartRound = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.nextRound();
            resolve();
        })
    };
    self.sortCardsSpeed = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            let G1ActionCards = ground1.getAction();
            let G2ActionCards = ground2.getAction();
            let AllActionCards = G1ActionCards.concat(G2ActionCards);
            AllActionCards.forEach((item) => {
                let random = Math.random() * 0.25;
                item.spd_ = item.spd + random;
            });
            AllActionCards = AllActionCards.sort((itemA, itemB) => {
                return itemA.spd_ < itemB.spd_
            });
            resolve(AllActionCards);
        })
    };
    self.checkCardsBeginBuff = function (sortArray) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let queue = new Queue();
            sortArray.forEach((item) => {
                queue.queued(item.Effect_RoundStartBuff, item)((ground1.role == item.role) ? ground2 : ground1);
            });
            queue.queued(resolve)();
        })
    };
    let startRoundBattle = function *() {
        let that = this;
        let i, isAuto, sortResult;
        sortResult = yield that.sortCardsSpeed();
        while ((sortResult.length > 0) && (!ground1.isWashout() && !ground2.isWashout())) {
            isAuto = yield that.NextStepMoudle();
            if (isAuto) {
                sortResult = yield that.sortCardsSpeed();
                AttackerCard = sortResult[0];
                AttackedCardArray = sortResult[0].getPriorityAttackedCard((ground1.role == sortResult[0].role) ? ground2 : ground1);
                yield that.startCardBattle();
            }
            sortResult = yield that.sortCardsSpeed();
        }
        if (ground1.isWashout() || ground2.isWashout()) {
            return true;
        } else {
            return false;
        }
    };
    self.startRoundBattle = function (argument) {
        return startRoundBattle.call(self, argument);
    };
    self.startCardBattle = function (argument) {
        let that = this;
        return new Promise(function (resolve, reject) {
            self.run(self.OnceBattleStep, () => {
                resolve();
            });
        })
    };
    self.OnceRoundCompleted = function (isGameOver) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (isGameOver) {
                if (ground1.isWashout() || ground2.isWashout()) {
                    ground1.isWashout() && that.GameOver(ground2, ground1) && resolve(true);
                    ground2.isWashout() && that.GameOver(ground1, ground2) && resolve(true);
                    return;
                }
            } else {
                if (ground1.isActionOver() && ground2.isActionOver()) {
                    ground1.RoundStart();
                    ground2.RoundStart();
                    resolve(false);
                }
            }
        })
    };
    self.checkCardsEndBuff = function (sortArray) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let queue = new Queue();
            sortArray.forEach((item) => {
                queue.queued(item.Effect_RoundEndBuff, item)((ground1.role == item.role) ? ground2 : ground1);
            });
            queue.queued(resolve)();
        })
    };
    self.nextRound = function () {
        Round++;
        comment.addComment("Round", "Round" + Round);
    };
    self.GameOver = function (ground1, ground2) {
        comment.addComment("GameOver", ground1, ground2);
        return true;
    };
    self.NextStepMoudle = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            let thing = function () {
                resolve(true);
            }
            removeListener(document.getElementById("test"), 'mousedown', thing);
            addListener(document.getElementById("test"), 'mousedown', thing);
            self.off("ManualTransmission");
            self.on("ManualTransmission", function () {
                resolve(false);
            });
        })
    };
    return self;
}

function addListener(target, name, listener) {
    target.addEventListener(name, listener)
}
function removeListener(target, name, listener) {
    target.removeEventListener(name, listener)
}