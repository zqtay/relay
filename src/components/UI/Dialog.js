import "./Dialog.css"

import React, { useEffect, useRef } from 'react';

const Dialog = ({ show, icon, title, content, btnConfirm, btnCancel, dismiss }) => {
    const showClassName = show ? "show" : "hidden";
    const dialogRef = useRef(null);
    useOutsideHandler(dialogRef, dismiss);

    return (
        <div className={`modal ${showClassName}`}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content shadow-sm" ref={dialogRef}>
                    <DialogHeader icon={icon} title={title} dismiss={dismiss} />
                    <div className="modal-body">
                        {content}
                    </div>
                    <DialogFooter btnConfirm={btnConfirm} btnCancel={btnCancel} />
                </div>
            </div>
        </div>
    );
}

const useOutsideHandler = (ref, callback) => {
    useEffect(() => {
        /**
         * Handle if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const DialogHeader = ({ icon, title, dismiss }) => {
    return (
        <div className="modal-header">
            <span className="fa-lg modal-title-icon">
                <i className={`fa-solid fa-lg ${icon}`}></i>
            </span>
            <h4 className="modal-title ms-2">{title}</h4>
            <span className="fa-lg ms-auto" onClick={dismiss}>
                <i className="fa-solid fa-lg fa-circle-xmark modal-dismiss-button"></i>
            </span>
        </div>
    );
}

const DialogFooter = ({ btnConfirm, btnCancel }) => {
    return (
        <div className="modal-footer">
            {btnCancel != null ? <button type="button" className="btn btn-default" onClick={btnCancel.onClick}>{btnCancel.name}</button> : null}
            <button type="button" className="btn btn-primary modal-confirm-button" onClick={btnConfirm.onClick}>{btnConfirm.name}</button>
        </div>
    );
}

export default Dialog;