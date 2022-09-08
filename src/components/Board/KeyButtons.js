import "./KeyButtons.css";

const KeyButtons = ({ keys, boardRef }) => {
    const handleClick = (key, e) => {
        const kbEvent = new KeyboardEvent('keydown_buttons', { key: key });
        boardRef.current.dispatchEvent(kbEvent);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    return (
        <div className='d-flex justify-content-center align-items-center'>
            <div>
                {
                    keys.map(
                        (a, i) =>
                            <div key={i} className="btn key-button" onClick={(e) => handleClick(a, e)} onMouseDown={handleMouseDown}>
                                {a}
                            </div>
                    )
                }
            </div>
            <div className="vr mx-3 my-3"></div>
            <div>
                <div className="key-button" onClick={(e) => handleClick("BACKSPACE", e)} onMouseDown={handleMouseDown}>
                    <i className="fa-solid fa-left-long"></i>
                </div>
                <div className="key-button" onClick={(e) => handleClick("ENTER", e)} onMouseDown={handleMouseDown}>
                    <i className="fa-solid fa-spell-check"></i>
                </div>
            </div>
        </div>
    );
}

export default KeyButtons;