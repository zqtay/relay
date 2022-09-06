import "./WordBox.css"

import { memo, useEffect, useState, useRef } from "react";

const WordBox = ({ wordIndex, mode, state, setSelected, submit }) => {
    const input = state.inputs[wordIndex];
    const hint = state.hints[wordIndex];
    const [selectedCharIndex, setSelectedCharIndex] = useState(-1);
    const [charArray, setCharArray] = useState(input.split(''));
    const wordBoxRef = useRef(null);

    const updateIndex = (charIndex) => {
        setSelectedCharIndex(charIndex);
        setSelected({wordIndex: wordIndex, charIndex: charIndex});
    }

    const handleClick = () => {
        setSelected((prev) => ({...prev, wordIndex: wordIndex}));
    };

    const handleBlur = () => {
        setSelectedCharIndex(-1);
        setSelected({wordIndex: -1, charIndex: -1});
    };

    const selectChar = (index) => {
        updateIndex(index);
    }

    const handleKeyDown = (e) => {
        // console.log(`${e.key.toLowerCase()} ${wordIndex} ${selectedCharIndex} ${charArray}`);
        if (selectedCharIndex >= mode.wordLen || selectedCharIndex < 0) return;

        let key = e.key.toLowerCase();
        let newArray = [...charArray];
        let charIndex = selectedCharIndex;
        if (key.length === 1) {
            // Only set char if index is within range and hint not exist
            if (charIndex < mode.wordLen && hint[charIndex] === ' ') {
                newArray[charIndex] = key;
                setCharArray(newArray);
            }
            if (charIndex < mode.wordLen - 1) charIndex++;
        }
        else if (key === 'delete' || key === 'backspace') {
            // Skip deleting hints
            if (hint[charIndex] === ' ') {
                newArray[charIndex] = ' ';
                setCharArray(newArray);
            }
            if (key === 'backspace' && charIndex > 0) charIndex--;
        }
        else if (key === 'enter') {
            submit(wordIndex, charArray.join(''));
        }
        else if (key === 'arrowleft') {
            if (charIndex > 0) charIndex--;
        }
        else if (key === 'arrowright') {
            if (charIndex < (mode.wordLen - 1)) charIndex++;
        }
        // Update selectedCharIndex and currSelected
        updateIndex(charIndex);
    };

    useEffect(() => {
        const currentRef = wordBoxRef.current;
        currentRef.addEventListener('keydown_buttons', handleKeyDown);
        return () => {
            currentRef.removeEventListener('keydown_buttons', handleKeyDown);
        }
    }, [handleKeyDown]);

    useEffect(() => {
        setCharArray(input.split(''));
    }, [input]);

    return (
        <div tabIndex={0} className="wordbox" ref={wordBoxRef} onKeyDown={handleKeyDown} onClick={handleClick} onBlur={handleBlur}>
            <CharBoxes charArray={charArray} selectedCharIndex={selectedCharIndex} hint={hint} wordIndex={wordIndex} mode={mode} selectChar={selectChar} />
        </div>
    );
};

const CharBoxes = ({ charArray, selectedCharIndex, hint, wordIndex, mode, selectChar }) => {
    let boxes = [];
    let className = null;
    for (let i = 0; i < charArray.length; i++) {
        className = charBoxClass(i, selectedCharIndex, hint[i], wordIndex, mode);
        boxes.push(
            <div className={className} key={i} onClick={() => selectChar(i)}>
                <div className="charbox-text">
                    {charArray[i].toUpperCase()}
                </div>
                <div className="charbox-underline"></div>
            </div>
        );
    }
    return (
        <>
            {boxes}
        </>
    );
}

const charBoxClass = (charIndex, selectedCharIndex, hintChar, wordIndex, mode) => {
    let className = "charbox";
    if (hintChar !== ' ') {
        className += " charbox-hint";
    }
    if ((charIndex < mode.overlapLen && wordIndex > 0) ||
        (charIndex >= mode.wordLen - mode.overlapLen && wordIndex < mode.noOfWords - 1)) {
        className += " charbox-overlap";
    }
    if (charIndex === selectedCharIndex) {
        className += " charbox-current";
    }
    return className;
}

export default memo(WordBox);