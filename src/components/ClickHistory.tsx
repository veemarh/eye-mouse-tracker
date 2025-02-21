export interface GazeCoordinates {
    x: number | null;
    y: number | null;
    timestamp: number | null;
}

export interface ClickCoordinates {
    x: number;
    y: number;
    timestamp: number;
}

export interface CombinedData {
    click: ClickCoordinates;
    gaze: GazeCoordinates;
}

interface ClickHistoryProps {
    clickData: CombinedData[];
}

function ClickHistory({clickData}: ClickHistoryProps) {
    return (
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
    );
}

export default ClickHistory;
