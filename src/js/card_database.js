import Tatsumaki from './Cards/RankS/Tatsumaki.js'
import ChogokinKurobikari from './Cards/RankS/ChogokinKurobikari.js'
import Bang from './Cards/RankS/Bang.js'
import Flash from './Cards/RankS/Flash.js'
import AtomicZamurai from './Cards/RankS/AtomicZamurai.js'
import King from './Cards/RankS/King.js'
import Blast from './Cards/RankS/Blast.js'
import Bump from './Cards/RankS/Bump.js'

import Genos from './Cards/RankA/Genos.js'
import ZombieMan from './Cards/RankA/ZombieMan.js'
import AmaiMask from './Cards/RankA/AmaiMask.js'
import BankenMan from './Cards/RankA/BankenMan.js'
import KinzokuBat from './Cards/RankA/KinzokuBat.js'
import MetalKnight from './Cards/RankA/MetalKnight.js'
import Sonic from './Cards/RankA/Sonic.js'
import DanganTenshi from './Cards/RankA/DanganTenshi.js'

import TankTopMaster from './Cards/RankB/TankTopMaster.js'
import PuripuriPrisoner from './Cards/RankB/PuripuriPrisoner.js'
import Dotei from './Cards/RankB/Dotei.js'
import Butagami from './Cards/RankB/Butagami.js'
import Iaian from './Cards/RankB/Iaian.js'
import Fubuki from './Cards/RankB/Fubuki.js'
import KudohKishi from './Cards/RankB/KudohKishi.js'
import Genus from './Cards/RankB/Genus.js'

import RaikoGenji from './Cards/RankC/RaikoGenji.js'
import DeathGatlin from './Cards/RankC/DeathGatlin.js'
import Banehige from './Cards/RankC/Banehige.js'
import Inazumax from './Cards/RankC/Inazumax.js'
import Stinger from './Cards/RankC/Stinger.js'
import Okamaitachi from './Cards/RankC/Okamaitachi.js'
import BushiDrill from './Cards/RankC/BushiDrill.js'
import BlueFire from './Cards/RankC/BlueFire.js'
import BestPredictor from './Cards/RankC/BestPredictor.js'
import JusenshaFundoshi from './Cards/RankC/JusenshaFundoshi.js'
import TejinaMan from './Cards/RankC/TejinaMan.js'
import SmileMan from './Cards/RankC/SmileMan.js'

import Snack from './Cards/RankD/Snack.js'
import MumenRider from './Cards/RankD/MumenRider.js'
import OgonBall from './Cards/RankD/OgonBall.js'
import TankTopBlackhole from './Cards/RankD/TankTopBlackhole.js'
import DarknessBlade from './Cards/RankD/DarknessBlade.js'
import JujikeyAndMofuku from './Cards/RankD/JujikeyAndMofuku.js'
import GroundOfSnow from './Cards/RankD/GroundOfSnow.js'
import LittleGirl from './Cards/RankD/LittleGirl.js'
import TeaBoy from './Cards/RankD/TeaBoy.js'
import Forte from './Cards/RankD/Forte.js'
import TankTopTiger from './Cards/RankD/TankTopTiger.js'
import HammerHead from './Cards/RankD/HammerHead.js'
import MonkeyAndEyelash from './Cards/RankD/MonkeyAndEyelash.js'
import Lily from './Cards/RankD/Lily.js'

import SaitamaCitizen from './Cards/Saitama/SaitamaCitizen.js'
import SaitamaHero from './Cards/Saitama/SaitamaHero.js'
import SaitamaMax from './Cards/Saitama/SaitamaMax.js'
import SaitamaNightmare from './Cards/Saitama/SaitamaNightmare.js'
import SaitamaRookie from './Cards/Saitama/SaitamaRookie.js'
import SaitamaSensei from './Cards/Saitama/SaitamaSensei.js'
import SaitamaTheBurst from './Cards/Saitama/SaitamaTheBurst.js'

