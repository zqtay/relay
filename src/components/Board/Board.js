import { useEffect, useState, useRef, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CurrentGame } from "../../game/Game";

const Board = (props) => {
    const [currInputs, setCurrInputs] = useState([]);
    const [status, setStatus] = useState({ res: null, data: null });
    const inputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    let puzzleSettings = null

    useEffect(() => {
        if ((puzzleSettings = searchParams.get("puzzle")) !== null) {
            CurrentGame.genPuzzleFromEncoded(puzzleSettings);
        }
        else {
            // Random puzzle with default settings
            CurrentGame.genPuzzle();
        }
        setCurrInputs(CurrentGame.getInputs().data);
    }, []);

    function handleClick() {
        setStatus(CurrentGame.process(inputRef.current.value));
        setCurrInputs(CurrentGame.getInputs().data);
        inputRef.current.value = "";
    }

    function handleEnter(e) {
        if (e.key === 'Enter') {
            handleClick();
        }
    }

    return (
        <div>
            <div>{CurrentGame.getKeys().data}</div>
            <div>{`${currInputs}`}</div>
            <div>{`${status.data}`}</div>
            <div>
                <input
                    ref={inputRef}
                    type="text"
                    id="message"
                    name="message"
                    onKeyDown={handleEnter}
                />
            </div>
            <button onClick={handleClick}>Submit</button>
        </div>
    );
};

export default memo(Board);