import "./KeyButtons.css";

const KeyButtons = ({ keys, boardRef, currWordIndex }) => {
    const handleClick = (key, e) => {
        const kbEvent = new KeyboardEvent('keydown_buttons', { key: key });
        boardRef.current.dispatchEvent(kbEvent);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            {
                keys.map(
                    (a, i) =>
                        <div key={i} className="btn key-button" onClick={(e) => handleClick(a, e)} onMouseDown={handleMouseDown}>
                            {a.toUpperCase()}
                        </div>
                )
            }
        </div>
    );
}

export default KeyButtons;