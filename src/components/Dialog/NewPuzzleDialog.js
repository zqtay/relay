import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Dialog from "../UI/Dialog";
import Slider from "../UI/Slider";

import { Game, CurrentGame } from "../../game/Game";
import {
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
const BUTTON_CONFIRM_DELAY = 500; // ms

const game = new Game();

const NewPuzzleDialog = ({ show, dismiss }) => {
    const inputWordLengthRef = useRef(null);
    const inputOverlapLengthRef = useRef(null);
    const inputNoOfWordsRef = useRef(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setStatus(null);
        setIsLoading(false);
        inputWordLengthRef.current.defaultValue = CurrentGame.getMode().data.wordLen;
        inputOverlapLengthRef.current.defaultValue = CurrentGame.getMode().data.overlapLen;
        inputNoOfWordsRef.current.defaultValue = CurrentGame.getMode().data.maxSteps;
    }, [show]);

    const content =
        <Settings
            inputWordLengthRef={inputWordLengthRef}
            inputOverlapLengthRef={inputOverlapLengthRef}
            inputNoOfWordsRef={inputNoOfWordsRef}
        />;

    const btnConfirmOnClick = () => {
        setIsLoading(true);
        const settings = {
            mode: {
                wordLen: inputWordLengthRef.current.value,
                overlapLen: inputOverlapLengthRef.current.value,
                noOfWords: inputNoOfWordsRef.current.value
            }
        };
        setTimeout(() => {
            game.genPuzzleAsync(settings).then(
                (res) => {
                    if (res.status === MAGIC_SUCCESS) {
                        res = game.getEncodedFromSettings();
                        if (res.status === MAGIC_SUCCESS) {
                            dismiss();
                            navigate(`/?puzzle=${res.data}`, { replace: true });
                            window.location.reload();
                            return;
                        }
                    }
                    setStatus(<StatusError text={res.data} />);
                    setIsLoading(false);
                }
            );
        }, BUTTON_CONFIRM_DELAY);
    }

    const btnCancelOnClick = () => {
        setStatus(null);
        dismiss();
    }

    return (
        <Dialog
            show={show}
            icon="fa-dice"
            title="New Puzzle"
            content={content}
            status={status}
            btnCancel={<ButtonCancel onClick={btnCancelOnClick} />}
            btnConfirm={<ButtonConfirm onClick={btnConfirmOnClick} isLoading={isLoading} />}
            dismiss={dismiss}
        />
    );
}

const Settings = ({ inputWordLengthRef, inputOverlapLengthRef, inputNoOfWordsRef, dvWordLength, dvOverlapLength, dvNoOfWords }) => {
    return (
        <div className="">
            <Slider title="Word length" id={ID_INPUT_WORD_LENGTH} min={MIN_WORD_LENGTH} max={MAX_WORD_LENGTH} _ref={inputWordLengthRef} />
            <hr />
            <Slider title="Overlapping characters" id={ID_INPUT_OVERLAP_LENGTH} min={MIN_OVERLAP_LENGTH} max={MAX_OVERLAP_LENGTH} _ref={inputOverlapLengthRef} />
            <hr />
            <Slider title="Number of words" id={ID_INPUT_NO_OF_WORDS} min={MIN_STEPS} max={MAX_STEPS} _ref={inputNoOfWordsRef} />
        </div>
    );
};

const StatusError = ({ text }) => {
    return (
        <>
            <i className="modal-status-error fa-solid fa-md fa-triangle-exclamation"></i>
            <span className="modal-status-error me-auto">{text}</span>
        </>
    );
};

const ButtonCancel = ({ onClick }) => {
    return (
        <button type="button" className="btn btn-default" onClick={onClick}>Cancel</button>
    );
};

const ButtonConfirm = ({ onClick, isLoading }) => {
    return (
        <button type="button" className="btn btn-primary modal-confirm-button" onClick={onClick} disabled={isLoading}>
            {isLoading && <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
            {isLoading && " Loading... "}
            {!isLoading && "Start"}
        </button>
    );
};

export default NewPuzzleDialog;