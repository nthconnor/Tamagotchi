const elements = {
  body: document.querySelector("body"),
  game: document.getElementById("game"),
  welcomeScreen: document.querySelector(".welcomeScreen"),
  background: document.getElementById("background"),
  userInputDiv: document.getElementById("userInputDiv"),
  spriteElements: {
    spriteSheet: document.getElementById("spriteSheet"),
    spriteText: document.getElementById("spriteText"),
    spriteClass: document.querySelector(".spriteClass"),
    sprites: {
      sprite_1: document.getElementById("sprite_1"),
      sprite_2: document.getElementById("sprite_2"),
      sprite_3: document.getElementById("sprite_3"),
      sprite_4: document.getElementById("sprite_4"),
    },
  },
  statElements: {
    timer: document.getElementById("timer"),
    stats: document.getElementById("stats"),
    name_level: document.getElementById("name_level"),
    nameInput: document.getElementById("username"),
    nameText: document.getElementById("nameText"),
    levelText: document.getElementById("levelText"),
    hungerText: document.getElementById("hungerText"),
    sleepyText: document.getElementById("sleepyText"),
    boredomText: document.getElementById("boredomText"),
  },
  buttonElements: {
    buttonDiv: document.getElementById("buttonDiv"),
    startButton: document.getElementById("startButton"),
    lightButton: document.getElementById("lightButton"),
    feedButton: document.getElementById("feedButton"),
    playButton: document.getElementById("playButton"),
    playGameButton: document.getElementById("playGameButton"),
    icons: document.querySelector(".icon"),
    moonIcon: document.getElementById("moon"),
    sunIcon: document.getElementById("sun"),
  },
  audioElements: {
    main_theme: new Audio("./assets/audio/main_theme.mp3"),
    day_ambience: new Audio("./assets/audio/day_ambience.mp3"),
    levelUp_sound: new Audio("./assets/audio/level_sound.mp3"),
    button_sound: new Audio("./assets/audio/button_sound.mp3"),
    game_over: new Audio("./assets/audio/game_over.mp3"),
  },
};
let gameRunning;
let seconds;
let minutes;
// let myTamagotchi;
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
    if (gameRunning) {
      elements.audioElements.levelUp_sound.play();
    }
    this.level += 1;
    this.updateSprite();
    this.updateStats();
    if (!gameRunning) {
      return;
    }
  }
  hungerUp() {
    this.hunger += 1;
    this.updateStats();
    if (this.hunger > 0) {
      elements.statElements.hungerText.style.visibility = "visible";
    }
    if (!gameRunning) {
      return;
    }
  }
  sleepinessUp() {
    if (lights === "on") {
      this.sleepiness += 1;
      this.updateStats();
    }
    if (this.sleepiness > 0) {
      elements.statElements.sleepyText.style.visibility = "visible";
    }
    if (!gameRunning) {
      return;
    }
  }
  boredomUp() {
    this.boredom += 1;
    this.updateStats();
    if (this.boredom > 0) {
      elements.statElements.boredomText.style.visibility = "visible";
    }
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
  dead() {
    if (!gameRunning) {
      elements.spriteElements.sprites.sprite_1.classList.remove("idle");
      elements.spriteElements.sprites.sprite_2.classList.remove("idle");
      elements.spriteElements.sprites.sprite_3.classList.remove("idle");
      elements.spriteElements.sprites.sprite_4.classList.remove("idle");
      elements.spriteElements.sprites.sprite_1.classList.add("dead");
      elements.spriteElements.sprites.sprite_2.classList.add("dead");
      elements.spriteElements.sprites.sprite_3.classList.add("dead");
      elements.spriteElements.sprites.sprite_4.classList.add("dead");
      elements.spriteElements.spriteText.style.visibility = "visible";
      elements.spriteElements.spriteText.innerHTML = "*argh*";
      elements.audioElements.game_over.play();
      elements.audioElements.day_ambience.pause();
      elements.audioElements.main_theme.pause();
      elements.buttonElements.buttonDiv.style.visibility = "hidden";
      setTimeout(() => {
        elements.spriteElements.spriteText.style.visibility = "hidden";
      }, 1000);
    }
  }
  updateStats() {
    if (!gameRunning) {
      return;
    }
    elements.statElements.levelText.innerHTML = this.level;
    elements.statElements.hungerText.innerHTML = this.hunger;
    elements.statElements.sleepyText.innerHTML = this.sleepiness;
    elements.statElements.boredomText.innerHTML = this.boredom;
    statColors("hunger");
    statColors("sleepiness");
    statColors("boredom");
    endCondition();
    myTamagotchi.dead();
  }
  updateSprite() {
    if (gameRunning) {
      if (this.level === 1) {
        elements.spriteElements.sprites.sprite_1.style.visibility = "visible";
      } else if (this.level === 2) {
        elements.spriteElements.sprites.sprite_1.style.visibility = "hidden";
        elements.spriteElements.sprites.sprite_2.style.visibility = "visible";
      } else if (this.level === 3) {
        elements.spriteElements.sprites.sprite_2.style.visibility = "hidden";
        elements.spriteElements.sprites.sprite_3.style.visibility = "visible";
      } else {
        elements.spriteElements.sprites.sprite_3.style.visibility = "hidden";
        elements.spriteElements.sprites.sprite_4.style.visibility = "visible";
      }
    } else {
      return;
    }
  }
}
// run on page load
audioHandler();
startScreen();
toggleDarkMode("off");
// -----------------
// buttons ---------
startButton.onclick = function () {
  startGame();
  elements.audioElements.button_sound.play();
  elements.audioElements.day_ambience.play();
  elements.audioElements.main_theme.play();
};
lightButton.onclick = function () {
  toggleDarkMode("on");
  hideButtons();
  elements.audioElements.button_sound.play();
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
    }, 1000);
  } else clearInterval(sleepingInterval);
};
feedButton.onclick = function () {
  myTamagotchi.feed();
  elements.audioElements.button_sound.play();
};
playButton.onclick = function () {
  myTamagotchi.play();
  elements.audioElements.button_sound.play();
};
playGameButton.onclick = function () {
  playGame();
  elements.audioElements.button_sound.play();
};
// ------------------

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
  }, 10000);
  sleepinessInterval = setInterval(function () {
    myTamagotchi.sleepinessUp();
    // endCondition();
  }, Math.floor(Math.random() * (10000 - 5000 + 1) + 5000));
  boredomInterval = setInterval(function () {
    myTamagotchi.boredomUp();
    // endCondition();
  }, Math.floor(Math.random() * (10000 - 5000 + 1) + 5000));
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
  const name = elements.statElements.nameInput.value;
  myTamagotchi = new Tamagotchi(name);
  elements.spriteElements.spriteClass.classList.remove("dead");
  elements.spriteElements.spriteClass.classList.add("idle");
  // turn on display of game info
  (function displayOn() {
    elements.background.style.visibility = "visible";
    elements.statElements.timer.style.visibility = "visible";
    elements.spriteElements.spriteSheet.style.visibility = "visible";
    elements.spriteElements.sprites.sprite_1.style.visibility = "visible";
    elements.spriteElements.sprites.sprite_2.style.visibility = "hidden";
    elements.spriteElements.sprites.sprite_3.style.visibility = "hidden";
    elements.spriteElements.sprites.sprite_4.style.visibility = "hidden";
    elements.statElements.stats.style.visibility = "visible";
    elements.statElements.name_level.style.visibility = "visible";
    elements.buttonElements.buttonDiv.style.visibility = "visible";
    elements.userInputDiv.style.visibility = "hidden";
    elements.spriteElements.spriteText.style.visibility = "hidden";
  })();
  // initialize all stat values, gameRunning to true
  (function initialize() {
    seconds = 0;
    minutes = 0;
    gameRunning = true;
    lights = "on";
    elements.statElements.nameText.innerHTML = myTamagotchi.name;
    elements.statElements.levelText.innerHTML = myTamagotchi.level;
    elements.statElements.hungerText.innerHTML = myTamagotchi.hunger;
    elements.statElements.sleepyText.innerHTML = myTamagotchi.sleepiness;
    elements.statElements.boredomText.innerHTML = myTamagotchi.boredom;
    initializeAnimations();
  })();
  // starting time and stat intervals on game start
  startTimer();
  statIntervals();
}

