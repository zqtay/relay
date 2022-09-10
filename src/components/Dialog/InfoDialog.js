import "./InfoDialog.css";
import example from "./example.png";

import { memo } from "react";

import Dialog from "../UI/Dialog";

const InfoDialog = ({ show, dismiss }) => {
    return (
        <Dialog
            show={show}
            icon="fa-circle-info"
            title="How To Play"
            content={<InfoContent />}
            btnConfirm={<ButtonConfirm onClick={dismiss} />}
            dismiss={dismiss}
        />
    );
};

const InfoContent = () => {
    return (
        <div className="">
            <div className="info-dialog-image-container">
                <img className="info-dialog-image" src={example} />
            </div>
            <ul className="info-dialog-text">
                <li>
                    Fill in the blanks with the <b>given alphabets</b>.
                </li>
                <li>
                    The <b>end</b> of the current word must <b>match</b> with the <b>start</b> of the next word.
                </li>
                <li>
                    Use <b>hints</b> if you are stuck!
                </li>
            </ul>
            <hr></hr>
            <div className="row info-dialog-text">
                <div className="col">
                    <ButtonGuide icon="fa-solid fa-rotate-right" text={<><b>Clear</b> board</>}/>
                    <ButtonGuide icon="fa-solid fa-square-h" text={<><b>Reveal</b> hint</>}/>
                    <ButtonGuide icon="fa-solid fa-circle-check" text={<><b>Submit</b> solution</>}/>
                </div>
                <div className="col">
                    <ButtonGuide icon="fa-solid fa-spell-check" text={<><b>Check</b> current word</>}/>
                    <ButtonGuide icon="fa-solid fa-left-long" text={<><b>Backspace</b></>}/>
                </div>
            </div>
        </div>
    );
};

const ButtonConfirm = ({ onClick }) => {
    return (
        <button type="button" className="btn btn-primary modal-confirm-button" onClick={onClick}>
            I got it!
        </button>
    );
};

const ButtonGuide = ({icon, text}) => {
    return (
        <div className="d-flex align-items-center mb-2">
            <i className={`fa-2x ${icon} me-2 info-dialog-button-guide-icon`}></i>
            <span>{text}</span>
        </div>
    );
};

export default memo(InfoDialog);
