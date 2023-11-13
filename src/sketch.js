let textString;
let possibleLetters;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let cursor;
let elapsedTime;
let jumpRate;
let jumpFrameCount;
let hasStarted;

function setup() {
  createCanvas(screenWidth, screenHeight);
  possibleLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  textString = createString(possibleLetters, 20, 20);
  cursor = new Cursor(0, 0, textString[0][0].getLetter());
  textSize(32);
  frameRate(60);
  jumpRate = 300;
  jumpFrameCount = 1;
  hasStarted = false;
}

function draw() {
  background(220);
  if (!hasStarted) {
    fill(0);
    textSize(30);
    text(
      "Use the keyboard to type the highlighted letter.\nThe cursor will then jump to a new location.\nPress any key to start.",
      250,
      250
    );
    return;
  }
  text("Errors: " + cursor.getRecentErrorPercentage() + "%", 50, 50);
  cursor.act(textString[cursor.y][cursor.x].getLoc());
  fill(0);
  for (let i = 0; i < textString.length; i++) {
    for (let j = 0; j < textString[i].length; j++) {
      textString[i][j].act();
    }
  }

  jumpFrameCount++;
  if ((jumpFrameCount %= 300) <= 0.01) {
    jumpFrameCount = 0;
    cursor.jump(true);
    jumpRate *= 0.95;
    jumpRate = Math.floor(jumpRate);
  }

  cursor.checkForFailure();

  if (cursor.over) {
    fill(0);
    textSize(30);
    text("You finished in " + elapsedTime / 1000 + "s", 50, 800);
    text("You made " + cursor.errorCount + " typing errors", 50, 850);
    text(
      "Your final rate was " + jumpRate / frameRate() + " seconds per jump",
      50,
      900
    );

    noLoop();
  }
}

function keyReleased() {
  cursor.type(key);
}

function createString(possibleLetters, length, rows) {
  let string = [];
  let row = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < length; j++) {
      let letter =
        possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
      let x = j * 32 + 100;
      let y = i * 32 + 100;
      row.push(new TextBox(letter, x, y));
    }
    string.push(row);
    row = [];
  }
  return string;
}

class Cursor {
  constructor(x, y, letterToType) {
    this.x = x;
    this.y = y;
    this.letterToType = letterToType;
    this.count = 0;
    this.countLimit = Math.floor(Math.random() * 10) + 15;
    this.rateOfFailure = 50;
    this.startTime = performance.now();
    this.errorCount = 0;
    this.over = false;
    this.gameErrorCount = 0;
    this.errorTimes = [];
    this.recentCount = [];
  }

  act(loc) {
    fill(0, 200, 0);
    rect(loc[0] - 2, loc[1] - 28, 32, 32);
  }

  type(key) {
    if (!hasStarted) {
      hasStarted = true;
      return;
    }
    if (key == this.letterToType) {
      this.jump(false);
    } else {
      this.errorCount++;
      this.gameErrorCount++;
      this.errorTimes.push(performance.now());
      this.recentCount.push(performance.now());
    }
  }

  jump(timeOut) {
    this.x = Math.floor(Math.random() * textString[0].length);
    this.y = Math.floor(Math.random() * textString.length);
    this.letterToType = textString[this.y][this.x].getLetter();
    this.count++;
    this.recentCount.push(performance.now());
    if (timeOut) {
      this.gameErrorCount++;
      this.errorTimes.push(performance.now());
    }
  }

  checkForFailure() {
    if (this.getRecentErrorPercentage() > this.rateOfFailure) {
      let endTime = performance.now();
      elapsedTime = endTime - this.startTime;
      this.over = true;
    }
  }

  getGameErrorPercentage() {
    return (this.gameErrorCount * 100) / this.count;
  }

  getErrorPercentage() {
    return (this.errorCount * 100) / this.count;
  }

  getRecentCount() {
    this.recentCount = this.recentCount.filter((time) => {
      return time > performance.now() - 10000;
    });

    return this.recentCount.length;
  }

  getRecentErrorPercentage() {
    this.errorTimes = this.errorTimes.filter((time) => {
      return time > performance.now() - 10000;
    });

    return (this.errorTimes.length * 100) / this.getRecentCount();
  }
}

class TextBox {
  constructor(letter, x, y) {
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.color = 0;
  }

  act() {
    fill(this.color);
    text(this.letter, this.x, this.y);
  }

  getLoc() {
    return [this.x, this.y];
  }

  getLetter() {
    return this.letter;
  }
}
