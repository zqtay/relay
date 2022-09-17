import "./WordBox.css"

import { memo, useEffect, useState, useRef } from "react";

const WordBox = ({ wordIndex, mode, state, selected, setSelected }) => {
    const input = state.inputs[wordIndex];
    const hint = state.hints[wordIndex];
    const [charArray, setCharArray] = useState(input.split(''));
    const wordBoxRef = useRef(null);

    const handleBlurWord = () => {
        setSelected({wordIndex: -1, charIndex: -1});
    };

    const handleClickWord = () => {
        setSelected(prev => ({...prev, wordIndex: wordIndex}));
    };

    const updateSelected = (charIndex) => {
        setSelected({wordIndex: wordIndex, charIndex: charIndex});
    }

    useEffect(() => {
        setCharArray(input.split(''));
    }, [input]);

    let className = "wordbox";
    if (selected.wordIndex === wordIndex) className += " wordbox-selected";

    return (
        <div tabIndex={0} className={className} ref={wordBoxRef} onClick={handleClickWord} onBlur={handleBlurWord}>
            <CharBoxes charArray={charArray} wordIndex={wordIndex} selected={selected} hint={hint} mode={mode} updateSelected={updateSelected} />
        </div>
    );
};

const CharBoxes = ({ charArray, wordIndex, selected, hint, mode, updateSelected }) => {
    let boxes = [];
    let className = null;
    for (let i = 0; i < charArray.length; i++) {
        className = charBoxClass( wordIndex, i, selected, hint[i], mode);
        boxes.push(
            <div className={className} key={i} onClick={() => updateSelected(i)}>
                <div className="charbox-text">
                    {charArray[i]}
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

const charBoxClass = (wordIndex, charIndex, selected, hintChar, mode) => {
    let className = "charbox";
    if (hintChar !== ' ') {
        className += " charbox-hint";
    }
    if ((charIndex < mode.overlapLen && wordIndex > 0) ||
        (charIndex >= mode.wordLen - mode.overlapLen && wordIndex < mode.noOfWords - 1)) {
        className += " charbox-overlap";
    }
    if (wordIndex === selected.wordIndex && charIndex === selected.charIndex) {
        className += " charbox-selected";
    }
    return className;
}

export default memo(WordBox);