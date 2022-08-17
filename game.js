const { readSync, readFileSync } = require("fs");
const readline = require("readline");
const fullDict = readFileSync('dict.txt', 'utf8').split("\r\n");

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

    genPuzzle(settings) {
        this.mode = {
            wordLen: 5,
            overlapLen: 2,
            maxSteps: 4
        };
        let dict = fullDict.filter(e => e.length === this.mode.wordLen);
        let filteredDict = dict;
        let deadend = [];
        let i = 0;
        this.solution = Array(this.mode.maxSteps).fill("");
        while (i < this.mode.maxSteps) {
            if (i === 0){

                this.solution[i] = this.getRandomItem(dict);
                i++;
            }
            else {
                // Get the ending of the previous word
                let prevEnd = this.solution[i-1].slice(-this.mode.overlapLen);
                // Get the list of words starting with the ending of the previous word
                // also excluding those that were identified to lead to dead end
                filteredDict = dict.filter(e => e.startsWith(prevEnd)).filter(e => !deadend.includes(e));
                if (filteredDict.length > 0) {
                    // Get random word from the filtered list
                    this.solution[i] = this.getRandomItem(filteredDict);
                    // Next word
                    i++;
                }
                else {
                    // Previous word leads to dead end
                    // Add previous word to dead end list
                    deadend.push(this.solution[i-1]);
                    // Go back to previous word to generate a new word
                    this.solution[i-1] = "";
                    i--;
                }
            }
            if (deadend.length === dict.length) {
                console.log("no solution");
                break;
            }
            //console.log(this.solution);
            //console.log(this.deadend);
        }
        this.startWord = this.solution[0].slice(0, this.mode.overlapLen);
        this.endWord = this.solution.at(-1).slice(-this.mode.overlapLen);
        this.hints = this.solution.join("").slice(this.mode.overlapLen, -this.mode.overlapLen);
        this.hints = [...new Set(this.hints.split(""))].sort();
        this.currStep = 0;
        this.currInputs = Array(this.mode.maxSteps).fill("");
        this.currInputs[0] = this.startWord;
        this.currInputs[this.mode.maxSteps - 1] = this.endWord;
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random()*array.length)];
    }

    genTestPuzzle() {
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
        let res = {status: INPUT_INVALID, data: ""};

        // Check input length
        if (input.length != this.mode.wordLen) {
            return res;
        }

        // TODO: Check the word with dictionary
        if (!fullDict.includes(input)) {
            res.data = "1"
            return res;
        }

        // Check starting and ending words
        if (this.currStep === 0) {
            if (!input.startsWith(this.startWord)) {
                return res;
            }
            input = input.slice(this.mode.overlapLen);
        }
        else if (this.currStep === (this.mode.maxSteps - 1)) {
            if (!input.endsWith(this.endWord)) {
                return res;
            }
            input = input.slice(0, -this.mode.overlapLen);
        }

        // Check actual input by user
        input.split("").forEach((a) => {
            if (!this.hints.includes(a)) {
                // Return the invalid alphabet
                if(!res.data.includes(a)) {
                    res.data += a;
                }
            }
        });

        if (res.data === "") {
            res.status = INPUT_VALID;
        }

        return res;
    }

    validateAll() {
        let res = {status: PUZZLE_FAILED, data: ""};
        // Sanity check
        if (this.currInputs.length != this.mode.maxSteps) {
            return res;
        }
        // Check each input
        for (const [index, input] of this.currInputs.entries()) {
            this.currStep = index;
            if (this.validateInput(input).status != INPUT_VALID) {
                return res;
            }
            if (index > 1) {
                // Check current input's beginning is the same as 
                // previous input's ending
                if (!input.startsWith(this.currInputs[index - 1].slice(-this.mode.overlapLen))) {
                    return res;
                }
            }
        }
        res.status = PUZZLE_SOLVED;
        return res;
    }

    setInput(input) {
        this.currInputs[this.currStep] = input;
    }

    setCurrentStep(step) {
        if (step >= 0 && step < this.mode.maxSteps) {
            this.currStep = step;
        }
    }

    async run() {
        while (true) {
            var ans = await prompt(this.currInputs + '\n');
            ans = ans.trim();
            switch (ans) {
                case "s":
                    if (this.validateAll().status === PUZZLE_SOLVED) {
                        console.log("Puzzle solved\n");
                        rl.close();
                        return;
                    }
                    else {
                        console.log("Puzzle failed\n");
                    }
                    break;
                case "a":
                    console.log(this.solution);
                    break;
                default:
                    if (!isNaN(parseInt(ans))) {
                        this.setCurrentStep(parseInt(ans));
                        console.log("Switched to " + ans + '\n');
                    }
                    else {
                        let res = this.validateInput(ans);
                        if (res.status === INPUT_VALID) {
                            console.log("Input valid\n");
                            this.setInput(ans);
                        }
                        else {
                            console.log("Input invalid : " + res.data + "\n");
                        }
                    }
                    break;
            }
        }
    }
}

module.exports = Game;