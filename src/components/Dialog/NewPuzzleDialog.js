import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Dialog from "../UI/Dialog";
import Slider from "../UI/Slider";

import Game from "../../game/Game";
import {
    WORD_LENGTH_DEFAULT,
    OVERLAP_LENGTH_DEFAULT,
    MAX_STEPS_DEFAULT,
    MIN_WORD_LENGTH, 
    MAX_WORD_LENGTH, 
    MIN_OVERLAP_LENGTH, 
    MAX_OVERLAP_LENGTH, 
    MIN_STEPS, 
    MAX_STEPS,
    MAGIC_SUCCESS
} from "../../game/GameConst"

const ID_INPUT_WORD_LENGTH = "input_wordLength";
const ID_INPUT_OVERLAP_LENGTH = "input_overlapLength";
const ID_INPUT_NO_OF_WORDS = "input_noOfWords";

const game = new Game();

const NewPuzzleDialog = ({ show, dismiss }) => {
    const inputWordLengthRef = useRef(null);
    const inputOverlapLengthRef = useRef(null);
    const inputNoOfWordsRef = useRef(null);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const content = <Settings 
    inputWordLengthRef={inputWordLengthRef} 
    inputOverlapLengthRef={inputOverlapLengthRef} 
    inputNoOfWordsRef={inputNoOfWordsRef} 
    dvWordLength={WORD_LENGTH_DEFAULT} 
    dvOverlapLength={OVERLAP_LENGTH_DEFAULT}
    dvNoOfWords={MAX_STEPS_DEFAULT} />;

    const btnConfirm = {
        name: "Start",
        onClick: async () => {
            const settings = {
                mode: {
                    wordLen: inputWordLengthRef.current.value,
                    overlapLen: inputOverlapLengthRef.current.value,
                    maxSteps: inputNoOfWordsRef.current.value
                }
            };
            let res = await game.genPuzzleAsync(settings);
            if (res.status === MAGIC_SUCCESS) {
                res = game.getEncodedFromSettings();
                if (res.status === MAGIC_SUCCESS) {
                    setStatus(null);
                    dismiss();
                    navigate(`/?puzzle=${res.data}`, { replace: true });
                    window.location.reload();
                    return;
                }
            }
            setStatus(<StatusError text={res.data} />);
        }
    };

    const btnCancel = {
        name: "Cancel",
        onClick: () => {
            setStatus(null);
            dismiss();
        }
    };

    return (
        <Dialog
            show={show}
            icon="fa-dice"
            title="New Puzzle"
            content={content}
            status={status}
            btnCancel={btnCancel}
            btnConfirm={btnConfirm}
            dismiss={dismiss}
        />
    );
}

const Settings = ({inputWordLengthRef, inputOverlapLengthRef, inputNoOfWordsRef, dvWordLength, dvOverlapLength, dvNoOfWords}) => {
    return (
        <div className="">
            <Slider title="Word length" id={ID_INPUT_WORD_LENGTH} min={MIN_WORD_LENGTH} max={MAX_WORD_LENGTH} defaultValue={dvWordLength} _ref={inputWordLengthRef} />
            <hr />
            <Slider title="Overlapping characters" id={ID_INPUT_OVERLAP_LENGTH} min={MIN_OVERLAP_LENGTH} max={MAX_OVERLAP_LENGTH} defaultValue={dvOverlapLength} _ref={inputOverlapLengthRef} />
            <hr />
            <Slider title="Number of words" id={ID_INPUT_NO_OF_WORDS} min={MIN_STEPS} max={MAX_STEPS} defaultValue={dvNoOfWords} _ref={inputNoOfWordsRef} />
        </div>
    );
};

const StatusError = ({text}) => {
    return (
        <>
            <i className="modal-status-error fa-solid fa-md fa-triangle-exclamation"></i>
            <span className="modal-status-error me-auto">{text}</span>
        </>
    );
}

export default NewPuzzleDialog;