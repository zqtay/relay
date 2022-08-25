import './App.css';

import React, { useState } from 'react';

import TitleBar from './components/UI/TitleBar';
import NewPuzzleDialog from './components/Dialog/NewPuzzleDialog';
import Board from './components/Board/Board';

function App() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className="App">
            <header>
                <TitleBar title="Relay" onClickHandlers={{ info: null, newGame: () => setShowDialog(true), settings: null }} />
            </header>
            <NewPuzzleDialog show={showDialog} dismiss={() => setShowDialog(false)} />
            <Board />
        </div>
    );
}

export default App;
