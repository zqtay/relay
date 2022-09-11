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
                    The <b>end</b> of your current word must <b>match</b> the <b>start</b> of your next word.
                </li>
                <li>
                    Use <b>hints</b> if you are stuck!
                </li>
            </ul>
            <hr></hr>
            <div className="info-dialog-text">
                <ButtonGuide icon="fa-solid fa-square-h" text={<><b>Reveal</b> hint</>} margin="mb-2"/>
                <ButtonGuide icon="fa-regular fa-circle-check" text={<><b>Check</b> word / (Hold) <b>Submit</b> solution</>} margin="mb-2"/>
                <ButtonGuide icon="fa-solid fa-left-long" text={<><b>Backspace</b> / (Hold) <b>Clear</b> board</>} />
            </div>
            <hr></hr>
            <small>
                Developed by <a href="https://zqtay.github.io/">Tay Zong Qing</a>
            </small>
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

const ButtonGuide = ({ icon, text, margin="" }) => {
    return (
        <div className={`d-flex align-items-center ${margin}`}>
            <i className={`fa-2x ${icon} me-2 info-dialog-button-guide-icon`}></i>
            <span>{text}</span>
        </div>
    );
};

export default memo(InfoDialog);
