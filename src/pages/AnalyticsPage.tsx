import {useParams} from 'react-router-dom';
import {databaseService} from '../services/storage';
import {Heatmap, CorrelationChart} from '../components/visualizations';
import {GazeData, MouseData} from '../@types';

export function AnalyticsPage() {
    const {sessionId} = useParams<{ sessionId: string }>();
    const session = databaseService.getAllSessions().find(s => s.id === sessionId);

    if (!session) {
        return <h2>Session not found</h2>;
    }
    return (
        <>
            <h1>Session analytics #{sessionId}</h1>
            <Heatmap
                data={session.gazeData}
                extractCoordinates={(item: GazeData) => ({
                    x: item.x,
                    y: item.y,
                })}
            />
            <Heatmap
                data={session.mouseData}
                extractCoordinates={(item: MouseData) => ({
                    x: item.x,
                    y: item.y,
                })}
            />
            <CorrelationChart
                xData={session.gazeData.map((item: GazeData) => item.x)}
                yData={session.mouseData.map((item: MouseData) => item.x)}
                xLabel={"Gaze X"}
                yLabel={"Cursor X"}
            />
            <CorrelationChart
                xData={session.gazeData.map((item: GazeData) => item.y)}
                yData={session.mouseData.map((item: MouseData) => item.y)}
                xLabel={"Gaze Y"}
                yLabel={"Cursor Y"}
                xDataKey={"gazeY"}
                yDataKey={"cursorY"}
            />
        </>
    )
}
