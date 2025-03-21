import {useParams} from 'react-router-dom';
import {Heatmap, CorrelationChart} from '../components/visualizations';
import {GazeData, MouseData, MetricsResult} from '../@types';
import {useEffect, useState} from 'react';
import {apiGateway} from '../services/api';

export function AnalyticsPage() {
    const params = useParams<{ sessionId: string }>();

    if (!params.sessionId) {
        return <h2>Error: Session ID is missing.</h2>;
    }

    const [metrics, setMetrics] = useState<MetricsResult>();
    const [error, setError] = useState<string | null>(null);
    const sessionId: string = params.sessionId;
    const session = apiGateway.getSession(sessionId);

    useEffect(() => {
        try {
            const metricsToShow = apiGateway.getMetrics(sessionId, [
                'pearson-x',
                'pearson-y',
                'linear-x',
                'linear-y',
                'velocity-correlation',
                'si',
                'dr',
            ]);

            setMetrics(metricsToShow);
        } catch (err: any) {
            setError(err.message);
        }
    }, [sessionId]);

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!session) {
        return <h2>Session not found</h2>;
    }
    if (!metrics) {
        return <div>Loading metrics...</div>;
    }

    return (
        <>
            <h1>Session analytics #{sessionId}</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '1em', justifyContent: 'space-evenly'}}>
                <div>
                    <Heatmap
                        data={session.gazeData}
                        extractCoordinates={(item: GazeData) => ({
                            x: item.x,
                            y: item.y,
                        })}
                    />
                </div>
                <div>
                    <Heatmap
                        data={session.mouseData}
                        extractCoordinates={(item: MouseData) => ({
                            x: item.x,
                            y: item.y,
                        })}
                    />
                </div>
                <div>
                    <CorrelationChart
                        xData={session.gazeData.map((item: GazeData) => item.x)}
                        yData={session.mouseData.map((item: MouseData) => item.x)}
                        xLabel={"Gaze X (px)"}
                        yLabel={"Cursor X (px)"}
                        xDataKey={"gazeX"}
                        yDataKey={"cursorX"}
                    />
                    {metrics.pearsonX.toFixed(3)}
                </div>
                <div>
                    <CorrelationChart
                        xData={session.gazeData.map((item: GazeData) => item.y)}
                        yData={session.mouseData.map((item: MouseData) => item.y)}
                        xLabel={"Gaze Y (px)"}
                        yLabel={"Cursor Y (px)"}
                        xDataKey={"gazeY"}
                        yDataKey={"cursorY"}
                    />
                    {metrics.pearsonY.toFixed(3)}
                </div>
                <div>
                    <CorrelationChart
                        xData={metrics.velocityCorrelation.map(p => p.gazeSpeed)}
                        yData={metrics.velocityCorrelation.map(p => p.cursorSpeed)}
                        xLabel="Gaze Speed (px/s)"
                        yLabel="Cursor Speed (px/s)"
                        xDataKey="gazeSpeed"
                        yDataKey="cursorSpeed"
                    />
                </div>
            </div>
        </>
    )
}
