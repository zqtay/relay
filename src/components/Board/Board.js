import "./Board.css"

import { useEffect, useRef, useState, memo } from 'react';
import { useSearchParams } from 'react-router-dom';

import WordBox from "./WordBox";
import KeyButtons from "./KeyButtons";

import { CurrentGame } from "../../game/Game";
import { MAGIC_SUCCESS, MODE_EMPTY, STATE_EMPTY } from "../../game/GameConst";

const Board = (props) => {
    const [currMode, setCurrMode] = useState(MODE_EMPTY);
    const [currState, setCurrState] = useState(STATE_EMPTY);
    const [currKeys, setCurrKeys] = useState([]);
    const [currSelected, setCurrSelected] = useState({ wordIndex: -1, charIndex: -1 });
    const [status, setStatus] = useState({ res: null, data: "" });
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
        setCurrMode(CurrentGame.getMode().data);
        setCurrState(res.data);
        setCurrKeys(CurrentGame.getKeys().data);
    }, [searchParams]);

    const handleWordInput = (wordIndex, input) => {
        let res = CurrentGame.validateInput(wordIndex, input);
        setStatus(res);
    };

    const handleValidateInput = () => {
        if (currSelected.wordIndex < 0 || currSelected.wordIndex >= currMode.noOfWords) return;
        const input = boardRef.current.getElementsByClassName("wordbox")[currSelected.wordIndex].textContent;
        let res = CurrentGame.validateInput(currSelected.wordIndex, input);
        setStatus(res);
    };

    const handleSolve = () => {
        let inputs = Array.from(boardRef.current.getElementsByClassName("wordbox")).map(e => e.textContent);
        setStatus(CurrentGame.validateAll(inputs));
    };

    const handleGetHint = () => {
        let res = null;
        if (currSelected.charIndex === -1) {
            // Random hint
            res = CurrentGame.addHint(currSelected.wordIndex);
        }
        else {
            res = CurrentGame.addHint(currSelected.wordIndex, currSelected.charIndex);
        }

        if (res.status === MAGIC_SUCCESS) {
            const newState = { ...currState };
            const input = boardRef.current.getElementsByClassName("wordbox")[currSelected.wordIndex].textContent;
            newState.hints = [...CurrentGame.getHints().data];
            newState.inputs[currSelected.wordIndex] = input.slice(0, res.data.index) + res.data.hint + input.slice(res.data.index + 1);
            setCurrState(newState);
        }
        else {
            setStatus(res);
        }
    };

    const handleClear = () => {
        const newState = {...currState};
        newState.inputs = [...newState.hints];
        setCurrState(newState);
    };

    const handleKey = (e) => {
        // console.log(`${e.key} ${wordIndex} ${selectedCharIndex} ${charArray}`);
        let wordIndex = currSelected.wordIndex;
        let charIndex = currSelected.charIndex;
        if (charIndex >= currMode.wordLen || charIndex < 0) return;

        const key = e.key.toUpperCase();
        const newInputs = [...currState.inputs];
        const newInput = newInputs[wordIndex].split('');
        const hint = currState.hints[wordIndex];
        if (key.length === 1) {
            // Only set char if index is within range and hint not exist
            if (charIndex < currMode.wordLen && hint[charIndex] === ' ') {
                newInput[charIndex] = key;
                newInputs[wordIndex] = newInput.join('');
                setCurrState((prev) => ({ ...prev, inputs: newInputs }));
            }
            if (charIndex < currMode.wordLen - 1) charIndex++;
        }
        else if (key === 'DELETE' || key === 'BACKSPACE') {
            // Skip deleting hints
            if (hint[charIndex] === ' ') {
                newInput[charIndex] = ' ';
                newInputs[wordIndex] = newInput.join('');
                setCurrState((prev) => ({ ...prev, inputs: newInputs }));
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
            if (charIndex < (currMode.wordLen - 1)) charIndex++;
        }
        else if (key === 'ARROWUP') {
            if (wordIndex > 0) wordIndex--;
        }
        else if (key === 'ARROWDOWN') {
            if (wordIndex < (currMode.noOfWords - 1)) wordIndex++;;
        }
        setCurrSelected({ wordIndex: wordIndex, charIndex: charIndex });
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
                {currState.inputs.map(
                    (a, i) =>
                        <WordBox
                            key={i}
                            wordIndex={i}
                            mode={currMode}
                            state={currState}
                            selected={currSelected}
                            setSelected={setCurrSelected}
                        />
                )}
            </div>
            <div className="board-control">
                <div>{`${status.data}`}</div>
                <ControlButtons onClickClear={handleClear} onClickHint={handleGetHint} onClickValidate={handleValidateInput}/>
                <KeyButtons keys={currKeys} boardRef={boardRef}/>
                <div className="btn board-button board-submit-button" onClick={handleSolve} onMouseDown={handleMouseDown}>Submit</div>
            </div>
        </div>
    );
};

const ControlButtons = ({onClickClear, onClickHint, onClickValidate}) => {
    return (
        <div> 
            <span className="fa-2x" onClick={onClickClear} onMouseDown={handleMouseDown}>
                <i className="fa-solid fa-rotate-right board-icon-button"></i>
            </span>
            <span className="fa-2x" onClick={onClickHint} onMouseDown={handleMouseDown}>
                <i className="fa-solid fa-square-h board-icon-button"></i>
            </span>
            <span className="fa-2x" onClick={onClickValidate} onMouseDown={handleMouseDown}>
                <i className="fa-regular fa-circle-check board-icon-button"></i>
            </span>
        </div>
    );
};

const handleMouseDown = (e) => {
    e.preventDefault();
};

export default memo(Board);