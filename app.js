/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, winCondition = 100;

init();

// Roll method being attached to button
// example of anonymous function, one without name
document.querySelector('.btn-roll').addEventListener('click', function(){

  if(gamePlaying){

    //  1. dice values
    var dice1 = rollDie();
    var dice2 = rollDie();

    doDie(1, dice1); 
    doDie(2, dice2);

    function rollDie(){
      return Math.floor(Math.random() * 6) + 1; 
    }

    function doDie(theDie, dice){

      // Select which dice will be changed
      var diceDom = document.querySelector('.dice-' + theDie);

      diceDom.style.display = 'block';
      
      // Select photo representing the number rolled
      diceDom.src = 'dice-' + dice + '.png';
    } 

    // 3. update the round score IF rolled number was NOT a 1
    if (dice1 == 1 || dice2 == 1){
      // next player
      nextPlayer();
    } else {
      // add score
      roundScore += dice1 + dice2
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
    }

  }
});

// Hold method
document.querySelector('.btn-hold').addEventListener('click', function(){
  if(gamePlaying){
    // add current score to global score
    scores[activePlayer] += roundScore;

    // update UI 
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

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

// Set win condition number other than 100
document.querySelector('#win-condition').addEventListener('blur', setWinCondition);

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

  hideDice();
}

document.querySelector('.btn-new').addEventListener('click', init);

function hideDice(){
    // hide dice 
  document.querySelector('.dice-1').style.display = 'none';
  document.querySelector('.dice-2').style.display = 'none';
}

function init(){
  // initialize game values
  scores = [0,0];
  activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;

  // set winning total
  document.getElementById('win-condition').value = winCondition;

  hideDice();

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

// document.querySelector('#current-' + activePlayer).textContent = dice;
// document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
// document.querySelector('.dice').style.display = 'none';


// Example of callback function

// function btn(){
//   // do something
// }
// btn();

// this btn is a callback function - one called by system or event listener so we drop () at end
// document.querySelector('.btn-roll').addEventListener('click', btn);