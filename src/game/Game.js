import { Buffer } from "buffer";
import dict from "./dict.json";
import {
    MAGIC_SUCCESS,
    MAGIC_FAILED,
    WORD_LENGTH_DEFAULT,
    OVERLAP_LENGTH_DEFAULT,
    MAX_STEPS_DEFAULT,
    MIN_WORD_LENGTH,
    MAX_WORD_LENGTH,
    MIN_OVERLAP_LENGTH,
    MAX_OVERLAP_LENGTH,
    MIN_STEPS,
    MAX_STEPS
} from "./GameConst";

const GEN_PUZZLE_TIMEOUT = 2000; // in ms

class Game {
    mode;
    startWord;
    endWord;
    solution;
    hints;
    currDict;
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
            // Check game settings limit
            if (!(settings.mode.wordLen >= MIN_WORD_LENGTH && settings.mode.wordLen <= MAX_WORD_LENGTH) ||
                !(settings.mode.overlapLen >= MIN_OVERLAP_LENGTH && settings.mode.overlapLen <= MAX_OVERLAP_LENGTH) ||
                !(settings.mode.maxSteps >= MIN_STEPS && settings.mode.maxSteps <= MAX_STEPS)) {
                return this.result(MAGIC_FAILED, "Invalid mode");
            }

            if ((settings.mode.wordLen >> 1) < settings.mode.overlapLen) {
                return this.result(MAGIC_FAILED, "Invalid mode");
            }