import LordBoros from './Cards/BOSS/LordBoros.js'
import LordBorosEx from './Cards/BOSS/LordBorosEx.js'
import GiantMeteor from './Cards/BOSS/GiantMeteor.js'
import Garou from './Cards/BOSS/Garou.js'
import KingOfStray from './Cards/BOSS/KingOfStray.js'
import BossOfVillain from './Cards/BOSS/BossOfVillain.js'


const CardRankS = {
  cards:[
     {class_: Tatsumaki,      id:"S1", name:"战栗龙卷", rank:"S", hp:9, spd:4, att:7, def:5, skill:"超念流风暴", effect:"第一回合准备阶段触发，本卡片攻击范围全场攻击"}
    ,{class_: ChogokinKurobikari, id:"S2", name:"超合金黑光", rank:"S", hp:10, spd:3, att:8, def:5, skill:" 超合金火箭头槌", effect:"本卡片体力小于等于5时触发，本卡片攻击减3"}
    ,{class_: Bang,   id:"S3", name:"银色獠牙 邦古", rank:"S", hp:8, spd:5, att:4, def:7, skill:"流水岩碎拳", effect:"本卡片受到攻击后触发，对攻击来源卡片进行一次反击"}
    ,{class_: Flash, id:"S4", name:"闪光弗莱什", rank:"S", hp:9, spd:5, att:4, def:4, skill:"闪光流影", effect:"本卡片的行动轮次可以触发，把这次行动机会转让给本卡片的组合搭档"}
    ,{class_: AtomicZamurai,    id:"S5", name:"原子武士", rank:"S", hp:9, spd:4, att:9, def:3, skill:"原子能流 纳米微尘斩", effect:""}
    ,{class_: King, id:"S6", name:"世上最强生物 KING", rank:"S", hp:6, spd:1, att:1, def:1, skill:"炼狱无双爆热波动炮！", effect:"第一回合准备阶段触发，对方卡片攻击力全部变成0，第一回合结束阶段对方卡片攻击力恢复"}
    ,{class_: Blast, id:"S7", name:"深藏云雾中的男人 爆破", rank:"S", hp:10, spd:5, att:5, def:5, skill:"令人绝望的震慑", effect:""}
    ,{class_: Bump, id:"S8", name:"武术大师 邦普", rank:"S", hp:8, spd:5, att:6, def:5, skill:"疾风斩铁拳", effect:"和邦古组合搭档时触发，本两张卡片攻击加2"}
  ]
};

const CardRankA = {
  cards:[
     {class_: Genos,      id:"A1", name:"鬼之改造人 杰诺斯", rank:"A", hp:7, spd:4, att:7, def:3, skill:"最大威力燃烧炮", effect:"本卡片退场时触发，对造成本卡片退场的卡片进行一次反击"}
    ,{class_: ZombieMan, id:"A2", name:"僵尸男", rank:"A", hp:10, spd:2, att:4, def:5, skill:" 不死之躯", effect:"每回合结束本卡片体力小于等于9时触发，本卡片体力加2"}
    ,{class_: AmaiMask,   id:"A3", name:"甜心假面", rank:"A", hp:8, spd:4, att:6, def:4, skill:"恶尽斩", effect:"本卡片的行动轮次可以触发，本卡片攻击减2，本回合本卡片攻击范围变成全场攻击，回合结束时攻击数值恢复"}
    ,{class_: BankenMan, id:"A4", name:"警犬侠", rank:"A", hp:8, spd:3, att:3, def:6, skill:"忠犬的守护", effect:"第一回合准备阶段触发，组合搭档体力加1、防御加1"}
    ,{class_: KinzokuBat,    id:"A5", name:"金属球棒", rank:"A", hp:8, spd:3, att:7, def:3, skill:"荒野球棒龙卷风", effect:"受到伤害时触发，本卡片攻击加1"}
    ,{class_: MetalKnight, id:"A6", name:"金属骑士 波弗伊", rank:"A", hp:7, spd:2, att:6, def:5, skill:"导弹流星群！", effect:"第一回合准备阶段触发，本卡片攻击范围横排攻"}
    ,{class_: Sonic, id:"A7", name:"音速的索尼克", rank:"A", hp:8, spd:5, att:5, def:2, skill:"奥义 十影葬", effect:"第一回合准备阶段触发，本卡片攻击范围横排攻击"}
    ,{class_: DanganTenshi, id:"A8", name:"弹丸天使", rank:"A", hp:8, spd:4, att:6, def:3, skill:"零距离光束炮", effect:"第一回合准备阶段触发，本卡片攻击范围纵列攻击"}
  ]
};

