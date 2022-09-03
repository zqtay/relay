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

    function handleWordInput(e) {
        setStatus(CurrentGame.setInput(e));
        setCurrState(CurrentGame.getState().data);
    }

    function handleButton() {
        setStatus(CurrentGame.validateAll());
    }

    function handleButton2() {
        setStatus(CurrentGame.getSolution());
    }

    function handleButton3() {
        setStatus(CurrentGame.addRandomHint());
        setCurrState(CurrentGame.getState().data);
    }

    return (
        <div className="container">
            <div className="board" ref={boardRef}>
                {CurrentGame.getInputs().data.map(
                    (a, i) =>
                        <WordBox
                            key={i}
                            wordIndex={i}
                            mode={currMode}
                            state={currState}
                            setStep={(i) => CurrentGame.setStep(i)}
                            submit={handleWordInput}
                        />
                )}
            </div>
            <div>{`${currKeys}`}</div>
            <div>{`${currState.inputs}`}</div>
            <div>{`${status.data}`}</div>
            <div>
                <KeyButtons keys={currKeys} boardRef={boardRef} currWordIndex={currState.step}/>
            </div>
            <div className="btn btn-lg btn-secondary mx-2" onClick={handleButton3}>Hint</div>
            <div className="btn btn-lg board-button mx-2" onClick={handleButton} onDoubleClick={handleButton2}>Submit</div>
        </div>
    );
};

export default memo(Board);