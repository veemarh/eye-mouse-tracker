import {useEffect, useRef, useState} from 'react';

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
        <div>
            <div
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    zIndex: 1000,
                    fontSize: '0.9rem',
                }}
            >
                <h3>Click history</h3>
                {clickData.length === 0 ? (
                    <p>No clicks have been registered yet</p>
                ) : (
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {clickData.map((data, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: '8px',
                                    borderBottom: '1px dashed #ddd',
                                    paddingBottom: '4px',
                                }}
                            >
                                <div>
                                    <strong>Click:</strong> ({data.click.x}, {data.click.y})
                                    <span style={{
                                        fontSize: '0.8rem',
                                        color: '#666'
                                    }}>{' '}— {new Date(data.click.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div>
                                    <strong>Gaze:</strong> ({data.gaze.x ? data.gaze.x.toFixed(1) : 'n/a'}, {data.gaze.y ? data.gaze.y.toFixed(1) : 'n/a'})
                                    <span style={{
                                        fontSize: '0.8rem',
                                        color: '#666'
                                    }}>{' '}— {data.gaze.timestamp ? new Date(data.gaze.timestamp).toLocaleTimeString() : 'n/a'}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default WebGazerLoader;
