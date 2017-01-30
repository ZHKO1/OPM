import Card from '../../Module/MainCard/index.js'
export default class Snack extends Card {
    Effect_RoundStartBuff(next) {
        let that = this;
        setTimeout(() => {
            if (that.hp == 1 && (that.status.ActionOver == false)) {
                that.comment.addComment("Effect", that, "本回合不能进行攻击");
                that.setActionOver();
                next();
            } else {
                next();
            }
        }, 300);
    }

    Effect_checkoutStatus(next) {
        this.Effect_RoundStartBuff(next);
    }
}
