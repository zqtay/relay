import { useCallback, useEffect, useRef } from "react";

const LONG_PRESS_DELAY_DEFAULT = 500; // ms
const TIMER_ID_INVALID = -1;

const useLongPress = (onLongPress, onClick, threshold = LONG_PRESS_DELAY_DEFAULT) => {
    let timerId = useRef(null);
    let isPressed = useRef(null);

    useEffect(() => {
        // console.log("useeffect")
        timerId.current = TIMER_ID_INVALID;
        isPressed.current = false;
    }, []);

    const handleLongPress = useCallback(() => {
        // console.log("long")
        onLongPress();
        isPressed.current = false;
        timerId.current = TIMER_ID_INVALID;
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
        if (timerId.current !== TIMER_ID_INVALID && isPressed.current) {
            // console.log("clear timeout")
            clearTimeout(timerId.current);
            timerId.current = TIMER_ID_INVALID;
        }
        // isPressed will be cleared by handleLongPress
        if (isPressed.current) {
            // console.log("click")
            onClick();
        }
        isPressed.current = false
    }, [onClick]);

    return {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e, false),
        onMouseUp: e => clear(e),
        onTouchEnd: e => clear(e)
    };
};

export default useLongPress;