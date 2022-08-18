const { readSync, readFileSync } = require("fs");
const readline = require("readline");
const fullDict = readFileSync('dict.txt', 'utf8').split("\r\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("close", function () {
    console.log("Exit");
    process.exit(0);
});

function prompt(query) {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }))
}

const MAGIC_SUCCESS = 0xAABB;
const MAGIC_FAILED = 0xBBAA;
const WORD_LENGTH_DEFAULT = 5;
const OVERLAP_LENGTH_DEFAULT = 2;
const MAX_STEPS_DEFAULT = 5;

class Game {
    mode;
    startWord;
    endWord;
    solution;
    hints;
    currStep;
    currInputs;

    genPuzzle(settings = { mode: null, solution: null }) {
        if (settings.mode == null) {
            this.mode = {
                wordLen: WORD_LENGTH_DEFAULT,
                overlapLen: OVERLAP_LENGTH_DEFAULT,
                maxSteps: MAX_STEPS_DEFAULT
            };
        }
        else {
            this.mode = {
                wordLen: settings.mode.wordLen,
                overlapLen: settings.mode.overlapLen,
                maxSteps: settings.mode.maxSteps,
            };
        }

        if (settings.solution == null) {
            let dict = fullDict.filter(e => e.length === this.mode.wordLen);
            let filteredDict = null;
            let deadend = [];
            let i = 0;
            this.solution = Array(this.mode.maxSteps).fill("");
            while (i < this.mode.maxSteps) {
                if (i === 0) {
                    this.solution[i] = this.getRandomItem(dict);
                    i++;
                }
                else {
                    // Get the ending of the previous word
                    let prevEnd = this.solution[i - 1].slice(-this.mode.overlapLen);
                    // Get the list of words starting with the ending of the previous word
                    // and excluding those that were identified to lead to dead end
                    // and excluding duplicates 
                    filteredDict = dict.filter(e => e.startsWith(prevEnd))
                        .filter(e => !deadend.includes(e))
                        .filter(e => !this.solution.includes(e));
                    if (filteredDict.length > 0) {
                        // Get random word from the filtered list
                        this.solution[i] = this.getRandomItem(filteredDict);
                        // Next word
                        i++;
                    }
                    else {
                        // Previous word leads to dead end
                        // Add previous word to dead end list
                        deadend.push(this.solution[i - 1]);
                        // Go back to previous word to generate a new word
                        this.solution[i - 1] = "";
                        i--;
                    }
                }
                if (deadend.length === dict.length) {
                    return this.result(MAGIC_FAILED, "No solution found");
                }
                //console.log(this.solution);
                //console.log(this.deadend);
            }
        }
        else {
            // Get from settings
            this.solution = [...settings.solution];
        }

        this.startWord = this.solution[0].slice(0, this.mode.overlapLen);
        this.endWord = this.solution.at(-1).slice(-this.mode.overlapLen);
        this.hints = this.solution.join("").slice(this.mode.overlapLen, -this.mode.overlapLen);
        this.hints = [...new Set(this.hints.split(""))].sort();
        this.currStep = 0;
        this.currInputs = Array(this.mode.maxSteps).fill("");
        this.currInputs[0] = this.startWord;
        this.currInputs[this.mode.maxSteps - 1] = this.endWord;

        return this.result(MAGIC_SUCCESS);
    }

    validateInput(input) {
        // Check input length
        if (input.length != this.mode.wordLen) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }

        // Check the word in dictionary
        if (!fullDict.includes(input)) {
            return this.result(MAGIC_FAILED, "Not in dict");
        }

        // Check starting and ending words
        if (this.currStep === 0) {
            if (!input.startsWith(this.startWord)) {
                return this.result(MAGIC_FAILED, "Word not match");
            }
            input = input.slice(this.mode.overlapLen);
        }
        else if (this.currStep === (this.mode.maxSteps - 1)) {
            if (!input.endsWith(this.endWord)) {
                return this.result(MAGIC_FAILED, "Word not match");
            }
            input = input.slice(0, -this.mode.overlapLen);
        }

        // Check input with available hints
        let invalidChar = "";
        input.split("").forEach((a) => {
            if (!this.hints.includes(a)) {
                // Return the invalid alphabet
                if (!invalidChar.includes(a)) {
                    invalidChar += a;
                }
            }
        });
        return (invalidChar === "") ? this.result(MAGIC_SUCCESS) : this.result(MAGIC_FAILED, invalidChar);
    }

    validateAll() {
        // Sanity check
        if (this.currInputs.length != this.mode.maxSteps) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }
        for (const [index, input] of this.currInputs.entries()) {
            this.setCurrentStep(index);
            // Check for duplicates
            if (this.currInputs.filter(e => input === e).length > 1) {
                return this.result(MAGIC_FAILED, "Duplicate words");
            }
            // Check each input
            if (this.validateInput(input).status != MAGIC_SUCCESS) {
                return this.result(MAGIC_FAILED, "Invalid word");
            }
            if (index > 1) {
                // Check current input's beginning is the same as 
                // previous input's ending
                if (!input.startsWith(this.currInputs[index - 1].slice(-this.mode.overlapLen))) {
                    return this.result(MAGIC_FAILED, "Word not match");
                }
            }
        }
        return this.result(MAGIC_SUCCESS);
    }

    setInput(input) {
        this.currInputs[this.currStep] = input;
    }

    setCurrentStep(step) {
        if (step >= 0 && step < this.mode.maxSteps) {
            this.currStep = step;
            return this.result(MAGIC_SUCCESS);
        }
        return this.result(MAGIC_FAILED, "Invalid step");
    }

    result(status, data = "") {
        return { status: status, data: data };
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    async run() {
        while (true) {
            console.log(`${this.hints}`);
            let ans = await prompt(this.currInputs + '\n');
            ans = ans.trim();
            let res = null;
            switch (ans) {
                case "s":
                    res = this.validateAll();
                    if (res.status === MAGIC_SUCCESS) {
                        console.log("Puzzle solved");
                    }
                    else {
                        console.log("Puzzle failed: " + res.data);
                    }
                    break;
                case "a":
                    console.log(this.solution);
                    break;
                case "g":
                    console.log("New puzzle");
                    this.genPuzzle();
                    break;
                default:
                    if (!isNaN(parseInt(ans))) {
                        this.setCurrentStep(parseInt(ans));
                        console.log("Switched to " + ans);
                    }
                    else {
                        res = this.validateInput(ans);
                        if (res.status === MAGIC_SUCCESS) {
                            console.log("Input valid");
                            this.setInput(ans);
                        }
                        else {
                            console.log("Input invalid: " + res.data);
                        }
                    }
                    break;
            }
        }
    }
}

module.exports = Game;