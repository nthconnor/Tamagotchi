/* 
- create a class to hold game/pet information and methods
- create functional buttons to control feed/play/lights
- create multiple values for hunger/boredom/sleepiness/level
- create a clock (hh:mm) where minutes pass in seconds
- have our pet values change with time
    - pet can evolve at level 5
- ???
*/
const hungerText = document.getElementById("hungerText");
const sleepyText = document.getElementById("sleepyText");
const boredomText = document.getElementById("boredomText");
const nameTxt = document.getElementById("name");
const begin = document.getElementById("begin");
const nameInput = document.getElementById("username");
let minutes = 0;
let seconds = 0;
// nameTxt.innerText = nameInput;
begin.onclick = startGame;

// Create a pet class with name/level/hunger/boredom/sleepiness
class Tamagotchi {
  constructor(name) {
    this.name = name;
    this.level = 0;
    this.hunger = 0;
    this.boredom = 0;
    this.sleepiness = 0;
  }
  levelUp() {
    // conditional statement to see if time is at a 00:30 interval (adjust increment for testing)
    // let lvlText = document.getElementById('lvlText');
    // if (seconds === 30) {
    //     level += 1
    //     lvlText.innerHTML = this.level;
    // }
  }
}

function time() {
  setInterval(changeTime, 1000);
}

function changeTime() {
  if (seconds < 10 && minutes < 10) {
    document.getElementById("timer").innerHTML = minutes + ":0" + seconds;
  } else {
    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
  }
  seconds++;
  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
}

// function to run on 'start' button click
function startGame() {
  displayOn();
  time();
}
//turn on #background/#timer/#statBox/#nameAge/clock/#userInput
function displayOn() {
  document.getElementById("background").style.display = "block";
  document.getElementById("timer").style.display = "block";
  document.getElementById("statBox").style.display = "block";
  document.getElementById("nameAge").style.display = "block";
  document.getElementById("buttonContainer").style.display = "block";
  document.getElementById("userInput").style.display = "none";
}
