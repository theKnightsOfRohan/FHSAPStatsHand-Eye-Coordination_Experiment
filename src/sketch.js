let textBox;
let textString;
let possibleLetters;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let cursor;

function setup() {
  // put setup code here
  createCanvas(screenWidth, screenHeight);
  possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
  textString = createString(possibleLetters, 10, 10);
  cursor = new Cursor(0, 0, textString[0][0]);
  textSize(32);
}

function draw() {
  background(220);
  cursor.act(textString[cursor.y][cursor.x].getLoc());
  fill(0);
  for (let i = 0; i < textString.length; i++) {
    for (let j = 0; j < textString[i].length; j++) {
      textString[i][j].act();
    }
  }
}

function keyReleased() {}

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
  }

  act(loc) {
    fill(0, 200, 0);
    rect(loc[0] - 5, loc[1] - 27, 32, 32);
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
  }

  act() {
    text(this.letter, this.x, this.y);
  }

  getLoc() {
    return [this.x, this.y];
  }

  getLetter() {
    return this.letter;
  }
}
