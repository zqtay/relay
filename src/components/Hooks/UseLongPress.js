import { useCallback, useEffect, useRef } from "react";

const LONG_PRESS_DELAY_DEFAULT = 500; // ms

const useLongPress = (onLongPress, onClick, threshold = LONG_PRESS_DELAY_DEFAULT) => {
    let timerId = useRef(null);
    let isPressed = useRef(null);
    let isLongPress = useRef(null);

    useEffect(() => {
        // console.log("useeffect")
        timerId.current = -1;
        isPressed.current = false;
        isLongPress.current = false;
    }, []);

    const handleLongPress = useCallback(() => {
        // console.log("long")
        isLongPress.current = true;
        onLongPress();
    }, [onLongPress]);

    const start = useCallback((e, preventDefault = true) => {
        // console.log(`start ${timerId.current} ${isPressed.current}`)
        if (preventDefault) e.preventDefault();
        if (!isPressed.current) {
            // console.log("start timer")
            timerId.current = setTimeout(handleLongPress, threshold);
            // console.log(timerId.current)
            isPressed.current = true;
        }
    }, [threshold, handleLongPress]);

    const clear = useCallback((e, preventDefault = true) => {
        // console.log(`clear ${timerId.current} ${isPressed.current}`)
        if (preventDefault) e.preventDefault();
        if (timerId.current !== -1 && isPressed.current) {
            // console.log("clear timeout")
            clearTimeout(timerId.current);
            timerId.current = -1;
            isPressed.current = false;
        }
        if (!isLongPress.current) {
            // console.log("click")
            onClick();
        }
        isLongPress.current = false
    }, [onClick]);

    return {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e, false),
        onMouseUp: e => clear(e),
        onTouchEnd: e => clear(e)
    };
};

export default useLongPress;