// function to "type out" intro text
//recreate to take parameters
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
    elements.statElements.timer.innerHTML = minutes + ":0" + seconds;
  } else {
    elements.statElements.timer.innerHTML = minutes + ":" + seconds;
  }
  if (!gameRunning) {
    clearInterval(timeInterval);
  }
}

// be able to toggle a "dark mode" when light switch is off
function toggleDarkMode(on_off) {
  if (lights === "on") {
    lights = "off";
    elements.buttonElements.moonIcon.style.display = "none";
    elements.buttonElements.sunIcon.style.display = "inline-block";
    if (gameRunning) {
      setTimeout(() => {
        elements.spriteElements.spriteText.style.visibility = "visible";
        elements.spriteElements.spriteText.innerText = "zzz";
      }, 100);
    }
    // lightButtonText.innerHTML = "night";
  } else {
    lights = "on";
    elements.buttonElements.sunIcon.style.display = "none";
    elements.buttonElements.moonIcon.style.display = "inline-block";
    elements.spriteElements.spriteText.style.visibility = "hidden";
    // lightButtonText.innerHTML = "day";
  }
  if (on_off === "on") {
    elements.body.classList.toggle("dark_mode");
    elements.game.classList.toggle("dark_mode");
    elements.background.classList.toggle("dark_mode");
    elements.statElements.stats.classList.toggle("dark_mode");
    elements.statElements.timer.classList.toggle("dark_mode");
    elements.statElements.name_level.classList.toggle("dark_mode");
    elements.buttonElements.icons.classList.toggle("dark_mode");
  }
  if (on_off === "off") {
    elements.body.classList.remove("dark_mode");
    elements.game.classList.remove("dark_mode");
    elements.background.classList.remove("dark_mode");
    elements.statElements.stats.classList.remove("dark_mode");
    elements.statElements.timer.classList.remove("dark_mode");
    elements.statElements.name_level.classList.remove("dark_mode");
    elements.buttonElements.icons.classList.remove("dark_mode");
  }
}