const CardRankB = {
  cards:[
    {class_:  TankTopMaster,      id:"B1", name:"背心尊者", rank:"B", hp:8, spd:2, att:6, def:4, skill:"背心擒抱", effect:"本卡片发动攻击时触发，本卡片体力减1，被攻击的卡片体力减1"}
    ,{class_: PuripuriPrisoner, id:"B2", name:"性感囚犯", rank:"B", hp:7, spd:2, att:6, def:4, skill:" 天使冲击", effect:"第一回合后的每次准备阶段触发，本卡片防御减1，受到本卡片攻击的卡片速度减1"}
    ,{class_: Dotei,   id:"B3", name:"天才儿童 童帝", rank:"B", hp:7, spd:4, att:3, def:3, skill:"王道攻略法", effect:"第一回合准备阶段触发，组合搭档攻击加1、防御加1、速度加1"}
    ,{class_: Butagami, id:"B4", name:"猪神", rank:"B", hp:7, spd:1, att:5, def:3, skill:"无良吞食", effect:"本卡片攻击造成对方卡片退场时触发，本卡片体力加2"}
    ,{class_: Iaian,    id:"S5", name:"居合钢", rank:"B", hp:7, spd:3, att:5, def:2, skill:"必杀居合斩", effect:"每回合准备阶段触发，本卡片行动顺序排到第一位。出现复数居合钢卡片时，先进行随机数运算"}
    ,{class_: Fubuki, id:"B6", name:"地狱吹雪", rank:"B", hp:7, spd:2, att:3, def:5, skill:"念流回转盾", effect:"本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半"}
    ,{class_: KudohKishi, id:"B7", name:"驱动骑士", rank:"B", hp:7, spd:3, att:3, def:3, skill:"战术变型·银", effect:"组合搭档退场时触发，组合搭档以体力2的状态回到场上"}
    ,{class_: Genus, id:"B8", name:"进化之家 吉纳斯博士", rank:"B", hp:4, spd:1, att:1, def:4, skill:"克隆技术", effect:"本卡片首次退场时触发，本卡片体力加2"}
  ]
};

