import {useParams} from 'react-router-dom';
import {Heatmap, CorrelationChart, HeatmapCoordinates} from '../components/visualizations';
import {GazeData, MouseData, MetricsResult, SIHeatmapCell} from '../@types';
import {useEffect, useMemo, useState} from 'react';
import {apiGateway} from '../services/api';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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

    const convertToHeatmapData = (cells: SIHeatmapCell[]): HeatmapCoordinates[] => {
        const maxSI = Math.max(...cells.map(c => c.si));
        const maxCount = Math.max(...cells.map(c => c.count));

        return cells.map(cell => ({
            x: cell.x,
            y: cell.y,
            value: 100 * cell.si / maxSI,
            radius: (cell.count / maxCount) * 100
        }));
    };

    const heatmapData = convertToHeatmapData(metrics.si);

    return (
        <>
            <h1>Session analytics</h1>
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
                        xData={gazeX}
                        yData={mouseX}
                        xLabel="Gaze X (px)"
                        yLabel="Cursor X (px)"
                        xDataKey="gazex"
                        yDataKey="cursorx"
                    />
                    {metrics.pearsonX.toFixed(3)}
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
                    {metrics.pearsonY.toFixed(3)}
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
                    <Heatmap
                        data={heatmapData}
                        extractCoordinates={(item) => item}
                    />
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
