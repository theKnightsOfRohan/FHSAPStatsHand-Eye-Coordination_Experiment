let textString;
let possibleLetters;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let cursor;
let errorPercentage;
let elapsedTime;

function setup() {
  // put setup code here
  createCanvas(screenWidth, screenHeight);
  possibleLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  textString = createString(possibleLetters, 10, 10);
  cursor = new Cursor(0, 0, textString[0][0].getLetter());
  textSize(32);
}

function draw() {
  background(220);
  cursor.act(textString[cursor.y][cursor.x].getLoc());
  fill(0);
  text("" + mouseX + ", " + mouseY, 100, 50);
  for (let i = 0; i < textString.length; i++) {
    for (let j = 0; j < textString[i].length; j++) {
      textString[i][j].act();
    }
  }
  if (cursor.over) {
    fill(0);
    text("You finished in " + elapsedTime / 1000 + "s", 100, 800);
    text("You made " + cursor.errorCount + " errors", 100, 850);
    text(
      "Your error percentage was " + Math.round(errorPercentage) + "%",
      100,
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
    this.timer = 0;
    this.count = 1;
    this.startTime = performance.now();
    this.errorCount = 0;
    this.over = false;
  }

  act(loc) {
    fill(0, 200, 0);
    rect(loc[0] - 2, loc[1] - 28, 32, 32);
  }

  type(key) {
    if (key == this.letterToType) {
      this.x = Math.floor(Math.random() * textString[0].length);
      this.y = Math.floor(Math.random() * textString.length);
      this.letterToType = textString[this.y][this.x].getLetter();
      this.count++;
      if (this.count == 10) {
        let endTime = performance.now();
        elapsedTime = endTime - this.startTime;
        errorPercentage =
          (this.errorCount * 100) / (this.count + this.errorCount);
        this.over = true;
      }
    } else {
      this.errorCount++;
    }
  }

  getNextLoc() {
    if (this.x > textString[y].length) {
      return [0, this.y + 1];
    }
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
