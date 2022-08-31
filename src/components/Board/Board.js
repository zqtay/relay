import "./Board.css"

import { useEffect, useState, useRef, memo } from 'react';
import { useSearchParams } from 'react-router-dom';

import WordBox from "./WordBox";

import { CurrentGame } from "../../game/Game";

const Board = (props) => {
    const [currInputs, setCurrInputs] = useState([]);
    const [status, setStatus] = useState({ res: null, data: null });
    const [searchParams, _] = useSearchParams();
    const inputRef = useRef(null);

    useEffect(() => {
        let puzzleSettings = searchParams.get("puzzle");
        if (puzzleSettings !== null) {
            CurrentGame.genPuzzleFromEncoded(puzzleSettings);
        }
        else {
            // Random puzzle with default settings
            CurrentGame.genPuzzle();
        }
        setCurrInputs(CurrentGame.getInputs().data);
    }, [searchParams]);

    function handleEnter(e) {
        setStatus(CurrentGame.setInput(e));
        setCurrInputs(CurrentGame.getInputs().data);
    }

    function handleInput(e) {
        if (e.key === 'Enter') {
            setStatus(CurrentGame.process(inputRef.current.value));
            setCurrInputs(CurrentGame.getInputs().data);
            inputRef.current.value = '';
        }
    }

    function handleButton() {
        setStatus(CurrentGame.validateAll());
    }

    function handleButton2() {
        setStatus(CurrentGame.getSolution());
    }

    return (
        <div className="container">
            <div className="board">
                {CurrentGame.getInputs().data.map(
                    (a, i) =>
                        <WordBox
                            key={i}
                            word={currInputs[i]}
                            hint={CurrentGame.getHints().data[i]}
                            wordLen={CurrentGame.getMode().data.wordLen}
                            select={() => CurrentGame.setStep(i)}
                            submit={handleEnter}
                        />
                )}
            </div>
            <div>{CurrentGame.getKeys().data}</div>
            <div>{`${currInputs}`}</div>
            <div>{`${status.data}`}</div>
            <div className="btn btn-lg board-button" onClick={handleButton} onDoubleClick={handleButton2}>Submit</div>
            {/* <div className="pt-2">
                    <input
                        ref={inputRef}
                        type="text"
                        id="message"
                        name="message"
                        onKeyDown={handleInput}
                    />
                </div> */}

        </div>
    );
};

export default memo(Board);