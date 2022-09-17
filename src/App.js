import './App.css';

import { lazy, Suspense, useState } from 'react';

import TitleBar from './components/UI/TitleBar';
import BoardSpinner from './components/Board/BoardSpinner';

const InfoDialog = lazy(() => import('./components/Dialog/InfoDialog'));
const NewPuzzleDialog = lazy(() => import('./components/Dialog/NewPuzzleDialog'));
const Board = lazy(() => import('./components/Board/Board'));

function App() {
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showNewPuzzleDialog, setShowNewPuzzleDialog] = useState(false);

    return (
        <div className="App">
            <header className='sticky-top shadow-sm'>
                <TitleBar title="Relay" onClickHandlers={{ info: () => setShowInfoDialog(true) , newGame: () => setShowNewPuzzleDialog(true)}} />
            </header>
            <Suspense>
                <InfoDialog show={showInfoDialog} dismiss={() => setShowInfoDialog(false)} />
            </Suspense>
            <Suspense>
                <NewPuzzleDialog show={showNewPuzzleDialog} dismiss={() => setShowNewPuzzleDialog(false)} />
            </Suspense>
            <Suspense fallback={<BoardSpinner />}>
                <Board />
            </Suspense>
        </div>
    );
}

export default App;
