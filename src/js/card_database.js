import Snack from './Cards/RankD/Snack.js'
import MumenRider from './Cards/RankD/MumenRider.js'
import OgonBall from './Cards/RankD/OgonBall.js'
import TankTopBlackhole from './Cards/RankD/TankTopBlackhole.js'
import DarknessBlade from './Cards/RankD/DarknessBlade.js'
import JujikeyAndMofuku from './Cards/RankD/JujikeyAndMofuku.js'

import SaitamaCitizen from './Cards/Saitama/SaitamaCitizen.js'
import SaitamaHero from './Cards/Saitama/SaitamaHero.js'
import SaitamaMax from './Cards/Saitama/SaitamaMax.js'
import SaitamaNightmare from './Cards/Saitama/SaitamaNightmare.js'
import SaitamaRookie from './Cards/Saitama/SaitamaRookie.js'
import SaitamaSensei from './Cards/Saitama/SaitamaSensei.js'
import SaitamaTheBurst from './Cards/Saitama/SaitamaTheBurst.js'


const CardRankD = {
  cards:[
     {class_: Snack,      id:"D1", name:"蛇咬拳 斯内克", rank:"D", hp:5, spd:3, att:3, def:1, skill:"蛇形拳", effect:"本卡片体力等于1时触发，本回合本卡片不能进行攻击"}
    ,{class_: MumenRider, id:"D2", name:"无证骑士", rank:"D", hp:4, spd:2, att:1, def:1, skill:"正义咆哮", effect:"本卡片退场时触发，如果存在组合搭档，组合搭档体力加3，如果组合搭档已退场，组合搭档以体力3的状态回到场上"}
    ,{class_: OgonBall,   id:"D3", name:"黄金球", rank:"D", hp:4, spd:1, att:4, def:1, skill:"形状记忆金弹", effect:"第一回合准备阶段触发，本卡片攻击范围横排攻击"}
    ,{class_: TankTopBlackhole, id:"D4", name:"背心黑洞", rank:"D", hp:6, spd:2, att:4, def:1, skill:"200公斤握力", effect:"本卡片发动攻击时触发，本卡片体力减1，被攻击的卡片体力减1"}
    ,{class_: DarknessBlade,    id:"D5", name:"黑暗炎龙使者", rank:"D", hp:3, spd:1, att:1, def:2, skill:"不知何处得来的自信", effect:"本卡片攻击的伤害阶段可以触发，被攻击的卡片防御减2"}
    ,{class_: JujikeyAndMofuku, id:"D6", name:"十字键与丧服吊带", rank:"D", hp:4, spd:1, att:1, def:3, skill:"吊带回转风暴", effect:""}
    ,{class_: SaitamaCitizen,   id:"D7", name:"无业游民 琦玉", rank:"D", hp:5, spd:1, att:2, def:2, skill:"三年的地狱式磨练", effect:"第三回合准备简单触发，本卡片退场，随机选取其他琦玉卡片替换到本卡片的位置"}
  ]
};
const CardSaitama = {
  cards:[
     {class_: SaitamaHero, id:"Saitama1", name:"英雄琦玉", rank:"S", hp:9, spd:6, att:8, def:6, skill:"连续普通拳", effect:"本卡片行动的伤害计算阶段可以触发，这次伤害数值翻倍"}
    ,{class_: SaitamaTheBurst, id:"Saitama2", name:"超爆发! 秃头琦玉之觉醒", rank:"S", hp:3, spd:10, att:100, def:2, skill:"超市特卖觉醒拳", effect:"本卡片行动结束时可以触发，本卡片退场"}
    ,{class_: SaitamaNightmare, id:"Saitama3", name:"睡梦修罗 琦玉", rank:"A", hp:6, spd:5, att:6, def:8, skill:"地球有我来守护!", effect:"每回合结束阶段触发，本卡片攻击减2，防御减2"}
    ,{class_: SaitamaRookie, id:"Saitama4", name:"菜鸟 琦玉", rank:"A", hp:8, spd:1, att:8, def:5, skill:"白菜都被消灭完了", effect:"每回合准备阶段触发，本卡片行动顺序变为最后一位"}
    ,{class_: SaitamaSensei, id:"Saitama5", name:"琦玉 老师", rank:"S", hp:9, spd:5, att:3, def:4, skill:"随便才是上策", effect:"组合搭档攻击防御速度下降时触发，下降的数值恢复"}
    ,{class_: SaitamaMax, id:"Saitama6", name:"英雄琦玉 认真模式", rank:"S", hp:9, spd:1, att:1000, def:1000, skill:"必杀 认真殴打", effect:""}
  ]
};


const card_database = {
  cards : Array.prototype.concat.apply([],[CardRankD.cards/*, CardSaitama.cards*/])
};

window.card_database = card_database;

export {CardRankD, CardSaitama, card_database}