const CardRankC = {
  cards:[
     {class_: RaikoGenji,      id:"C1", name:"雷光源氏", rank:"C", hp:6, spd:4, att:2, def:2, skill:"电极二刀流", effect:"本卡片攻击时可以触发，被攻击的卡片速度减2"}
    ,{class_: DeathGatlin, id:"C2", name:"死亡加特林", rank:"C", hp:6, spd:2, att:4, def:2, skill:"加特林扫射", effect:"第一回合准备阶段触发，本卡片攻击范围横排攻击"}
    ,{class_: Banehige,   id:"C3", name:"弹簧胡子", rank:"C", hp:6, spd:3, att:2, def:4, skill:"踏无暴威", effect:"本卡片体力等于1时触发，本卡片攻击变成4，防御变成2"}
    ,{class_: Inazumax, id:"C4", name:"闪电麦克斯", rank:"C", hp:5, spd:4, att:5, def:1, skill:"闪电喷气式回旋飞踢", effect:""}
    ,{class_: Stinger,    id:"C5", name:"毒刺小子", rank:"C", hp:6, spd:3, att:2, def:2, skill:"超巨型螺旋毒刺", effect:"第一回合准备阶段触发，本卡片攻击范围纵列攻击"}
    ,{class_: Okamaitachi, id:"C6", name:"禁断恋爱之太刀 镰鼬", rank:"C", hp:6, spd:3, att:4, def:1, skill:"镰鼬真空斩", effect:"第一回合准备阶段触发，本卡片攻击范围远程攻击"}
    ,{class_: BushiDrill, id:"C7", name:"钻头武士", rank:"C", hp:6, spd:2, att:4, def:2, skill:"钻头是我的灵魂啊!", effect:"我的钻头可是能突破天际的啊"}
    ,{class_: BlueFire, id:"C8", name:"青炎", rank:"C", hp:6, spd:2, att:3, def:2, skill:"大火葬", effect:"本卡片的战斗伤害阶段触发，被攻击的卡片体力减1"}
    ,{class_: BestPredictor, id:"C9", name:"大预言家 皱婆婆", rank:"C", hp:5, spd:1, att:1, def:2, skill:"先知的大预言", effect:"第一回合准备阶段触发，本卡片的组合搭档本回合额外进行一次攻击"}
    ,{class_: JusenshaFundoshi, id:"C10", name:"重战车兜裆布", rank:"C", hp:6, spd:1, att:4, def:2, skill:"战车炮冲拳", effect:"组合搭档退场时触发，对攻击来源卡片进行一次反击"}
    ,{class_: TejinaMan, id:"C11", name:"魔术妙手", rank:"C", hp:6, spd:2, att:2, def:2, skill:"魔幻烟雾", effect:"每回合本卡片受到第一次攻击时触发，这次攻击造成的伤害变成0"}
    ,{class_: SmileMan, id:"C12", name:"微笑超人", rank:"C", hp:5, spd:2, att:3, def:3, skill:"剑玉连携攻击", effect:"组合搭档攻击、防御或速度数值下降时触发，下降的数值恢复"}
  ]
};

