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
    MODE_DEFAULT,
    MODE_EMPTY
} from "./GameConst";

const GEN_PUZZLE_TIMEOUT = 2000; // in ms

class Game {
    mode;
    solution;
    keys;
    dict;
    hints;

    constructor() {
        this.mode = MODE_EMPTY;
        this.hints = [];
    }

    genPuzzle(settings = { mode: null, solution: null }) {
        if (settings.mode == null) {
            this.mode = MODE_DEFAULT;
        }
        else {
            // Check game settings limit
            if (!(settings.mode.wordLen >= MIN_WORD_LENGTH && settings.mode.wordLen <= MAX_WORD_LENGTH) ||
                !(settings.mode.overlapLen >= MIN_OVERLAP_LENGTH && settings.mode.overlapLen <= MAX_OVERLAP_LENGTH) ||
                !(settings.mode.noOfWords >= MIN_STEPS && settings.mode.noOfWords <= MAX_STEPS)) {
                return this.result(MAGIC_FAILED, "Invalid mode");
            }

            if ((settings.mode.wordLen >> 1) < settings.mode.overlapLen) {
                return this.result(MAGIC_FAILED, "Invalid mode");
            }

            this.mode = { ...settings.mode };
        }

        if (settings.solution == null) {
            // Get dict for this puzzle settings
            this.dict = fullDict[this.mode.wordLen];
            // Create empty solution array with correct length
            this.solution = Array(this.mode.noOfWords).fill('');
            let filteredDict = null;
            let deadEnd = [];

            // Manual timeout break
            let elapsedTime = 0;
            const startTime = Date.now();

            // Recursive loop
            let i = 0;
            while (i < this.mode.noOfWords) {
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
        // Available character keys to solve puzzle
        this.keys = this.solution.join('').slice(this.mode.overlapLen, -this.mode.overlapLen);
        this.keys = [...new Set(this.keys.split(''))].sort();
        // Create hints array with filled spaces
        this.hints = Array(this.mode.noOfWords).fill(' '.repeat(this.mode.wordLen));
        // Start word
        this.hints[0] = this.solution[0].slice(0, this.mode.overlapLen) + ' '.repeat(this.mode.wordLen - this.mode.overlapLen);
        // End word
        this.hints[this.mode.noOfWords - 1] = ' '.repeat(this.mode.wordLen - this.mode.overlapLen) + this.solution.at(-1).slice(-this.mode.overlapLen);

        return this.result(MAGIC_SUCCESS, {
            hints: [...this.hints],
            inputs: [...this.hints]
        });
    }

    async genPuzzleAsync(settings = { mode: null, solution: null }) {
        return new Promise(resolve => {
            resolve(this.genPuzzle(settings));
        });
    }

    genPuzzleFromEncoded(encoded) {
        let res = this.getSettingsFromEncoded(encoded);
        if (res.status !== MAGIC_SUCCESS) {
            return res;
        }
        else {
            return this.genPuzzle(res.data);
        }
    }

    validateInput(index, input) {
        // console.log(`${input} ${input.length} ${this.mode.wordLen}`);
        // Check input length
        if (input.length !== this.mode.wordLen) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }

        // Check blanks
        if (input.includes(" ")) {
            return this.result(MAGIC_FAILED, "Missing chars");
        }

        // Check given hints
        let hint = this.hints[index];
        for (let i = 0; i < this.mode.wordLen; i++) {
            if (hint[i] !== " " && input[i] !== hint[i]) {
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

    validateAll(inputs) {
        // Sanity check
        if (inputs.length !== this.mode.noOfWords) {
            return this.result(MAGIC_FAILED, "Wrong length");
        }

        // Check for blanks
        if (inputs.some((input) => input.includes(" "))) {
            return this.result(MAGIC_FAILED, "Missing words");
        }

        for (const [index, input] of inputs.entries()) {
            // Check for duplicates
            if (inputs.filter(e => input === e).length > 1) {
                return this.result(MAGIC_FAILED, `Duplicate words: ${input}`);
            }
            // Check each input
            if (this.validateInput(index, input).status !== MAGIC_SUCCESS) {
                return this.result(MAGIC_FAILED, `Invalid word: ${input}`);
            }
            if (index >= 1) {
                // Check current input's beginning is the same as 
                // previous input's ending
                if (!input.startsWith(inputs[index - 1].slice(-this.mode.overlapLen))) {
                    return this.result(MAGIC_FAILED, `Word not match: ${inputs[index - 1]}, ${input}`);
                }
            }
        }
        return this.result(MAGIC_SUCCESS, "Puzzle solved");
    }

    addHint(wordIndex = null, charIndex = null) {
        if (wordIndex === null || wordIndex < 0 || wordIndex >= this.mode.noOfWords) {
            return this.result(MAGIC_FAILED, "Invalid word index");
        }
        let hints = [];
        let data = null;
        const hint = this.hints[wordIndex];
        if (charIndex === null) {
            // Get random hint
            this.solution[wordIndex].split("").forEach(
                (a, i) => {
                    if (hint[i] === " ") {
                        hints.push({ index: i, hint: a });
                    }
                }
            );

            if (hints.length === 0) {
                return this.result(MAGIC_FAILED, "No available hints");
            }

            data =  this.getRandomItem(hints);
        }
        else {
            if (charIndex < 0 || charIndex >= this.mode.wordLen) {
                this.result(MAGIC_FAILED, "Invalid char index");
            }
            data = {index: charIndex, hint: this.solution[wordIndex][charIndex]};
        }
        this.hints[wordIndex] = hint.slice(0, data.index) + data.hint + hint.slice(data.index + 1);
        return this.result(MAGIC_SUCCESS, data);
    }

    /** Public getters **/
    getMode() {
        return this.result(MAGIC_SUCCESS, this.mode);
    }

    getHints() {
        return this.result(MAGIC_SUCCESS, this.hints)
    }

    getKeys() {
        return this.result(MAGIC_SUCCESS, this.keys)
    }

    getSolution() {
        return this.result(MAGIC_SUCCESS, this.solution)
    }

    /** URL query and game settings **/
    // Generate encoded query from settings
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
            let encoded = `${this.mode.wordLen},${this.mode.overlapLen},${this.mode.noOfWords},${Buffer.from(solStr).toString("base64")}`;
            return this.result(MAGIC_SUCCESS, encoded);
        }
        catch (e) {
            this.result(MAGIC_FAILED, "Failed to generate encoded string");
        }
    }

    // Parse encoded query to settings
    getSettingsFromEncoded(encoded) {
        let settings = { mode: { wordLen: -1, overlapLen: -1, noOfWords: -1 }, solution: [] };
        try {
            let textArray = encoded.split(",");
            // Mode
            settings.mode.wordLen = parseInt(textArray[0]);
            settings.mode.overlapLen = parseInt(textArray[1]);
            settings.mode.noOfWords = parseInt(textArray[2]);
            // Solution
            let solStr = Buffer.from(textArray[3], "base64").toString("ascii");
            let startIndex, endIndex = 0;
            for (let i = 0; i < settings.mode.noOfWords; i++) {
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

    /** Utils **/
    // Return result object
    result(status, data = "") {
        return { status: status, data: data };
    }

    // Get random item from an array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

const CurrentGame = new Game();

export {
    Game,
    CurrentGame
};
