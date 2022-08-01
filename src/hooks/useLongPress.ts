import { useState, useEffect, useCallback } from "react";

const useLongPress = (
  callback = () => {},
  ms = 300,
  onStart = () => {},
  onStop = () => {}
) => {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId: any;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress]);

  const start = useCallback(() => {
    setStartLongPress(true);
    onStart();
  }, []);

  const stop = useCallback(() => {
    setStartLongPress(false);
    onStop();
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    // onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};

export default useLongPress;
