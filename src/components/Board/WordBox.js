import "./WordBox.css"

import { memo, useState } from "react";

const WordBox = ({ word, hint, wordLen, select, submit }) => {
    const [charIndex, setCharIndex] = useState(-1);
    const [charArray, setCharArray] = useState(word.split(""));

    const onClickHandler = () => {
        setCharIndex(0);
    };

    const onBlurHandler = () => {
        setCharIndex(-1);
    };

    const keyDownHandler = (e) => {
        // word          A B C D E (void, for backspace)
        // charIndex     0 1 2 3 4 5
        if (charIndex > wordLen || charIndex < 0) return;
        let key = e.key.toLowerCase();
        let newArray = [...charArray];
        if (key.length === 1) {
            // Only set char if index is within range and hint not exist
            if (charIndex < wordLen && hint[charIndex] === ' ') {
                newArray[charIndex] = key;
                setCharArray(newArray);
            }
            if (charIndex < wordLen) setCharIndex(i => i + 1);
        }
        else if (key === 'backspace') {
            // Skip deleting hints and first char (cant backspace)
            if (charIndex > 0 && hint[charIndex - 1] === ' ') {
                newArray[charIndex - 1] = ' ';
                setCharArray(newArray);
            }
            if (charIndex > 0) setCharIndex(i => i - 1);
        }
        else if (key === 'delete') {
            // Skip deleting hints
            if (hint[charIndex] === ' ') {
                newArray[charIndex] = ' ';
                setCharArray(newArray);
            }
        }
        else if (key === 'enter') {
            select();
            submit(charArray.join(''));
            setCharIndex(0);
        }
        else if (key === 'arrowleft') {
            if (charIndex > 0) setCharIndex(i => i - 1);
        }
        else if (key === 'arrowright') {
            if (charIndex < (wordLen - 1)) setCharIndex(i => i + 1);
        }
        console.log(`${key} ${charIndex} ${charArray}`);
    };

    return (
        <div tabIndex={0} className="wordbox" onClick={onClickHandler} onKeyDown={keyDownHandler} onBlur={onBlurHandler}>
            <CharBoxes charArray={charArray} charIndex={charIndex} hint={hint} />
        </div>
    );
};

const CharBoxes = ({ charArray, charIndex, hint }) => {
    let boxes = [];
    let className = "charbox";
    for (let i = 0; i < charArray.length; i++) {
        className = "charbox";
        if (i === charIndex) {
            className += " charbox-current";
        }
        if (hint[i] !== ' ') {
            className += " charbox-hint";
        }
        boxes.push(<span key={i} className={className}>{charArray[i].toUpperCase()}</span>);
    }
    return (
        <>
            {boxes}
        </>
    );
}

export default memo(WordBox);