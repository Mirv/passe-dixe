import {TheDice} from 'dice.js';
console.log(TheDie)

/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, winCondition = 100;
var dice;

function TheDie(die, sides = 6, imageName = 'dice-') {
  this.die = die;   // ID
  this.sides = sides;
  this.imageName = imageName;
  this.value = this.rollValue();
}

// Combine random value & displaying image that matches
TheDie.prototype.rollDie = function(){
  this.value = this.rollValue();
  this.displayDie();
}

// Random value for the dice assigned to object
TheDie.prototype.rollValue = function() {
  return Math.floor(Math.random() * this.sides) + 1; 
}

// Display result of roll on screen
TheDie.prototype.displayDie = function() {
  var dieDOM = document.querySelector('.' + this.imageName + this.die);
  dieDOM.style.display = 'block';
  dieDOM.src = this.imageName + this.value + '.png';
}

// Hide die image
TheDie.prototype.hideDice = function() {
  document.querySelector('.' + this.imageName + this.die).style.display = 'none';
}

////////////////
//  Dice(plural)
//
//  Composes individual die

function TheDice(){
  this.dice = [];
}

TheDice.prototype.addDice = function (number = 1){
  for(var i = 1; i <= number; i++){
    this.dice.push(new TheDie(this.dice.length));
  }
}

TheDice.prototype.diceTotal = function (){
  return this.dice.reduce(function (a, b) { return a + b.value}, 0);
}

init();

//////////////////////////
// Rules implementation //
//////////////////////////

// Roll method being attached to button
// example of anonymous function, one without name
document.querySelector('.btn-roll').addEventListener('click', function(){

  if(gamePlaying){

    // Need to make dice proto or array to call / hold these
    var dice = new TheDice();
    dice.addDice(2);
    console.log(dice.diceTotal());

    // Check all the rules are followed
    //
    // Create array of rules
    // Order dependent?
    //
    //
    // 3. update the round score IF rolled number was NOT a 1
    
    if (dice.dice.includes(1)){
      var allOnes = dice.dice.every(die => die == 1);
      if (allOnes){
        // double 1's should clear round and entire score for that game
        setPlayerScore(0);
      }
      // next player
      nextPlayer();
    } else {
      // add score
      // roundScore += dice1 + dice2;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
    }

  }
});

// Hold method
document.querySelector('.btn-hold').addEventListener('click', function(){
  if(gamePlaying){
    setPlayerScore(scores[activePlayer] + roundScore);

    // check if game is won
    if(scores[activePlayer] >= winCondition){
      document.querySelector('#name-' + activePlayer).textContent = 'Winner';
      hideDice();
      document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
      document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      gamePlaying = false;
    } else {
      // next player
      nextPlayer();
    }
  }
});

function setPlayerScore(gameScore){
  scores[activePlayer] = gameScore;
  document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
}

// Set win condition number other than 100
document.querySelector('#win-condition').addEventListener('blur', setWinCondition);

// As separate function so we can link to it for "pressing enter" or other times when blur isn't working
function setWinCondition(){
    winCondition = document.getElementById("win-condition").value;
}

function nextPlayer(){
  // next player
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  roundScore = 0;

  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';

  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');

  // hideDice();
}

// Start a new game
document.querySelector('.btn-new').addEventListener('click', init);

function init(){
  // initialize game values
  scores = [0,0];
  activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;

  // set winning total
  document.getElementById('win-condition').value = winCondition;

  // hideDice();

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
