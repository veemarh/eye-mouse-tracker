import {useEffect, useRef, useState} from 'react';
import Menu from '../../components/Menu.tsx';

/**
 *
 */
interface GazeCoordinates {
    x: number | null;
    y: number | null;
    timestamp: number | null;
}

/**
 *
 */
interface ClickCoordinates {
    x: number;
    y: number;
    timestamp: number;
}

/**
 *
 */
interface CombinedData {
    click: ClickCoordinates;
    gaze: GazeCoordinates;
}

/**
 *
 * @constructor
 */
function WebGazerLoader() {
    // Реф для хранения последних координат взгляда
    const lastGazeRef = useRef<GazeCoordinates>({x: null, y: null, timestamp: null});
    // Состояние для хранения данных кликов с координатами взгляда
    const [clickData, setClickData] = useState<CombinedData[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!window.webgazer) {
            console.warn('WebGazer.js is not implemented!');
            return;
        }

        let webgazer = window.webgazer;

        try {
            webgazer
                .setRegression('ridge')
                .setGazeListener((data: { x: number; y: number } | null, elapsedTime: number) => {
                    if (data) {
                        lastGazeRef.current = {x: data.x, y: data.y, timestamp: elapsedTime};
                    }
                })
                .setTracker('clmtrackr')
                .saveDataAcrossSessions(false)
                .begin();
        } catch {
            console.warn('WebGazer.js is not implemented.');
            return;
        }

        /**
         *
         * @param event
         */
        const handleClick = (event: MouseEvent) => {
            const clickCoordinates: ClickCoordinates = {
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now(),
            };
            const gazeCoordinates = lastGazeRef.current;
            const combinedData: CombinedData = {
                click: clickCoordinates,
                gaze: gazeCoordinates,
            };
            setClickData(prev => [...prev, combinedData]);
            console.log(`New entry: ${combinedData}`);
        };

        // Добавляем слушатель клика
        document.addEventListener('click', handleClick);

        return () => {
            if (webgazer && typeof webgazer.isReady === 'function' && webgazer.isReady()) {
                webgazer.clearGazeListener().end();
            }
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <>
            <button style={{position:'fixed', top: '10px', right:'10px'}} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? 'Close menu' : 'Open menu'}
            </button>
            {isMenuOpen && <Menu clickData={clickData}/>}
        </>
    );
}

export default WebGazerLoader;
