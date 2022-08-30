import { Buffer } from "buffer";
import fullDict from "./dict.json";
import {
    MAGIC_SUCCESS,
    MAGIC_FAILED,
    MIN_WORD_LENGTH,
    MAX_WORD_LENGTH,
    MIN_OVERLAP_LENGTH,
    MAX_OVERLAP_LENGTH,
    MIN_STEPS,
    MAX_STEPS,
    MODE_DEFAULT
} from "./GameConst";

const GEN_PUZZLE_TIMEOUT = 2000; // in ms

class Game {
    mode;
    solution;
    keys;
    dict;
    state;

    constructor() {
        this.mode = MODE_DEFAULT;
        this.state = {
            step: 0,
            inputs: [],
            hints: []
        };
    }

    genPuzzle(settings = { mode: null, solution: null }) {
        if (settings.mode == null) {
            this.mode = MODE_DEFAULT;
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

            this.mode = { ...settings.mode };
        }

        if (settings.solution == null) {
            this.dict = fullDict[this.mode.wordLen];
            let filteredDict = null;
            let deadEnd = [];
            this.solution = Array(this.mode.maxSteps).fill("");

            // Manual timeout break
            let elapsedTime = 0;
            const startTime = Date.now();

            // Recursive loop
            let i = 0;
            while (i < this.mode.maxSteps) {
                if (i === 0) {
                    this.solution[i] = this.getRandomItem(this.dict);
                    i++;
                }
                else {
                    // Get the ending of the previous word
                    let prevEnd = this.solution[i - 1].slice(-this.mode.overlapLen);
                    // Get the list of words starting with the ending of the previous word
                    // and excluding those that were identified to lead to dead end
                    // and excluding duplicates 
                    filteredDict = this.dict.filter(e => e.startsWith(prevEnd))
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
                if (deadEnd.length === this.dict.length) {
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
            this.dict = fullDict[this.mode.wordLen];
        }

        this.keys = this.solution.join("").slice(this.mode.overlapLen, -this.mode.overlapLen);
        this.keys = [...new Set(this.keys.split(""))].sort();
        this.state.step = 0;
        this.state.hints = Array(this.mode.maxSteps).fill(' '.repeat(this.mode.wordLen));
        // Start word
        this.state.hints[0] = this.solution[0].slice(0, this.mode.overlapLen) + ' '.repeat(this.mode.wordLen - this.mode.overlapLen);
        // End word
        this.state.hints[this.mode.maxSteps - 1] = ' '.repeat(this.mode.wordLen - this.mode.overlapLen) + this.solution.at(-1).slice(-this.mode.overlapLen);
        this.state.inputs = [...this.state.hints];
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

        // Check given hints
        let hint = this.state.hints[this.state.step];
        for (let index = 0; index < this.mode.wordLen; index++) {
            if (hint[index] !== " " && input[index] !== hint[index]) {
                return this.result(MAGIC_FAILED, "Word not match");
            }
        }

        // Check input with given chars
        let invalidChar = "";
        input.split("").forEach((a, i) => {
            if (hint[i] === a) {
                // Skip checking if same as hint
                return;
            }
            if (!this.keys.includes(a)) {
                // Return the invalid char
                if (!invalidChar.includes(a)) {
                    invalidChar += a;
                }
            }
        });
        if (invalidChar !== "") {
            return this.result(MAGIC_FAILED, "Invalid characters: " + invalidChar);
        }

        // Check the word in dictionary
        if (!this.dict.includes(input)) {
            return this.result(MAGIC_FAILED, "Not in dict");
        }

        return this.result(MAGIC_SUCCESS, "Valid input");
    }

    validateAll() {
        // Backup currStep
        let currStepBackup = this.state.step;

        // Sanity check
        if (this.state.inputs.length !== this.mode.maxSteps) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }

        for (const [index, input] of this.state.inputs.entries()) {
            this.setStep(index);
            // Check for duplicates
            if (this.state.inputs.filter(e => input === e).length > 1) {
                // Restore currStep
                this.state.step = currStepBackup;
                return this.result(MAGIC_FAILED, `Duplicate words: ${input}`);
            }
            // Check each input
            if (this.validateInput(input).status !== MAGIC_SUCCESS) {
                // Restore currStep
                this.state.step = currStepBackup;
                return this.result(MAGIC_FAILED, `Invalid word: ${input}`);
            }
            if (index >= 1) {
                // Check current input's beginning is the same as 
                // previous input's ending
                if (!input.startsWith(this.state.inputs[index - 1].slice(-this.mode.overlapLen))) {
                    // Restore currStep
                    this.state.step = currStepBackup;
                    return this.result(MAGIC_FAILED, `Word not match: ${this.state.inputs[index - 1]}, ${input}`);
                }
            }
        }
        return this.result(MAGIC_SUCCESS, "Puzzle solved");
    }

    addRandomHint() {
        let hints = [];
        const hint = this.state.hints[this.state.step];
        const input = this.state.inputs[this.state.step];
        this.solution[this.state.step].split("").forEach(
            (a, i) => {
                if (hint[i] === " ") {
                    hints.push({ index: i, hint: a });
                }
            }
        );

        if (hints.length === 0) {
            return this.result(MAGIC_FAILED, "No available hints");
        }

        let data = this.getRandomItem(hints);
        this.state.hints[this.state.step] = hint.slice(0, data.index) + data.hint + hint.slice(data.index + 1);
        this.state.inputs[this.state.step] = input.slice(0, data.index) + data.hint + input.slice(data.index + 1);
        return this.result(MAGIC_SUCCESS, data);
    }

    clearInput() {
        this.state.inputs[this.state.step] = this.state.hints[this.state.step];
        return this.result(MAGIC_SUCCESS, null);
    }

    setInput(input) {
        let res = this.validateInput(input);
        if (res.status === MAGIC_SUCCESS) {
            this.state.inputs[this.state.step] = input;
        }
        return res;
    }

    setStep(step) {
        if (step >= 0 && step < this.mode.maxSteps) {
            this.state.step = step;
            return this.result(MAGIC_SUCCESS, "Switched to " + step);
        }
        return this.result(MAGIC_FAILED, "Invalid step");
    }

    getMode() {
        return this.result(MAGIC_SUCCESS, this.mode);
    }

    getHints() {
        return this.result(MAGIC_SUCCESS, this.state.hints)
    }

    getInputs() {
        return this.result(MAGIC_SUCCESS, this.state.inputs)
    }

    getKeys() {
        return this.result(MAGIC_SUCCESS, this.keys)
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
                if (index === 0) {
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
        let settings = { mode: { wordLen: -1, overlapLen: -1, maxSteps: -1 }, solution: [] };
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
            case "h":
                return this.addRandomHint();
            case "c":
                return this.clearInput();    
            default:
                if (!isNaN(parseInt(input))) {
                    return this.setStep(parseInt(input));
                }
                else {
                    return this.setInput(input);
                }
        }
    }
}

const CurrentGame = new Game();

export {
    Game,
    CurrentGame
};
