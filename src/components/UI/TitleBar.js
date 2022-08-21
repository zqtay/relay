import { memo } from "react";

import "./TitleBar.css"

const TitleBar = (props) => {
    return (
        <nav className="navbar navbar-expand bg-light sticky-top shadow-sm">
            <div className="container">
                <a className="navbar-brand" href="#">{props.title}</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto align-self-center">
                        <li className="nav-item ps-3">
                            <TitleBarButton icon="fa-circle-info" onClick={props.onClickHandlers.info}/>
                        </li>
                        <li className="nav-item ps-3">
                            <TitleBarButton icon="fa-dice" onClick={props.onClickHandlers.newGame}/>
                        </li>
                        <li className="nav-item ps-3">
                            <TitleBarButton icon="fa-gears" onClick={props.onClickHandlers.settings}/>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

const TitleBarButton = ({icon, onClick}) => {
    return (
        <div onClick={onClick}>
            <span className="fa-lg">
                <i className={`fa fa-solid fa-lg ${icon} titlebar-button`}></i>
            </span>
        </div>
    );
}

export default memo(TitleBar);