const Game = require("./game");

const game = new Game;
game.genPuzzle();
console.log(game.hints)
game.run();
