import './App.css';

import React, { useState, useRef } from 'react';

import Game from "./game/Game";
import TitleBar from './components/UI/TitleBar';
import Dialog from './components/UI/Dialog';

const game = new Game();

function App() {
    const [currInputs, setCurrInputs] = useState([]);
  const [status, setStatus] = useState({res:null, data:null});
    const [showDialog, setShowDialog] = useState(false);
    const inputRef = useRef(null);

    function handleClick() {
        setStatus(game.process(inputRef.current.value));
        setCurrInputs(game.getCurrInputs().data);
        inputRef.current.value = "";
    }

    function handleEnter(e) {
    if(e.key === 'Enter') {
            handleClick();
        }
    }

    return (
        <div className="App">
            <header>
        <TitleBar title="Relay" onClickHandlers={{info:null, newGame:null, settings:null}} />
            </header>
      <button type="button" className="btn btn-primary" onClick={() => setShowDialog(true)} >
        Launch demo modal
      </button>
      <Dialog show={showDialog} title="info" content="content" btnConfirm={{name:"Confirm", onClick: () => setShowDialog(false)}} dismiss={() => setShowDialog(false)} />
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
