const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});

function prompt(query) {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }))
}

const INPUT_VALID = 0;
const INPUT_INVALID = -1;
const PUZZLE_SOLVED = 0;
const PUZZLE_FAILED = -1;

class Game {
    mode;
    startWord;
    endWord;
    solution;
    hints;
    currStep;
    currInputs;

    genPuzzle() {
        this.mode = {
            wordLen: 5,
            overlapLen: 2,
            maxSteps: 5
        };
        this.startWord = "ho";
        this.endWord = "ms";
        this.solution = ["house", "sever", "error", "orbit", "items"];
        this.hints = ['b', 'e', 'i', 'o', 'r', 's', 't', 'u', 'v'];
        this.currStep = 0;
        this.currInputs = Array(this.mode.maxSteps).fill("");
        this.currInputs[0] = this.startWord;
        this.currInputs[this.mode.maxSteps - 1] = this.endWord;
    }

    validateInput(input) {
        let res = INPUT_INVALID;
        // Check input length
        if (input.length != this.mode.wordLen) {
            return res;
        }
        // Check starting and ending words
        if (this.currStep === 0) {
            if (!input.startsWith(this.startWord)) {
                return res;
            }
            input = input.slice(this.mode.overlapLen, this.mode.wordLen);
        }
        else if (this.currStep === (this.mode.maxSteps - 1)) {
            if (!input.endsWith(this.endWord)) {
                return res;
            }
            input = input.slice(0, this.mode.wordLen - this.mode.overlapLen);
        }

        // Check actual input by user
        res = "";
        input.split("").forEach((a) => {
            if (this.hints.indexOf(a) == -1) {
                // Return the invalid alphabet
                res += a;
            }
        });

        // TODO: Check the word with dictionary

        return res === "" ? INPUT_VALID : res;
    }

    validateAll() {
        // Sanity check
        if (this.currInputs.length != this.mode.maxSteps) {
            return PUZZLE_FAILED;
        }
        // Check each input
        for (const [index, input] of this.currInputs.entries()) {
            this.currStep = index;
            if (this.validateInput(input) != INPUT_VALID) {
                return PUZZLE_FAILED;
            }
            if (index > 1) {
                // Check current input's beginning is the same as 
                // previous input's ending
                if (!input.startsWith(this.currInputs[index - 1].slice(3,5))) {
                    return PUZZLE_FAILED;
                }
            }
        }
        return PUZZLE_SOLVED;
    }

    setInput(input) {
        this.currInputs[this.currStep] = input;
    }

    setCurrentStep(step) {
        this.currStep = step;
    }

    async run() {
        while (true) {
            var ans = await prompt(this.currInputs + '\n');
            ans = ans.trim();
            switch (ans) {
                case "s":
                    if (this.validateAll() === PUZZLE_SOLVED) {
                        console.log("Puzzle solved\n");
                        rl.close();
                        return;
                    }
                    else {
                        console.log("Puzzle failed\n");
                    }
                    break;
                default:
                    if (!isNaN(parseInt(ans))) {
                        this.setCurrentStep(parseInt(ans));
                        console.log("Switched to " + ans + '\n');
                    }
                    else {
                        let res = this.validateInput(ans);
                        if (res === INPUT_VALID) {
                            console.log("Input valid\n");
                            this.setInput(ans);
                        }
                        else {
                            console.log("Input invalid : " + res + "\n");
                        }
                    }
                    break;
            }
        }
    }
}

const samplePuzzle = {
    mode: {
        wordLen: 5,
        overlapLen: 2,
        maxSteps: 5
    },
    startWord: "ho",
    endWord: "ms",
    solution: ["house", "sever", "error", "orbit", "items"],
    hints: ['b', 'e', 'i', 'o', 'r', 's', 't', 'u', 'v'],
    currStep: 0,
    maxSteps: 5
};

module.exports = Game;