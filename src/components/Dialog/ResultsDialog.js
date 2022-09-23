import "./ResultsDialog.css";

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Dialog from "../UI/Dialog";
import LoadingButton from "../UI/LoadingButton";

import { Game, CurrentGame } from "../../game/Game";
import { MAGIC_SUCCESS } from "../../game/GameConst";

const BUTTON_CONFIRM_DELAY = 500; // ms

const ResultsDialog = ({ show, inputs, dismiss }) => {
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setStatus("");
        setIsLoading(false);
    }, [show]);

    const handleNewPuzzle = () => {
        setStatus("");
        setIsLoading(true);
        setTimeout(() => {
            const settings = {mode: CurrentGame.getMode().data};
            const game = new Game();
            game.genPuzzleAsync(settings).then(
                (res) => {
                    if (res.status === MAGIC_SUCCESS) {
                        res = game.getEncodedFromSettings();
                        if (res.status === MAGIC_SUCCESS) {
                            dismiss();
                            navigate(`/?puzzle=${res.data}`, { replace: true });
                            return;
                        }
                    }
                    setIsLoading(false);
                }
            );
        }, BUTTON_CONFIRM_DELAY);
    };

    return (
        <Dialog
            show={show}
            icon="fa-trophy"
            title="Success"
            content={<ResultsContent show={show} inputs={inputs} setStatus={setStatus} />}
            btnConfirm={<LoadingButton className="modal-confirm-button" onClick={handleNewPuzzle} isLoading={isLoading} text="New puzzle" />}
            status={status}
            dismiss={dismiss}
        />
    );
};

const checkAltSolution = (inputs, solution) => {
    if (inputs === null || solution === null || solution.length === 0) {
        return [false, null];
    }
    let isAltSolution = false;
    let solutionText = inputs.map((v, i) => {
        let text = solution[i];
        if (v !== text) {
            isAltSolution = true;
            text = <b>{text}</b>;
        } else {
            text = <>{text}</>;
        }
        return (i === 0) ? <>{text}</> : <>, {text}</>;
    });
    return [isAltSolution, solutionText];
};

const ResultsContent = ({ show, inputs, setStatus }) => {
    let puzzleUrl = "";
    let solution = [];
    if (show) {
        puzzleUrl = window.location.origin.toString() + "/relay/#/?puzzle=" + CurrentGame.getEncodedFromSettings().data;
        solution = CurrentGame.getSolution().data;
    }

    const [isAltSolution, solutionText] = checkAltSolution(inputs, solution);
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
            <div className="fs-4">
                You have solved this puzzle{!isAltSolution && '!'}
            </div>
            <div className="">
                {isAltSolution && '... and found an alternate solution!'}
            </div>
            <hr></hr>
            {isAltSolution && (
                <>
                    <div className="text-start fw-semibold">Original solution: </div>
                    <div>{solutionText}</div>
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

export default ResultsDialog;