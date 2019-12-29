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


  // Hide die image
  hideDie() {
    document.querySelector('.' + this.imageName + this.dieID).style.display = 'none';
  }
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
    this.dice.push(new TheDie(this.dice.length + 1));
  }
}

TheDice.prototype.diceTotal = function (){
  // value of all 
  return this.dice.reduce(function (a, b) { return a + b.rollResult}, 0);
}

TheDice.prototype.countValues = function (target){
  // return count of all objects in dice array that have value matching target
  return this.dice.filter(function(die){ return die.rollResult === target }).length;
}

TheDice.prototype.allSame = function (el){
  return this.dice.every(die => die == el);
}

TheDice.prototype.rollDice = function (){
  this.dice.forEach(element => element.rollDie());
}

TheDice.prototype.hideDice = function() {
  this.dice.forEach(aDie => aDie.hideDie());
}


var scores, roundScore, activePlayer, winCondition = 100;
var dice = new TheDice();
dice.addDice(2);
dice.hideDice();

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
        setPlayerScore(0);
      }

      // next player - as a 1 means end of turn
      nextPlayer();

    } else {
      // add score
      roundScore += dice.diceTotal();
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
      dice.hideDice();
      document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
      document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      gamePlaying = false;
    } else {
      // next player
      nextPlayer(dice);
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

  dice.hideDice();
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
