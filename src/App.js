import './App.css';

import React, { useState } from 'react';

import TitleBar from './components/UI/TitleBar';
import NewPuzzleDialog from './components/Dialog/NewPuzzleDialog';
import Board from './components/Board/Board';

function App() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className="App">
            <header className='sticky-top shadow-sm'>
                <TitleBar title="Relay" onClickHandlers={{ info: null , newGame: () => setShowDialog(true)}} />
            </header>
            <NewPuzzleDialog show={showDialog} dismiss={() => setShowDialog(false)} />
            <Board />
        </div>
    );
}

export default App;