            this.mode = {
                wordLen: settings.mode.wordLen,
                overlapLen: settings.mode.overlapLen,
                maxSteps: settings.mode.maxSteps,
            };
        }

        if (settings.solution == null) {
            this.currDict = dict[this.mode.wordLen];
            let filteredDict = null;
            let deadEnd = [];
            this.solution = Array(this.mode.maxSteps).fill("");

            // Manual timeout break
            let elapsedTime = 0;
            const startTime =  Date.now();

            // Recursive loop
            let i = 0;
            while (i < this.mode.maxSteps) {
                if (i === 0) {
                    this.solution[i] = this.getRandomItem(this.currDict);
                    i++;
                }
                else {
                    // Get the ending of the previous word
                    let prevEnd = this.solution[i - 1].slice(-this.mode.overlapLen);
                    // Get the list of words starting with the ending of the previous word
                    // and excluding those that were identified to lead to dead end
                    // and excluding duplicates 
                    filteredDict = this.currDict.filter(e => e.startsWith(prevEnd))
                        .filter(e => !deadEnd.includes(e))
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
                        deadEnd.push(this.solution[i - 1]);
                        // Go back to previous word to generate a new word
                        this.solution[i - 1] = "";
                        i--;
                    }
                }
                if (deadEnd.length === dict.length) {
                    return this.result(MAGIC_FAILED, "No solution found");
                }
                elapsedTime = Date.now() - startTime;
                if (elapsedTime > GEN_PUZZLE_TIMEOUT) {
                    return this.result(MAGIC_FAILED, "No solution found");
                }
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

        return this.result(MAGIC_SUCCESS, "New puzzle");
    }

    async genPuzzleAsync(settings = { mode: null, solution: null }) {
        return new Promise(resolve => {
            resolve(this.genPuzzle(settings));
        });
    }

    async genPuzzleFromEncoded(encoded) {
        return new Promise(resolve => {
            let res = this.getSettingsFromEncoded(encoded);
            if (res.status !== MAGIC_SUCCESS) {
                resolve(res);
            }
            else {
                resolve(this.genPuzzle(res.data));
            }
        });
    }

    validateInput(input) {
        // Check input length
        if (input.length !== this.mode.wordLen) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }

        // Check the word in dictionary
        if (!this.currDict.includes(input)) {
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

        return (invalidChar === "") ?
            this.result(MAGIC_SUCCESS, "Valid input") :
            this.result(MAGIC_FAILED, "Invalid alphabet: " + invalidChar);
    }

    validateAll() {
        // Backup currStep
        let currStepBackup = this.currStep;

        // Sanity check
        if (this.currInputs.length !== this.mode.maxSteps) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }

        for (const [index, input] of this.currInputs.entries()) {
            this.setCurrStep(index);
            // Check for duplicates
            if (this.currInputs.filter(e => input === e).length > 1) {
                // Restore currStep
                this.currStep = currStepBackup;
                return this.result(MAGIC_FAILED, `Duplicate words: ${input}`);
            }
            // Check each input
            if (this.validateInput(input).status !== MAGIC_SUCCESS) {
                // Restore currStep
                this.currStep = currStepBackup;
                return this.result(MAGIC_FAILED, `Invalid word: ${input}`);
            }
            if (index >= 1) {
                // Check current input's beginning is the same as 
                // previous input's ending
                if (!input.startsWith(this.currInputs[index - 1].slice(-this.mode.overlapLen))) {
                    // Restore currStep
                    this.currStep = currStepBackup;
                    return this.result(MAGIC_FAILED, `Word not match: ${this.currInputs[index - 1]}, ${input}`);
                }
            }
        }
        return this.result(MAGIC_SUCCESS, "Puzzle solved");
    }

    setInput(input) {
        let res = this.validateInput(input);
        if (res.status === MAGIC_SUCCESS) {
            this.currInputs[this.currStep] = input;
        }
        return res;
    }

    setCurrStep(step) {
        if (step >= 0 && step < this.mode.maxSteps) {
            this.currStep = step;
            return this.result(MAGIC_SUCCESS, "Switched to " + step);
        }
        return this.result(MAGIC_FAILED, "Invalid step");
    }

    getMode() {
        return this.result(MAGIC_SUCCESS, this.mode);
    }

    getCurrInputs() {
        return this.result(MAGIC_SUCCESS, this.currInputs)
    }

    getHints() {
        return this.result(MAGIC_SUCCESS, this.hints)
    }

    getSolution() {
        return this.result(MAGIC_SUCCESS, this.solution)
    }

    getEncodedFromSettings() {
        if (this.mode === null || this.solution === null) {
            return this.result(MAGIC_FAILED, "Game settings not initialized");
        }
        let solStr = "";
        const overlap = this.mode.overlapLen;
        try {
            for (const [index, word] of this.solution.entries()) {
                if(index === 0) {
                    solStr += word;
                } 
                else {
                    solStr += word.slice(overlap);
                }
            }
            let encoded = `${this.mode.wordLen},${this.mode.overlapLen},${this.mode.maxSteps},${Buffer.from(solStr).toString("base64")}`;
            return this.result(MAGIC_SUCCESS, encoded);
        }
        catch (e) {
            this.result(MAGIC_FAILED, "Failed to generate encoded string");
        }
    }

    getSettingsFromEncoded(encoded) {
        let settings = {mode: {wordLen: -1, overlapLen: -1, maxSteps: -1}, solution: []};
        try {
            let textArray = encoded.split(",");
            // Mode
            settings.mode.wordLen = parseInt(textArray[0]);
            settings.mode.overlapLen = parseInt(textArray[1]);
            settings.mode.maxSteps = parseInt(textArray[2]);
            // Solution
            let solStr = Buffer.from(textArray[3], "base64").toString("ascii");
            let startIndex, endIndex = 0;
            for (let i = 0; i < settings.mode.maxSteps; i++) {
                if (i === 0) {
                    settings.solution.push(solStr.slice(0, settings.mode.wordLen));
                }
                else {
                    startIndex = i * (settings.mode.wordLen - settings.mode.overlapLen);
                    endIndex = startIndex + settings.mode.wordLen;
                    settings.solution.push(solStr.slice(startIndex, endIndex));
                }
            }
        }
        catch (e) {
            return this.result(MAGIC_FAILED, "Invalid format");
        }
        return this.result(MAGIC_SUCCESS, settings);
    }

    result(status, data = "") {
        return { status: status, data: data };
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    process(input) {
        input = input.trim();
        switch (input) {
            case "s":
                return this.validateAll();
            case "a":
                return this.getSolution();
            case "g":
                return this.genPuzzle();
            default:
                if (!isNaN(parseInt(input))) {
                    return this.setCurrStep(parseInt(input));
                }
                else {
                    return this.setInput(input);
                }
        }
    }
}

export default Game;
