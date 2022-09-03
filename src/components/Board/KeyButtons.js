const KeyButtons = ({ keys, boardRef, currWordIndex }) => {
    const onClickHandler = (key, currWordIndex, event) => {
        event.preventDefault();
        const kbEvent = new KeyboardEvent('keydown', { key: key });
        const wordBox = boardRef.current.getElementsByClassName("wordbox")[currWordIndex];
        wordBox.dispatchEvent(kbEvent);
    };

    const onMouseDownHandler = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            {
                keys.map(
                    (a, i) =>
                        <div key={i} className="btn btn-light btn-lg mx-2 my-2" onClick={(e) => onClickHandler(a, currWordIndex, e)} onMouseDown={onMouseDownHandler}>
                            {a.toUpperCase()}
                        </div>
                )
            }
        </div>
    );
}

export default KeyButtons;