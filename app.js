/*
GAME RULES:

Single Dice
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

Double dice
- Add one extra dice for two
- If both dice are rolled as 1's, reset the players total score to zero also

*/


//////////////////////////////////////////////////
// Single form of dice
//
// Holds values, calls to manipulate the dom 
//
class TheDie {
  constructor(die = 1, sides = 6, imageName = 'dice-') {
    this.dieID = die;   // ID
    this.sides = sides;
    this.imageName = imageName;
    this.rollResult = this.rollValue();
  }
  // Combine random value & displaying image that matches
  rollDie(){
    this.rollResult = this.rollValue();
    this.displayDie();
  }

  /////// Note: this really belong in another class

  // Random value for the dice assigned to object
  rollValue() {
    return Math.floor(Math.random() * this.sides) + 1; 
  }
  displayDie() {
    // Display result of roll on screen
    var dieDOM = document.querySelector('.' + this.imageName + this.dieID);
    dieDOM.style.display = 'block';
    dieDOM.src = this.imageName + this.rollResult + '.png';
  }
  hideDie() {
    document.querySelector('.' + this.imageName + this.dieID).style.display = 'none';
  }
}


////////////////
//  Dice(plural)
//
//  Composes individual die
//
class TheDice {
  constructor(howMany){
    this.dice = [];
    this.addDice(howMany);
  }
  addDice(number = 1) {
    for(var i = 0; i < number; i++){
      this.dice.push(new TheDie(this.dice.length + 1));
    }
  }
  diceTotal(){
    // value of all 
    return this.dice.reduce(function (a, b) { return a + b.rollResult}, 0);
  }
  countValues (target){
    // return count of all objects in dice array that have value matching target
    return this.dice.filter(function(die){ return die.rollResult === target }).length;
  }
  allSame (el){
    return this.dice.every(die => die == el);
  }
  rollDice (){
    this.dice.forEach(element => element.rollDie());
  }
  hideDice () {
    this.dice.forEach(aDie => aDie.hideDie());
  }
}

class Player {
  constructor(id = 0, score = 0){
    this.id = id;
    this.score = score;
    this.name = "Player " + this.id;
  }
  proccessScore(roundScore){
    this.updatePlayerScore((roundScore + this.score));
  }
  updatePlayerScore(score){
    this.score = score;
  }
}

class Players {
  constructor(numPlayers = 2){
    this.players = [];
    this.addPlayer(numPlayers);
    this.activePlayer = this.players[0];
    this.previousPlayer;
  }
  addPlayer(howMany = 1){
    for(var i = 0; i < howMany; i++){
      this.players.push(new Player(this.players.length));
    }
  }
  nextPlayer(player = this.activePlayer, players = this.players){
    console.log('------------')
    console.log('Next Player ')
    console.log(this.previousPlayer)
    this.previousPlayer = this.activePlayer;
    console.log(this.previousPlayer)
    var order;


    var determineOrder = function(){
        // Check we aren't at the order end, offset by one since array starts at 0
        // replace this ordinal style with array holding any other order desired
        if (player.id < players.length - 1){
          // increment by one if not at end for squential order
          order = (player.id) + 1;
        } else{
          order = 0;
        }
      return order;
    }    
    this.activePlayer = this.players[determineOrder()];
  }
}

class WinCondition {
  constructor(winValue = 50, inputName = "win-condition"){
    this.winValue = winValue;
    this.inputName = inputName;
    this.winDOM; // can't set to dom object till full load?
    this.setListener('blur');
  }
  setWinCondition(targetDom = "win-condition"){
    this.winValue = document.getElementById("win-condition").value;
  }
  // As separate function so we can link to it for "pressing enter" or other times when blur isn't working
  setListener(actionType = 'blur', target = "win-condition"){
    document.getElementById(target).addEventListener(actionType, this.setWinCondition);
  }
  checkWin(player = players.activePlayer, victory = this.winValue){
    return player.score >= victory;
  }
}

//////////////////
//
//  Scoreboard
//
//  Should handle displaying status for scores
//
class ScoreBoard {
  constructor(win = new WinCondition){
    this.roundScore = 0;
    this.victory = win;
  }
  displayPlayerScore(player = players.player){
    document.querySelector('#score-' + player.id).textContent = player.score;
  }
  updateActivePlayer(current = players.activePlayer, next = players.previousPlayer){
    toggleActiveStatus(current);
    toggleActiveStatus(next);
  }

}

var scores, roundScore;
var dice = new TheDice(2);
var scoreboard = new ScoreBoard();
var players = new Players();

init();


//////////////////////////
// Rules implementation //
//////////////////////////

// Roll method being attached to button
// example of anonymous function, one without name
document.querySelector('.btn-roll').addEventListener('click', function(){

  // if active game
  if(gamePlaying){

    // roll dice
    dice.rollDice();

    // update the round score IF rolled number was NOT a 1
    // A single one 
    if (dice.countValues(1) > 0){ 

      // Two ones
      if (dice.countValues(1) > 1){
        // players.activePlayer.updateScore(0);
      }

      // next player - as a 1 means end of turn
      // players.nextPlayer();

    } else {
      // add score
      roundScore += dice.diceTotal();

      document.querySelector('#current-' + players.activePlayer.id).textContent = roundScore;
    }

  }
});

// Hold method
document.querySelector('.btn-hold').addEventListener('click', function(){
  if(gamePlaying){
    // console.log('holding')
    console.log(players.activePlayer)
    // players.active.proccessScore(roundScore);
    // check if game is won
    if(scoreboard.victory.checkWin()){
      document.querySelector('#name-' + players.activePlayer.id).textContent = 'Winner';
      dice.hideDice();
      document.querySelector('.player-' + players.activePlayer.id + '-panel').classList.add('winner');
      document.querySelector('.player-' + players.activePlayer.id + '-panel').classList.remove('active');
      gamePlaying = false;
    } else {
      // next player
      nextTurn(dice);
    }
  }
});



function nextTurn(){
  // Process - 
    // call save current player to previous
    // call for new activeplayer
    // change display ...
      // to reflect current player toggling off & new active on in css
      // zero round score
      // html zero out current round scores
      // hide/fade out dice

  roundScore = 0;

  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';

  // can't toggle or we need to current / next player toggle via array in players
  // careful to random
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');

  // next player now that board is updated
  players.nextPlayer();
  dice.hideDice();
}

// Start a new game
document.querySelector('.btn-new').addEventListener('click', init);

function init(){
  // initialize game values
  scores = [0,0];
  // activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;

  // set winning total
  document.getElementById('win-condition').value = scoreboard.victory.winValue;

  dice.hideDice();

  // zero displays of scores & dice rolls
  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';

  // names
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  // fire proofing winner & active player from state bugs
  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
}

