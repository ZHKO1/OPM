import Card from '../../Module/MainCard/index.js'
export default class SaitamaSensei extends Card {
    Effect_RoundStartBuff(next, ground2) {
        let that = this;
        let card2 = null;
        if (that.Round.getRound() <= 1) {
            switch (that.position){
                case "FL":
                    card2 = that.Ground.CardMap["BL"];
                    break;
                case "FR":
                    card2 = that.Ground.CardMap["BR"];
                    break;
                case "BL":
                    card2 = that.Ground.CardMap["FL"];
                    break;
                case "BR":
                    card2 = that.Ground.CardMap["FR"];
                    break;
            }
            card2.$watch("spd", function(value, oldVal){
                if(value < oldVal){
                    that.comment.addComment("Effect", that, "组合搭档攻击防御速度下降时触发，下降的数值恢复");
                    card2.spd = oldVal
                }
            });
            card2.$watch("def", function(value, oldVal){
                if(value < oldVal){
                    that.comment.addComment("Effect", that, "组合搭档攻击防御速度下降时触发，下降的数值恢复");
                    card2.def = oldVal
                }
            });
            next();
        } else {
            next();
        }
    }
}
