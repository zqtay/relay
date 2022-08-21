import './App.css';

import React, { useState, useRef } from 'react';

import Game from "./game/game";
import TitleBar from './components/UI/TitleBar';

const game = new Game();

function App() {
  const [currInputs, setCurrInputs] = useState([]);
  const [status, setStatus] = useState({res:null, data:null});
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
