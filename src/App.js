import './App.css';

import { lazy, Suspense, useState } from 'react';

import TitleBar from './components/UI/TitleBar';
import BoardSpinner from './components/Board/BoardSpinner';

const NewPuzzleDialog = lazy(() => import('./components/Dialog/NewPuzzleDialog'));
const Board = lazy(() => import('./components/Board/Board'));

function App() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className="App">
            <header className='sticky-top shadow-sm'>
                <TitleBar title="Relay" onClickHandlers={{ info: null , newGame: () => setShowDialog(true)}} />
            </header>
            <Suspense>
                <NewPuzzleDialog show={showDialog} dismiss={() => setShowDialog(false)} />
            </Suspense>
            <Suspense fallback={<BoardSpinner />}>
                <Board />
            </Suspense>
        </div>
    );
}

export default App;