const CardRankD = {
  cards:[
     {class_: Snack,      id:"D1", name:"蛇咬拳 斯内克", rank:"D", hp:5, spd:3, att:3, def:1, skill:"蛇形拳", effect:"本卡片体力等于1时触发，本回合本卡片不能进行攻击"}
    ,{class_: MumenRider, id:"D2", name:"无证骑士", rank:"D", hp:4, spd:2, att:1, def:1, skill:"正义咆哮", effect:"本卡片退场时触发，如果存在组合搭档，组合搭档体力加3，如果组合搭档已退场，组合搭档以体力3的状态回到场上"}
    ,{class_: OgonBall,   id:"D3", name:"黄金球", rank:"D", hp:4, spd:1, att:4, def:1, skill:"形状记忆金弹", effect:"第一回合准备阶段触发，本卡片攻击范围横排攻击"}
    ,{class_: TankTopBlackhole, id:"D4", name:"背心黑洞", rank:"D", hp:6, spd:2, att:4, def:1, skill:"200公斤握力", effect:"本卡片发动攻击时触发，本卡片体力减1，被攻击的卡片体力减1"}
    ,{class_: DarknessBlade,    id:"D5", name:"黑暗炎龙刀使", rank:"D", hp:3, spd:1, att:1, def:2, skill:"不知何处得来的自信", effect:"本卡片攻击的伤害阶段可以触发，被攻击的卡片防御减2"}
    ,{class_: JujikeyAndMofuku, id:"D6", name:"十字键与丧服吊带", rank:"D", hp:4, spd:1, att:1, def:3, skill:"吊带回转风暴", effect:""}
    ,{class_: GroundOfSnow, id:"D7", name:"最大英雄组织 吹雪组", rank:"D", hp:4, spd:1, att:2, def:1, skill:"以多胜少的实力", effect:"组合搭档时地狱吹雪时触发，搭档攻击加1"}
    ,{class_: LittleGirl, id:"D8", name:"小小萝莉", rank:"D", hp:4, spd:1, att:1, def:1, skill:"泪汪汪攻势", effect:"退场且存在搭档时触发，搭档本回合攻击加2"}
    ,{class_: TeaBoy, id:"D9", name:"首席弟子 茶岚子", rank:"D", hp:5, spd:1, att:2, def:1, skill:"水球碳酸拳", effect:""}
    ,{class_: Forte, id:"D10", name:"节奏英雄福特", rank:"D", hp:6, spd:3, att:1, def:1, skill:"跟上我的节奏", effect:"第一回合准备阶段触发，组合搭档速度加1"}
    ,{class_: TankTopTiger, id:"D11", name:"背心老虎", rank:"D", hp:5, spd:1, att:2, def:1, skill:"猛虎下山拳", effect:""}
    ,{class_: HammerHead, id:"D12", name:"钉头锤", rank:"D", hp:4, spd:1, att:2, def:2, skill:"车轮攻击", effect:"第一回合本卡片体力小于1时触发，本卡片体力变成1"}
    ,{class_: MonkeyAndEyelash, id:"D13", name:"山猿和睫毛", rank:"D", hp:5, spd:2, att:2, def:1, skill:"美容修理组合拳", effect:"组合搭档为地狱吹雪时触发，本卡攻击力加1"}
    ,{class_: Lily, id:"D14", name:"三节棍的莉莉", rank:"D", hp:4, spd:3, att:2, def:1, skill:"漆黑色的三连星", effect:""}
    ,{class_: SaitamaCitizen,   id:"D15", name:"无业游民 琦玉", rank:"D", hp:5, spd:1, att:2, def:2, skill:"三年的地狱式磨练", effect:"第三回合准备简单触发，本卡片退场，随机选取其他琦玉卡片替换到本卡片的位置"}
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

const CardBOSS = {
  cards:[
    {class_:  LordBoros, id:"BOSS1", name:"宇宙霸者 波罗斯", rank:"S", hp:9, spd:5, att:7, def:8, skill:"流星爆发", effect:"每次回合结束阶段触发，本卡片体力加3"}
    ,{class_: LordBorosEx, id:"BOSS2", name:"波罗斯 流星爆发模式", rank:"S", hp:7, spd:6, att:10, def:7, skill:"崩星咆哮炮", effect:"第一回合准备阶段触发，本卡片攻击范围全场攻击。每次回合结束时触发，本卡片体力减1"}
    ,{class_: GiantMeteor, id:"BOSS3", name:"巨大陨石", rank:"S", hp:10, spd:1, att:0, def:3, skill:"究极的毁灭阴影", effect:"第一回合结束阶段触发，本卡片的操纵方玩家直接获得胜利"}
    ,{class_: Garou, id:"BOSS4", name:"英雄狩猎者 饿狼", rank:"A", hp:9, spd:4, att:6, def:5, skill:"怪害神杀拳", effect:"本卡片受到攻击后触发，对攻击来源卡片进行一次反击。每次回合结束阶段触发，本卡片攻击加1、防御加1、速度加1"}
    ,{class_: KingOfStray, id:"BOSS5", name:"流浪帝 长谷川", rank:"S", hp:9, spd:2, att:1, def:2, skill:"神力的即死攻击", effect:"本卡片的战斗伤害阶段触发，被攻击的卡片体力减半"}
    ,{class_: BossOfVillain, id:"BOSS6", name:"怪人协会首领 赛伊克斯", rank:"S", hp:9, spd:4, att:6, def:4, skill:"超重力念波", effect:"第一回合准备阶段触发，本卡片攻击范围横排攻击。本卡片受到范围攻击时触发，本次攻击造成的伤害数值减半"}
  ]
};



const card_database = {
  cards : Array.prototype.concat.apply([],[CardRankS.cards, CardRankA.cards, CardRankB.cards, CardRankC.cards, CardRankD.cards, CardBOSS.cards])
};

window.card_database = card_database;

export {CardRankS, CardRankA, CardRankB, CardRankC, CardRankD, CardSaitama, CardBOSS, card_database}