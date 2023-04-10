import React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";

const ImperativeHandle = forwardRef((props, ref) => {
  const [counter, setCounter] = useState(0);

  useImperativeHandle(ref, () => ({
    increaseCounter() {
      setCounter(counter + 1);
    },
  }));

  return <div>Count clicks: {counter}</div>;
});

export default ImperativeHandle;
