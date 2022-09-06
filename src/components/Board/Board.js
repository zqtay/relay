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
    const [currSelected, setCurrSelected] = useState({wordIndex: -1, charIndex: -1});
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

    const handleSubmit = () => {
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
            const newState = {...currState};
            const input = boardRef.current.getElementsByClassName("wordbox")[currSelected.wordIndex].textContent;
            newState.hints = [...CurrentGame.getHints().data];
            newState.inputs[currSelected.wordIndex] = input.slice(0, res.data.index) + res.data.hint + input.slice(res.data.index + 1);
            setCurrState(newState);
        }
        else {
            setStatus(res);
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    return (
        <div className="container board">
            <div className="board-panel" ref={boardRef}>
                {currState.inputs.map(
                    (a, i) =>
                        <WordBox
                            key={i}
                            wordIndex={i}
                            mode={currMode}
                            state={currState}
                            setSelected={setCurrSelected}
                            submit={handleWordInput}
                        />
                )}
            </div>
            <div className="board-control">
                <div>{`${status.data}`}</div>
                <KeyButtons keys={currKeys} boardRef={boardRef} currWordIndex={currSelected.wordIndex} />
                <div className="btn board-button board-hint-button" onClick={handleGetHint} onMouseDown={handleMouseDown}>Hint</div>
                <div className="btn board-button board-submit-button" onClick={handleSubmit} onDoubleClick={handleSolve} onMouseDown={handleMouseDown}>Submit</div>
            </div>
        </div>
    );
};

export default memo(Board);