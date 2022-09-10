import "./Board.css"

import { lazy, Suspense, useEffect, useRef, useState, memo } from 'react';
import { useSearchParams } from 'react-router-dom';

import WordBox from "./WordBox";
import KeyButtons from "./KeyButtons";

import { CurrentGame } from "../../game/Game";
import { MAGIC_SUCCESS, MODE_EMPTY, STATE_EMPTY } from "../../game/GameConst";

const ResultsDialog = lazy(() => import("../Dialog/ResultsDialog"));
const Board = (props) => {
    const [mode, setMode] = useState(MODE_EMPTY);
    const [state, setState] = useState(STATE_EMPTY);
    const [keys, setKeys] = useState([]);
    const [selected, setSelected] = useState({ wordIndex: -1, charIndex: -1 });
    const [status, setStatus] = useState({ res: null, data: "" });
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
    }, [searchParams]);

    const handleWordInput = (wordIndex, input) => {
        let res = CurrentGame.validateInput(wordIndex, input);
        setStatus(res);
    };

    const handleSolve = () => {
        let inputs = Array.from(boardRef.current.getElementsByClassName("wordbox")).map(e => e.textContent);
        let res = CurrentGame.validateAll(inputs);
        setStatus(res);
        if (res.status === MAGIC_SUCCESS) {
            setShowResults(true);
        }
    };

    const handleGetHint = () => {
        let res = null;
        if (selected.charIndex === -1) {
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
        const newState = { ...state };
        newState.inputs = [...newState.hints];
        setState(newState);
    };

    const handleKey = (e) => {
        setStatus({ res: null, data: "" });
        // console.log(`${e.key} ${wordIndex} ${selectedCharIndex} ${charArray}`);
        let wordIndex = selected.wordIndex;
        let charIndex = selected.charIndex;
        if (charIndex >= mode.wordLen || charIndex < 0) return;

        const key = e.key.toUpperCase();
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
            if (charIndex < mode.wordLen - 1) charIndex++;
        }
        else if (key === 'DELETE' || key === 'BACKSPACE') {
            // Skip deleting hints
            if (hint[charIndex] === ' ') {
                newInput[charIndex] = ' ';
                newInputs[wordIndex] = newInput.join('');
                setState((prev) => ({ ...prev, inputs: newInputs }));
            }
            if (key === 'BACKSPACE' && charIndex > 0) charIndex--;
        }
        else if (key === 'ENTER') {
            handleWordInput(wordIndex, newInput.join(''));
        }
        else if (key === 'ARROWLEFT') {
            if (charIndex > 0) charIndex--;
        }
        else if (key === 'ARROWRIGHT') {
            if (charIndex < (mode.wordLen - 1)) charIndex++;
        }
        else if (key === 'ARROWUP') {
            if (wordIndex > 0) wordIndex--;
        }
        else if (key === 'ARROWDOWN') {
            if (wordIndex < (mode.noOfWords - 1)) wordIndex++;
        }
        setSelected({ wordIndex: wordIndex, charIndex: charIndex });
    };

    const dispatchKey = (key, e) => {
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
                <div>
                    <ControlButtons onClickClear={handleClear} onClickHint={handleGetHint} onClickSubmit={handleSolve} />
                    <ControlButtons2 onClickValid={(e) => dispatchKey("ENTER", e)} onClickBackspace={(e) => dispatchKey("BACKSPACE", e)} />
                </div>
                <KeyButtons keys={keys} boardRef={boardRef} />
            </div>
            <Suspense>
                <ResultsDialog show={showResults} inputs={state.inputs} dismiss={() => setShowResults(false)} />
            </Suspense>
        </div>
    );
};

const ControlButtons = ({ onClickClear, onClickHint, onClickSubmit }) => {
    return (
        <>
            <span className="fa-2x" onClick={onClickClear} onMouseDown={handleMouseDown}>
                <i className="fa-solid fa-rotate-right board-icon-button"></i>
            </span>
            <span className="fa-2x" onClick={onClickHint} onMouseDown={handleMouseDown}>
                <i className="fa-solid fa-square-h board-icon-button"></i>
            </span>
            <span className="fa-2x" onClick={onClickSubmit} onMouseDown={handleMouseDown}>
                <i className="fa-regular fa-circle-check board-icon-button"></i>
            </span>
        </>
    );
};

const ControlButtons2 = ({ onClickValid, onClickBackspace }) => {
    return (
        <>
            <span className="fa-2x" onClick={onClickValid} onMouseDown={handleMouseDown}>
                <i className="fa-solid fa-spell-check board-icon-button"></i>
            </span>
            <span className="fa-2x" onClick={onClickBackspace} onMouseDown={handleMouseDown}>
                <i className="fa-solid fa-left-long board-icon-button"></i>
            </span>
        </>
    );
};

const handleMouseDown = (e) => {
    e.preventDefault();
};

export default memo(Board);