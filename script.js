const body = document.querySelector("body");
const game = document.getElementById("game");
const spriteBox = document.getElementById("spriteBox");
const background = document.getElementById("background");
const timer = document.getElementById("timer");
const stats = document.getElementById("stats");
const icons = document.querySelector(".icon");
const name_level = document.getElementById("name_level");
const userInputDiv = document.getElementById("userInputDiv");
const buttonDiv = document.getElementById("buttonDiv");
const startButton = document.getElementById("startButton");
const nameInput = document.getElementById("username");
const nameText = document.getElementById("nameText");
const levelText = document.getElementById("levelText");
const hungerText = document.getElementById("hungerText");
const sleepyText = document.getElementById("sleepyText");
const boredomText = document.getElementById("boredomText");
const lightButton = document.getElementById("lightButton");
const lightButtonText = document.getElementById("onOff");
const feedButton = document.getElementById("feedButton");
const playButton = document.getElementById("playButton");
let gameRunning;
let seconds;
let minutes;
let myTamagotchi;
let lights;
let levelInterval;
let hungerInterval;
let sleepingInterval;
let sleepinessInterval;
let boredomInterval;
let timeInterval;

class Tamagotchi {
  constructor(name) {
    this.name = name;
    this.level = 1;
    this.hunger = 0;
    this.sleepiness = 0;
    this.boredom = 0;
  }
  levelUp() {
    this.level += 1;
    this.updateStats();
    if (!gameRunning) {
      return;
    }
  }
  hungerUp() {
    this.hunger += 1;
    this.updateStats();
    if (!gameRunning) {
      return;
    }
  }
  sleepinessUp() {
    if (lights === "on") {
      this.sleepiness += 1;
      this.updateStats();
    }
    if (!gameRunning) {
      return;
    }
  }
  boredomUp() {
    this.boredom += 1;
    this.updateStats();
    if (!gameRunning) {
      return;
    }
  }
  feed() {
    if (this.hunger > 0) {
      this.hunger -= 1;
      this.sleepiness += 1;
      this.updateStats();
    }
  }
  sleep() {
    if (this.sleepiness > 0) {
      this.sleepiness -= 1;
      this.updateStats();
    }
  }
  play() {
    if (this.boredom > 0) {
      this.boredom -= 1;
      this.hunger += 1;
      this.updateStats();
    }
  }
  updateStats() {
    if (!gameRunning) {
      return;
    }
    levelText.innerHTML = this.level;
    hungerText.innerHTML = this.hunger;
    sleepyText.innerHTML = this.sleepiness;
    boredomText.innerHTML = this.boredom;
    endCondition();
  }
}
window.onload = function () {
  chooseName();
  toggleDarkMode('off');
};

// buttons
startButton.onclick = startGame;
// lowers sleepiness when dark mode is toggled
lightButton.onclick = function () {
  toggleDarkMode('on');
  hideButtons();
  console.log(lights)
  if (lights === "off") {
    // delay start of sleepingInterval by 1 second
    // setTimeout(
    //   () =>
    //     (sleepingInterval = setInterval(() => {
    //       myTamagotchi.sleep();
    //     }, 1000)),
    //   10
    // );
    sleepingInterval = setInterval(() => {
      myTamagotchi.sleep();
    }, 1000)
  } else clearInterval(sleepingInterval);
};

feedButton.onclick = function () {
  myTamagotchi.feed();
};

playButton.onclick = function () {
  myTamagotchi.play();
};

// Create a function that will update stat values at randomized intervals
function statIntervals() {
  levelInterval = setInterval(function () {
    myTamagotchi.levelUp();
    // endCondition();
  }, 30000);
  hungerInterval = setInterval(function () {
    myTamagotchi.hungerUp();
    myTamagotchi.updateStats();
    // endCondition();
  }, Math.floor(Math.random() * (6000 - 3000) + 3000));
  sleepinessInterval = setInterval(function () {
    myTamagotchi.sleepinessUp();
    // endCondition();
  }, Math.floor(Math.random() * (6000 - 3000) + 3000));
  boredomInterval = setInterval(function () {
    myTamagotchi.boredomUp();
    // endCondition();
  }, Math.floor(Math.random() * (6000 - 3000) + 3000));
}

