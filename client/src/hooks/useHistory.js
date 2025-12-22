import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing state history (Undo/Redo)
 * @param {any} initialState Initial state value
 * @param {number} maxHistory Maximum number of history states to keep (default 50)
 * @returns {Object} { state, set, undo, redo, canUndo, canRedo, history }
 */
export default function useHistory(initialState, maxHistory = 50) {
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const state = useMemo(() => history[currentIndex], [history, currentIndex]);

    const set = useCallback((newStateOrReducer) => {
        setHistory(prevHistory => {
            const current = prevHistory[currentIndex];
            const newState = typeof newStateOrReducer === 'function'
                ? newStateOrReducer(current)
                : newStateOrReducer;

            // Don't save if state hasn't changed (shallow comparison)
            if (newState === current) return prevHistory;

            // Slice history to current point (remove future redo states)
            const newHistory = prevHistory.slice(0, currentIndex + 1);

            // Add new state
            const nextHistory = [...newHistory, newState];

            // Limit history size
            if (nextHistory.length > maxHistory) {
                nextHistory.shift();
                // We will adjust index later, but actually we need to be careful with index if we shift
                // If we shift, index effectively decreases by 1, but we point to the *end*, so index becomes length-1
            }
            return nextHistory;
        });

        setCurrentIndex(prev => {
            // If we limited history (length > maxHistory), the new index is maxHistory - 1
            // Otherwise it's prev + 1
            // However, we can't easily access the NEW history length here inside this setter 
            // accurately without calculating logic again. 
            // So simpler: just set appropriate index in the next render cycle or use functional updates consistently.

            // Let's refine the setHistory logic to return the value and manage index together? 
            // React state setters are independent.

            // Alternative: Use a single state object for { history, index }
            return prev + 1; // This logic is slightly flawed if we shift.
        });
    }, [currentIndex, maxHistory]); // Dependencies might cause issues if not careful, but okay for now.

    // Re-write to use single state for atomic updates
    const [historyState, setHistoryState] = useState({
        history: [initialState],
        index: 0
    });

    const setSafe = useCallback((newStateOrReducer) => {
        setHistoryState(prev => {
            const currentState = prev.history[prev.index];
            const newState = typeof newStateOrReducer === 'function'
                ? newStateOrReducer(currentState)
                : newStateOrReducer;

            if (newState === currentState) return prev;

            const newHistory = prev.history.slice(0, prev.index + 1);
            newHistory.push(newState);

            if (newHistory.length > maxHistory) {
                newHistory.shift();
                return {
                    history: newHistory,
                    index: newHistory.length - 1
                };
            }

            return {
                history: newHistory,
                index: newHistory.length - 1
            };
        });
    }, [maxHistory]);

    const undo = useCallback(() => {
        setHistoryState(prev => ({
            ...prev,
            index: Math.max(0, prev.index - 1)
        }));
    }, []);

    const redo = useCallback(() => {
        setHistoryState(prev => ({
            ...prev,
            index: Math.min(prev.history.length - 1, prev.index + 1)
        }));
    }, []);

    const reset = useCallback((newState) => {
        setHistoryState({
            history: [newState],
            index: 0
        });
    }, []);

    return {
        state: historyState.history[historyState.index],
        set: setSafe,
        undo,
        redo,
        reset,
        canUndo: historyState.index > 0,
        canRedo: historyState.index < historyState.history.length - 1,
        historyLength: historyState.history.length
    };
}
