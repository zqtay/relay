import "./Board.css"

import { useEffect, useRef, useState, memo } from 'react';
import { useSearchParams } from 'react-router-dom';

import WordBox from "./WordBox";
import KeyButtons from "./KeyButtons";

import { CurrentGame } from "../../game/Game";
import { MODE_EMPTY, STATE_EMPTY } from "../../game/GameConst";

const Board = (props) => {
    const [currMode, setCurrMode] = useState(MODE_EMPTY);
    const [currState, setCurrState] = useState(STATE_EMPTY);
    const [currKeys, setCurrKeys] = useState([]);
    const [status, setStatus] = useState({ res: null, data: "" });
    const [searchParams, setSearchParams] = useSearchParams();
    const boardRef = useRef(null);

    useEffect(() => {
        let puzzleSettings = searchParams.get("puzzle");
        if (puzzleSettings !== null) {
            CurrentGame.genPuzzleFromEncoded(puzzleSettings);
        }
        else {
            // Random puzzle with default settings
            CurrentGame.genPuzzle();
        }
        setCurrMode(CurrentGame.getMode().data);
        setCurrState(CurrentGame.getState().data);
        setCurrKeys(CurrentGame.getKeys().data);
    }, [searchParams]);

    const setStep = (step) => {
        setStatus(CurrentGame.setStep(step));
        setCurrState(CurrentGame.getState().data);
    };

    const handleWordInput = (input) => {
        setStatus(CurrentGame.setInput(input));
        setCurrState(CurrentGame.getState().data);
    };

    const handleSubmit = () => {
        const input = boardRef.current.getElementsByClassName("wordbox")[currState.step].textContent;
        setStatus(CurrentGame.setInput(input));
        setCurrState(CurrentGame.getState().data);
    };

    const handleSolve = () => {
        setStatus(CurrentGame.validateAll());
    };

    const handleGetSolution = () => {
        setStatus(CurrentGame.getSolution());
    };

    const handleGetHint = () => {
        setStatus(CurrentGame.addHint());
        setCurrState(CurrentGame.getState().data);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    return (
        <div className="container board">
            <div className="board-panel" ref={boardRef}>
                {CurrentGame.getInputs().data.map(
                    (a, i) =>
                        <WordBox
                            key={i}
                            wordIndex={i}
                            mode={currMode}
                            state={currState}
                            setStep={setStep}
                            submit={handleWordInput}
                        />
                )}
            </div>
            <div className="board-control">
                <div>{`${status.data}`}</div>
                <KeyButtons keys={currKeys} boardRef={boardRef} currWordIndex={currState.step} />
                <div className="btn board-button board-hint-button" onClick={handleGetHint} onMouseDown={handleMouseDown}>Hint</div>
                <div className="btn board-button board-submit-button" onClick={handleSubmit} onDoubleClick={handleSolve} onMouseDown={handleMouseDown}>Submit</div>
            </div>
        </div>
    );
};

export default memo(Board);