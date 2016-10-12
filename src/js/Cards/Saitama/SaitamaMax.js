import Card from '../../Module/MainCard.js'
export default class SaitamaMax extends Card {
  Effect_RoundStartBuff(next){
    let that = this;
    setTimeout(()=>{
      that.comment.addComment("Effect",that,"防御减2");
      next();
    },300);
  }
}