// use this somewhere it's repeatedly checked for the loss condition
function endCondition() {
  if (
    myTamagotchi.hunger === 10 ||
    myTamagotchi.sleepiness === 10 ||
    myTamagotchi.boredom === 10
  ) {
    gameRunning = false;
  }
}

// function to run on 'start' button click
function startGame() {
  const name = nameInput.value;
  myTamagotchi = new Tamagotchi(name);
  // turn on display of game info
  (function displayOn() {
    background.style.visibility = "visible";
    timer.style.visibility = "visible";
    spriteBox.style.visibility = "visible";
    stats.style.visibility = "visible";
    name_level.style.visibility = "visible";
    buttonDiv.style.visibility = "visible";
    userInputDiv.style.visibility = "hidden";
  })();
  // initialize all stat values, gameRunning to true
  (function initialize() {
    seconds = 0;
    minutes = 0;
    gameRunning = true;
    lights = "on";
    nameText.innerHTML = myTamagotchi.name;
    levelText.innerHTML = myTamagotchi.level;
    hungerText.innerHTML = myTamagotchi.hunger;
    sleepyText.innerHTML = myTamagotchi.sleepiness;
    boredomText.innerHTML = myTamagotchi.boredom;
    lightButtonText.innerHTML = "on";
  })();
  // starting time and stat intervals on game start
  startTimer();
  statIntervals();
}

// function to "type out" intro text
function chooseName() {
  let i = 0;
  let text = "choose a name";
  const label = document.querySelector("label");
  // adds a letter to the string with short delay
  function addLetter() {
    if (i < text.length) {
      label.innerHTML += text.charAt(i);
      i++;
      setTimeout(addLetter, 80);
    } else {
      setTimeout(removeDots, 500);
    }
  }
  // create a function to clear 3 dots and then call addDots
  function removeDots() {
    const currentText = label.innerHTML;
    if (currentText.endsWith("...")) {
      label.innerHTML = currentText.slice(0, -3);
      setTimeout(addDots, 500);
    } else {
      addDots();
    }
  }
  // function to add 3 dots to end of string
  function addDots() {
    label.innerHTML += ".";
    setTimeout(removeDots, 500);
  }

  addLetter();
}

function startTimer() {
  timeInterval = setInterval(changeTime, 1000);
}

function changeTime() {
  if (seconds === 59) {
    seconds = 0;
    minutes += 1;
  } else {
    seconds++;
  }
  console.log(seconds);
  if (seconds < 10) {
    document.getElementById("timer").innerHTML = minutes + ":0" + seconds;
  } else {
    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
  }
  if (!gameRunning) {
    clearInterval(timeInterval);
  }
}

// be able to toggle a "dark mode" when light switch is off - WIP
function toggleDarkMode(on_off) {
  if (lightButtonText.innerHTML === "on") {
    lights = "off";
    lightButtonText.innerHTML = "off";
  } else {
    lights = "on";
    lightButtonText.innerHTML = "on";
  }
  if (on_off === "on") {
    body.classList.toggle("dark_mode");
    game.classList.toggle("dark_mode");
    background.classList.toggle("dark_mode");
    stats.classList.toggle("dark_mode");
    timer.classList.toggle("dark_mode");
    name_level.classList.toggle("dark_mode");
    icons.classList.toggle("dark_mode");
  }
  if (on_off === "off") {
    body.classList.remove("dark_mode");
    game.classList.remove("dark_mode");
    background.classList.remove("dark_mode");
    stats.classList.remove("dark_mode");
    timer.classList.remove("dark_mode");
    name_level.classList.remove("dark_mode");
    icons.classList.remove("dark_mode");

  }
}

function hideButtons() {
  if (lights === 'off') {
    feedButton.style.visibility = 'hidden';
    playButton.style.visibility = 'hidden';
  } else {
    feedButton.style.visibility = 'visible';
    playButton.style.visibility = 'visible';

  }
}
