import './App.css';

import React, { useState, useRef } from 'react';

import Game from "./game/Game";
import TitleBar from './components/UI/TitleBar';
import NewPuzzleDialog from './components/Dialog/NewPuzzleDialog';

const game = new Game();

function App() {
    const [currInputs, setCurrInputs] = useState([]);
    const [status, setStatus] = useState({ res: null, data: null });
    const [showDialog, setShowDialog] = useState(false);
    const inputRef = useRef(null);

    function handleClick() {
        setStatus(game.process(inputRef.current.value));
        setCurrInputs(game.getCurrInputs().data);
        inputRef.current.value = "";
    }

    function handleEnter(e) {
        if (e.key === 'Enter') {
            handleClick();
        }
    }

    return (
        <div className="App">
            <header>
                <TitleBar title="Relay" onClickHandlers={{ info: null, newGame: () => setShowDialog(true), settings: null }} />
            </header>
            <NewPuzzleDialog show={showDialog} btnConfirm={{name:"OK", onClick: () => {inputRef.current.value = "g"; handleClick(); setShowDialog(false);}}} dismiss={() => setShowDialog(false)} />
            <div>
                <div>{game.getHints().data}</div>
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
        </div>
    );
}

export default App;
