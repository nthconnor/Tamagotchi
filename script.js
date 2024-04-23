/* 
- create a class to hold game/pet information and methods
- create functional buttons to control feed/play/lights
- create multiple values for hunger/boredom/sleepiness/level
- create a clock (hh:mm) where minutes pass in seconds
- have our pet values change with time
    - pet can evolve at level 5
- ???
*/
let hungerText = document.getElementById("hungerText");
let sleepyText = document.getElementById("sleepyText");
let boredomText = document.getElementById("boredomText");
let nameTxt = document.getElementById("nameText");
let minutes = 0;
let seconds = 0;
time();

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
  setInterval(function () {
    if (seconds < 10 && minutes < 10) {
      document.getElementById("clock").innerHTML = minutes + ":0" + seconds;
    } else {
      document.getElementById("clock").innerHTML = minutes + ":" + seconds;
    }
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }
  }, 1000);
}
