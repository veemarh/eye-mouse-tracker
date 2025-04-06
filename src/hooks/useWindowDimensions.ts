import {useState, useEffect} from 'react';

/**
 * Custom hook that returns the current window dimensions.
 */
export function useWindowDimensions() {
    const getDimensions = () => ({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    });

    const [windowDimensions, setWindowDimensions] = useState(getDimensions());

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getDimensions());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
