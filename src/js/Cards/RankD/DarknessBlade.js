import Card from '../../Module/MainCard/index.js'
export default class DarknessBlade extends Card {
    Effect_BattleAfter(AttackedCardArray, next) {
        let that = this;
        let AttackedCard = AttackedCardArray[0];
        setTimeout(() => {
            that.comment.addComment("Effect", that, "防御减2");
            AttackedCard.def = AttackedCard.def - 2;
            if (AttackedCard.def < 0) {
                AttackedCard.def = 0;
            }
            next();
        }, 300);
    }
}
