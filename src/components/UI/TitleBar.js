import "./TitleBar.css"
import logo from "../../logo.png";

import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";

const TitleBar = (props) => {
    const navigate = useNavigate();
    const reload = () => {
        navigate('/', { replace: true });
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand bg-light">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/" onClick={reload}>
                    <img className="titlebar-logo" src={logo} />
                    <span className="titlebar-brand-text">Relay</span>
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className="nav-item ps-3">
                            <TitleBarButton icon="fa-circle-info" onClick={props.onClickHandlers.info} />
                        </li>
                        <li className="nav-item ps-3">
                            <TitleBarButton icon="fa-dice" onClick={props.onClickHandlers.newGame} />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

const TitleBarButton = ({ icon, onClick }) => {
    return (
        <div onClick={onClick}>
            <span className="fa-lg">
                <i className={`fa fa-solid fa-lg ${icon} titlebar-button`}></i>
            </span>
        </div>
    );
}

export default memo(TitleBar);