function hideButtons() {
  if (lights === "off") {
    elements.buttonElements.feedButton.style.visibility = "hidden";
    elements.buttonElements.playButton.style.visibility = "hidden";
  } else {
    elements.buttonElements.feedButton.style.visibility = "visible";
    elements.buttonElements.playButton.style.visibility = "visible";
  }
}

function statColors(stat) {
  if (myTamagotchi[stat] === 1) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#42D921";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#42D921";
    } else {
      elements.statElements.boredomText.style.color = "#42D921";
    }
  } else if (myTamagotchi[stat] === 2) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#72D921";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#72D921";
    } else {
      elements.statElements.boredomText.style.color = "#72D921";
    }
  } else if (myTamagotchi[stat] === 3) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#8BD921";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#8BD921";
    } else {
      elements.statElements.boredomText.style.color = "#8BD921";
    }
  } else if (myTamagotchi[stat] === 4) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#A2D921";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#A2D921";
    } else {
      elements.statElements.boredomText.style.color = "#A2D921";
    }
  } else if (myTamagotchi[stat] === 5) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#C4D921";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#C4D921";
    } else {
      elements.statElements.boredomText.style.color = "#C4D921";
    }
  } else if (myTamagotchi[stat] === 6) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#D9CD21";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#D9CD21";
    } else {
      elements.statElements.boredomText.style.color = "#D9CD21";
    }
  } else if (myTamagotchi[stat] === 7) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#D99821";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#D99821";
    } else {
      elements.statElements.boredomText.style.color = "#D99821";
    }
  } else if (myTamagotchi[stat] === 8) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#D97321";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#D97321";
    } else {
      elements.statElements.boredomText.style.color = "#D97321";
    }
  } else if (myTamagotchi[stat] === 9) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#D95421";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#D95421";
    } else {
      elements.statElements.boredomText.style.color = "#D95421";
    }
  } else if (myTamagotchi[stat] === 10) {
    if (stat === "hunger") {
      elements.statElements.hungerText.style.color = "#FC1313";
    } else if (stat === "sleepiness") {
      elements.statElements.sleepyText.style.color = "#FC1313";
    } else {
      elements.statElements.boredomText.style.color = "#FC1313";
    }
  }
}

function initializeAnimations() {
  elements.spriteElements.sprites.sprite_1.classList.add("spriteClass");
  elements.spriteElements.sprites.sprite_2.classList.add("spriteClass");
  elements.spriteElements.sprites.sprite_3.classList.add("spriteClass");
  elements.spriteElements.sprites.sprite_4.classList.add("spriteClass");
  elements.spriteElements.sprites.sprite_1.classList.remove("dead");
  elements.spriteElements.sprites.sprite_2.classList.remove("dead");
  elements.spriteElements.sprites.sprite_3.classList.remove("dead");
  elements.spriteElements.sprites.sprite_4.classList.remove("dead");
}

function playGame() {
  elements.userInputDiv.style.display = "flex";
  elements.welcomeScreen.style.display = "none";
  elements.buttonElements.playGameButton.style.display = "none";
  chooseName();
}

function startScreen() {
  elements.userInputDiv.style.display = "none";
  elements.welcomeScreen.style.visibility = "visible";
  elements.buttonElements.playGameButton.style.visibility = "visible";
}

function audioHandler() {
  elements.audioElements.button_sound.volume = 0.08;
  elements.audioElements.levelUp_sound.volume = 0.1;
  elements.audioElements.main_theme.volume = 0.02;
  elements.audioElements.main_theme.loop = true;
  elements.audioElements.day_ambience.volume = 0.05;
  elements.audioElements.day_ambience.loop = true;
  elements.audioElements.game_over.volume = 0.05;
}
