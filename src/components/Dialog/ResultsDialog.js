import "./ResultsDialog.css";

import { useEffect, useState } from "react";

import Dialog from "../UI/Dialog";
import { CurrentGame } from "../../game/Game";

const ResultsDialog = ({ show, inputs, dismiss }) => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setStatus(null);
    }, [show]);

    // Only render ResultsContent if show is true
    return (
        <Dialog
            show={show}
            icon="fa-trophy"
            title="Success"
            content={show && <ResultsContent inputs={inputs} solution={CurrentGame.getSolution().data} setStatus={setStatus} />}
            btnConfirm={<ButtonConfirm onClick={dismiss} />}
            status={status}
            dismiss={dismiss}
        />
    );
};

const checkAltSolution = (inputs, solution) => {
    return !inputs.every((v, i) => v === solution[i]);
};

const ResultsContent = ({ inputs, solution, setStatus }) => {
    const puzzleUrl = window.location.origin.toString() + "/#/?puzzle=" + CurrentGame.getEncodedFromSettings().data;
    const isAltSolution = checkAltSolution(inputs, solution);
    const onClickShare = () => {
        const status = (
            <>
                <i className="fa-solid fa-md fa-circle-check modal-status"></i>
                <span className="me-auto modal-status">Link copied</span>
            </>
        );
        navigator.clipboard.writeText(puzzleUrl);
        setStatus(status);
    };

    return (
        <>
            <div className="fs-3">
                You have solved this puzzle{isAltSolution && ` and found an alternate solution`}!
            </div>
            <hr></hr>
            {isAltSolution && (
                <>
                    <div className="text-start fw-semibold">Original solution: </div>
                    <div><b>{`${solution.join(', ')}`}</b></div>
                    <hr></hr>
                </>
            )}
            <div>
                <div className="text-start fw-semibold">
                    Share this puzzle:
                </div>
                <div className="d-flex align-items-center mt-2">
                    <input className="form-control" type="text" value={puzzleUrl} readOnly></input>
                    <span className="fa-lg ms-2" onClick={onClickShare}>
                        <i className="fa-solid fa-link results-dialog-button"></i>
                    </span>
                </div>
            </div>
        </>
    );
};

const ButtonConfirm = ({ onClick }) => {
    return (
        <button type="button" className="btn btn-primary modal-confirm-button" onClick={onClick}>
            OK
        </button>
    );
};

export default ResultsDialog;