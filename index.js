const Game = require("./game");

let settings = {
    mode: {
        wordLen: 5,
        overlapLen: 2,
        maxSteps: 5
    }
}

const game = new Game;
game.genPuzzle(settings);
game.run();

