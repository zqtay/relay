import "./WordBox.css"

import { memo, useEffect, useState, useRef } from "react";

const WordBox = ({ wordIndex, mode, state, setStep, submit }) => {
    const input = state.inputs[wordIndex];
    const hint = state.hints[wordIndex];
    const [selectedCharIndex, setSelectedCharIndex] = useState(-1);
    const [charArray, setCharArray] = useState(input.split(''));
    const wordBoxRef = useRef(null);

    const handleClick = () => {
        setStep(wordIndex);
    };

    const handleBlur = () => {
        setSelectedCharIndex(-1);
    };

    const selectChar = (index) => {
        setSelectedCharIndex(index);
    }

    const handleKeyDown = (e) => {
        console.log(`${e.key.toLowerCase()} ${wordIndex} ${selectedCharIndex} ${charArray}`);
        if (selectedCharIndex >= mode.wordLen || selectedCharIndex < 0) return;
        let key = e.key.toLowerCase();
        let newArray = [...charArray];
        if (key.length === 1) {
            // Only set char if index is within range and hint not exist
            if (selectedCharIndex < mode.wordLen && hint[selectedCharIndex] === ' ') {
                newArray[selectedCharIndex] = key;
                setCharArray(newArray);
            }
            if (selectedCharIndex < mode.wordLen - 1) setSelectedCharIndex(i => i + 1);
        }
        else if (key === 'delete' || key === 'backspace') {
            // Skip deleting hints
            if (hint[selectedCharIndex] === ' ') {
                newArray[selectedCharIndex] = ' ';
                setCharArray(newArray);
            }
            if (key === 'backspace' && selectedCharIndex > 0) setSelectedCharIndex(i => i - 1);
        }
        else if (key === 'enter') {
            // Redundancy
            setStep(wordIndex);
            submit(charArray.join(''));
            setSelectedCharIndex(0);
        }
        else if (key === 'arrowleft') {
            if (selectedCharIndex > 0) setSelectedCharIndex(i => i - 1);
        }
        else if (key === 'arrowright') {
            if (selectedCharIndex < (mode.wordLen - 1)) setSelectedCharIndex(i => i + 1);
        }
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
        (charIndex >= mode.wordLen - mode.overlapLen && wordIndex < mode.maxSteps - 1)) {
        className += " charbox-overlap";
    }
    if (charIndex === selectedCharIndex) {
        className += " charbox-current";
    }
    return className;
}

export default memo(WordBox);