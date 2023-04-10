import React, { useRef } from 'react'
import ImperativeHandle from './ImperativeHandle';

const ParentImperativeHandle = () => {
    const btnRef = useRef<any>(null);

    return (
        <>
            <button
                onClick={() => {
                    if (btnRef.current != null) btnRef.current?.increaseCounter();
                }}
            >
                Click me!
            </button>
            <ImperativeHandle ref={btnRef} />
        </>
    )
}

export default ParentImperativeHandle