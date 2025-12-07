import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

export default function Tooltip({ text, children, position = 'top' }) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), 500);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {visible && text && (
                <div className={`tooltip tooltip-${position}`}>
                    {text}
                </div>
            )}
        </div>
    );
}
