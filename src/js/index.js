import {createElement, newElement} from './tool.js'
import Player from './Module/Player.js'
import Card from './Module/MainCard.js'
import HalfGround from './Module/HalfGround.js'
import Round from './Module/Round.js'
import SelectCard from './Module/SelectCard.js'

let $live = document.getElementById('live')
let $Ground1 = createElement("div");
let $Ground2 = createElement("div");
$Ground1.classList.add('HalfGround');
$Ground2.classList.add('HalfGround');
$live.appendChild($Ground1);
$live.appendChild($Ground2);


let selectItems = document.getElementById('grid')
SelectCard(selectItems, (Player1_Cards, deck)=>{
  let GameContainer = document.getElementById('GameContainer');
  GameContainer.classList.add("show");

  let Player1 = new Player("Player1");
  let Ground1 = new HalfGround();
  let Player2 = new Player("Player2");
  let Player2_Cards = {FL: "D1", FR: "D2", BL: "D3", BR: "D4"};
  let Ground2 = new HalfGround();

  let round = Round(Ground1, Ground2);
  Ground1.initRound(round);
  Ground2.initRound(round);
  Ground1.init({$el: $Ground2, Player: Player1, role: "host", cards: Player1_Cards, deck: deck});
  Ground2.init({$el: $Ground1, Player: Player2, role: "guest", cards: Player2_Cards, deck: deck});

  window.G1 = Ground1;
  window.G2 = Ground2;

  round.run(round.OnceRoundStep);
});