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
        <div className="d-flex flex-wrap align-items-center justify-content-center">
            {
                keys.map(
                    (a, i) =>
                        <div key={i} className="key-button" onClick={(e) => handleClick(a, e)} onMouseDown={handleMouseDown}>
                            {a}
                        </div>
                )
            }
        </div>
    );
}

export default KeyButtons;