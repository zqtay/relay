// Return values
export const MAGIC_SUCCESS = 0xAABB;
export const MAGIC_FAILED = 0xBBAA;

// Default game settings
export const WORD_LENGTH_DEFAULT = 5;
export const OVERLAP_LENGTH_DEFAULT = 2;
export const MAX_STEPS_DEFAULT = 5;

// Custom game settings limit
export const MIN_WORD_LENGTH = 5;
export const MAX_WORD_LENGTH = 7;
export const MIN_OVERLAP_LENGTH = 1;
export const MAX_OVERLAP_LENGTH = 3;
export const MIN_STEPS = 3;
export const MAX_STEPS = 8;

export const MODE_DEFAULT = {
    wordLen: WORD_LENGTH_DEFAULT,
    overlapLen: OVERLAP_LENGTH_DEFAULT,
    noOfWords: MAX_STEPS_DEFAULT
};

export const MODE_EMPTY = {
    wordLen: 0,
    overlapLen: 0,
    noOfWords: 0
};

export const STATE_EMPTY = {
    inputs: [],
    hints: []
};