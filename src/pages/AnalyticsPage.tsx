import {useParams} from 'react-router-dom';
import {Heatmap, CorrelationChart} from '../components/visualizations';
import {GazeData, MouseData, MetricsResult} from '../@types';
import {useEffect, useMemo, useState} from 'react';
import {apiGateway} from '../services/api';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {convertToHeatmapData, smoothedHeatmapData} from '../utils/chart';

export function AnalyticsPage() {
    const params = useParams<{ sessionId: string }>();
    const validSessionId = params.sessionId || '';

    const [metrics, setMetrics] = useState<MetricsResult>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const session = validSessionId ? apiGateway.getSession(validSessionId) : null;

    useEffect(() => {
        if (!validSessionId) return;
        const fetchMetrics = () => {
            setLoading(true);
            apiGateway.getMetrics(validSessionId, [
                'pearson-x',
                'pearson-y',
                'linear-x',
                'linear-y',
                'velocity-correlation',
                'si',
                'dr',
            ])
                .then((data) => {
                    if (!data) {
                        throw new Error("Error when processing session data.");
                    }
                    setMetrics(data);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchMetrics();
    }, [validSessionId]);

    const {gazeX, mouseX, gazeY, mouseY, gazeSpeed, cursorSpeed} = useMemo(() => ({
        gazeX: session?.gazeData.map(g => g.x) || [],
        mouseX: session?.mouseData.map(m => m.x) || [],
        gazeY: session?.gazeData.map(g => g.y) || [],
        mouseY: session?.mouseData.map(m => m.y) || [],
        gazeSpeed: metrics?.velocityCorrelation.map(p => p.gazeSpeed) || [],
        cursorSpeed: metrics?.velocityCorrelation.map(p => p.cursorSpeed) || []
    }), [session, metrics]);

    if (!metrics || loading) return <LoadingSkeleton/>;
    if (!validSessionId) return <h2>Loading Session...</h2>;
    if (error) return <ErrorScreen error={error} session={session}/>;
    if (!session) return <h2>Session not found.</h2>;

    const siCells = metrics.si;
    const siHeatmapData = convertToHeatmapData(
        siCells.map(c => ({x: c.x, y: c.y})),
        siCells.map(c => c.si),
        siCells.map(c => c.count)
    );

    const gazeCells = session.gazeData;
    const smoothedGazeData = smoothedHeatmapData(gazeCells, {
        screenWidth: document.documentElement.clientWidth,
        screenHeight: document.documentElement.clientHeight,
        gridSize: 100,
    });
    const gazeHeatmapData = convertToHeatmapData(
        smoothedGazeData.map(c => ({x: c.x, y: c.y})),
        smoothedGazeData.map(() => 1),
        smoothedGazeData.map(c => c.count)
    );

    const mouseCells = session.mouseData;
    const smoothedMouseData = smoothedHeatmapData(mouseCells, {
        screenWidth: document.documentElement.clientWidth,
        screenHeight: document.documentElement.clientHeight,
        gridSize: 100,
    });
    const mouseHeatmapData = convertToHeatmapData(
        smoothedMouseData.map(c => ({x: c.x, y: c.y})),
        smoothedMouseData.map(() => 1),
        smoothedMouseData.map(c => c.count)
    );

    return (
        <>
            <h1>Session analytics</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '1em', justifyContent: 'space-evenly'}}>
                <div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '1em', justifyContent: 'space-evenly'}}>
                        <Heatmap
                            data={gazeCells}
                            extractCoordinates={(item: GazeData) => ({
                                x: item.x,
                                y: item.y,
                            })}
                        />
                        <Heatmap
                            data={gazeHeatmapData}
                            extractCoordinates={(item) => item}
                        />
                    </div>
                    <p>Gaze data.</p>
                </div>
                <div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '1em', justifyContent: 'space-evenly'}}>
                        <Heatmap
                            data={session.mouseData}
                            extractCoordinates={(item: MouseData) => ({
                                x: item.x,
                                y: item.y,
                            })}
                        />
                        <Heatmap
                            data={mouseHeatmapData}
                            extractCoordinates={(item) => item}
                        />
                    </div>
                    <p>Mouse data.</p>
                </div>
                <p><strong>Correlation analysis.</strong> Each point indicates one corresponding sample of gaze and
                    cursor. Each graph includes all data points across all participants. Gaze data is represented on the
                    x-axis and cursor data on the y-axis.</p>
                <div>
                    <CorrelationChart
                        xData={gazeX}
                        yData={mouseX}
                        xLabel="Gaze X (px)"
                        yLabel="Cursor X (px)"
                        xDataKey="gazex"
                        yDataKey="cursorx"
                    />
                    <p>Position relationship in the x dimension.<br/>
                        <i>Pearson correlation coefficient: {metrics.pearsonX.toFixed(3)}</i></p>
                </div>
                <div>
                    <CorrelationChart
                        xData={gazeY}
                        yData={mouseY}
                        xLabel="Gaze Y (px)"
                        yLabel="Cursor Y (px)"
                        xDataKey="gazey"
                        yDataKey="cursory"
                    />
                    <p>Position relationship in the y dimension.<br/>
                        <i>Pearson correlation coefficient: {metrics.pearsonY.toFixed(3)}</i></p>
                </div>
                <div>
                    <CorrelationChart
                        xData={gazeSpeed}
                        yData={cursorSpeed}
                        xLabel="Gaze Speed (px/s)"
                        yLabel="Cursor Speed (px/s)"
                        xDataKey="gazespeed"
                        yDataKey="cursorspeed"
                    />
                    <p>Speed relationship, independent of direction.</p>
                </div>
            </div>
            <p><strong>Synchronization Index.</strong> The percentage of time when the cursor is within a radius of 50
                pixels from the point of fixation of the gaze</p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '1em', justifyContent: 'space-evenly'}}>
                <div>
                    <Heatmap
                        data={siHeatmapData}
                        extractCoordinates={(item) => item}
                    />
                    <p>Synchronization Index.</p>
                </div>
            </div>
        </>
    );
}

const ErrorScreen = ({error, session}: { error: string, session: any }) => (
    <>
        <h1>{error}</h1>
        <div>
            {!session ? <div>Session not found.</div> : <div>Something went wrong.</div>}
            <button onClick={() => window.location.reload()}>Reload the page</button>
        </div>
    </>
);

const LoadingSkeleton = () => (
    <>
        <Skeleton width={400} height={56} style={{margin: '2rem 0'}}/>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1em', justifyContent: 'space-evenly'}}>

            {[1, 2].map((_, i) => (
                <div key={i} style={{width: 500, height: 500}}>
                    <Skeleton height={500}/>
                </div>
            ))}

            {[1, 2, 3].map((_, i) => (
                <div key={i} style={{width: 500, height: 424}}>
                    <Skeleton height={400}/>
                    <div>
                        <Skeleton width={100} height={24}/>
                    </div>
                </div>
            ))}
        </div>
    </>
);
