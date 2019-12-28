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

export function TheDice(){
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