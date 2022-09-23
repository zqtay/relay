import "./Board.css"

import { lazy, Suspense, useEffect, useRef, useState, memo } from 'react';
import { useSearchParams } from 'react-router-dom';

import WordBox from "./WordBox";
import KeyButtons from "./KeyButtons";
import useLongPress from "../Hooks/UseLongPress";

import { CurrentGame } from "../../game/Game";
import { MAGIC_SUCCESS, MODE_EMPTY, STATE_EMPTY } from "../../game/GameConst";

const ResultsDialog = lazy(() => import("../Dialog/ResultsDialog"));

const STATUS_EMPTY = { res: null, data: "" };
const INDEX_INVALID = -1;

const Board = (props) => {
    const [mode, setMode] = useState(MODE_EMPTY);
    const [state, setState] = useState(STATE_EMPTY);
    const [keys, setKeys] = useState([]);
    const [selected, setSelected] = useState({ wordIndex: INDEX_INVALID, charIndex: INDEX_INVALID });
    const [status, setStatus] = useState(STATUS_EMPTY);
    const [showResults, setShowResults] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const boardRef = useRef(null);

    useEffect(() => {
        let res;
        let puzzleSettings = searchParams.get("puzzle");
        if (puzzleSettings !== null) {
            res = CurrentGame.genPuzzleFromEncoded(puzzleSettings);
        }
        else {
            // Random puzzle with default settings
            res = CurrentGame.genPuzzle();
        }
        setMode(CurrentGame.getMode().data);
        setState(res.data);
        setKeys(CurrentGame.getKeys().data);
        setShowResults(false);
        setStatus(STATUS_EMPTY);
    }, [searchParams]);

    const handleCheckWord = (wordIndex, input) => {
        setStatus(STATUS_EMPTY);
        let res = CurrentGame.validateInput(wordIndex, input);
        setStatus(res);
    };

    const handleSolve = () => {
        setStatus(STATUS_EMPTY);
        let inputs = Array.from(boardRef.current.getElementsByClassName("wordbox")).map(e => e.textContent);
        let res = CurrentGame.validateAll(inputs);
        setStatus(res);
        if (res.status === MAGIC_SUCCESS) {
            setShowResults(true);
        }
    };

    const handleGetHint = () => {
        setStatus(STATUS_EMPTY);
        let res = null;
        if (selected.charIndex === INDEX_INVALID) {
            // Random hint
            res = CurrentGame.addHint(selected.wordIndex);
        }
        else {
            res = CurrentGame.addHint(selected.wordIndex, selected.charIndex);
        }

        if (res.status === MAGIC_SUCCESS) {
            const newState = { ...state };
            const input = boardRef.current.getElementsByClassName("wordbox")[selected.wordIndex].textContent;
            newState.hints = [...CurrentGame.getHints().data];
            newState.inputs[selected.wordIndex] = input.slice(0, res.data.index) + res.data.hint + input.slice(res.data.index + 1);
            setState(newState);
        }
        else {
            setStatus(res);
        }
    };

    const handleClear = () => {
        setStatus(STATUS_EMPTY);
        const newState = { ...state };
        newState.inputs = [...newState.hints];
        setState(newState);
    };

    const handleKey = (e) => {
        setStatus(STATUS_EMPTY);
        // console.log(`${e.key} ${selected.wordIndex} ${selected.charIndex}`);
        const key = e.key.toUpperCase();
        let wordIndex = selected.wordIndex;
        let charIndex = selected.charIndex;

        // Check out of range
        if (wordIndex === INDEX_INVALID) {
            return;
        }
        if (charIndex >= mode.wordLen || charIndex < 0) {
            // Special cases
            if (key.length === 1 && charIndex === INDEX_INVALID) {
                // Auto set to 0 if char not selected
                charIndex = 0;
            }
            else if (key === 'ENTER') {
                // Ignore char index for word check
            }
            else {
                return;
            }
        }

        const newInputs = [...state.inputs];
        const newInput = newInputs[wordIndex].split('');
        const hint = state.hints[wordIndex];

        if (key.length === 1) {
            // Only set char if index is within range and hint not exist
            if (charIndex < mode.wordLen && hint[charIndex] === ' ') {
                newInput[charIndex] = key;
                newInputs[wordIndex] = newInput.join('');
                setState((prev) => ({ ...prev, inputs: newInputs }));
            }
            if (charIndex < (mode.wordLen - 1)) {
                charIndex++;
            }
            else if (charIndex === (mode.wordLen - 1)) {
                if (wordIndex < (mode.noOfWords - 1)) {
                    charIndex = 0;
                    wordIndex++;
                }
            }
        }
        else if (key === 'DELETE' || key === 'BACKSPACE') {
            // Skip deleting hints
            if (hint[charIndex] === ' ') {
                newInput[charIndex] = ' ';
                newInputs[wordIndex] = newInput.join('');
                setState((prev) => ({ ...prev, inputs: newInputs }));
            }
            if (key === 'BACKSPACE') {
                if (charIndex > 0) {
                    charIndex--;
                } 
                else if (charIndex === 0) {
                    if (wordIndex > 0) {
                        charIndex = mode.wordLen - 1;
                        wordIndex--;
                    }
                }
            }
        }
        else if (key === 'ENTER') {
            handleCheckWord(wordIndex, newInput.join(''));
        }
        else if (key === 'ARROWLEFT') {
            if (charIndex > 0) {
                charIndex--;
            } 
            else if (charIndex === 0) {
                if (wordIndex > 0) {
                    charIndex = mode.wordLen - 1;
                    wordIndex--;
                }
            }
        }
        else if (key === 'ARROWRIGHT') {
            if (charIndex < (mode.wordLen - 1)) {
                charIndex++;
            }
            else if (charIndex === (mode.wordLen - 1)) {
                if (wordIndex < (mode.noOfWords - 1)) {
                    charIndex = 0;
                    wordIndex++;
                }
            }
        }
        else if (key === 'ARROWUP') {
            if (wordIndex > 0) wordIndex--;
        }
        else if (key === 'ARROWDOWN') {
            if (wordIndex < (mode.noOfWords - 1)) wordIndex++;
        }
        setSelected({ wordIndex: wordIndex, charIndex: charIndex });
    };

    const dispatchKey = (key) => {
        const kbEvent = new KeyboardEvent('keydown_buttons', { key: key });
        boardRef.current.dispatchEvent(kbEvent);
    };

    useEffect(() => {
        const currentRef = boardRef.current;
        currentRef.addEventListener('keydown_buttons', handleKey);
        return () => {
            currentRef.removeEventListener('keydown_buttons', handleKey);
        }
    }, [handleKey]);

    return (
        <div className="container board">
            <div tabIndex={0} className="board-panel" ref={boardRef} onKeyDown={handleKey}>
                {state.inputs.map(
                    (a, i) =>
                        <WordBox
                            key={i}
                            wordIndex={i}
                            mode={mode}
                            state={state}
                            selected={selected}
                            setSelected={setSelected}
                        />
                )}
            </div>
            <div className="board-control">
                <div className="board-status">{`${status.data}`}</div>
                <ControlButtons
                    onClickClear={handleClear}
                    onClickHint={handleGetHint}
                    onClickSubmit={handleSolve}
                    onClickValid={() => dispatchKey("ENTER")}
                    onClickBackspace={() => dispatchKey("BACKSPACE")}
                />
                <KeyButtons keys={keys} boardRef={boardRef} />
            </div>
            <Suspense>
                <ResultsDialog show={showResults} inputs={state.inputs} dismiss={() => setShowResults(false)} />
            </Suspense>
        </div>
    );
};

const ControlButtons = ({ onClickClear, onClickHint, onClickSubmit, onClickValid, onClickBackspace }) => {
    const handleClear = useLongPress(onClickClear, onClickBackspace);
    const handleSubmit = useLongPress(onClickSubmit, onClickValid);
    
    return (
        <div>
            <i className="fa-solid fa-2x fa-square-h board-icon-button" onClick={onClickHint} onMouseDown={e => e.preventDefault()}></i>
            <i className="fa-regular fa-2x fa-circle-check board-icon-button" {...handleSubmit}></i>
            <i className="fa-solid fa-2x fa-left-long board-icon-button" {...handleClear}></i>
        </div>
    );
};

export default memo(Board);