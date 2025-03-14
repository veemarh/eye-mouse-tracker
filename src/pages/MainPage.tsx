import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {apiGateway} from '../services/APIGateway';

export function MainPage() {
    const [tracking, setTracking] = useState(false);
    const [summary, setSummary] = useState({clicks: 0, gazes: 0});

    const start = () => {
        apiGateway.startTracking()
        setTracking(true);
    };

    const stop = () => {
        apiGateway.stopTracking();
        setTracking(false);
        const session = apiGateway.getCurrentSessionData();
        setSummary({
            clicks: session ? session.clickData.length : 0,
            gazes: session ? session.gazeData.length : 0,
        });
    };

    useEffect(() => {
        const updateHandler = () => {
            const session = apiGateway.getCurrentSessionData();
            if (session) {
                setSummary({
                    clicks: session.clickData.length,
                    gazes: session.gazeData.length,
                });
            }
        };
        apiGateway.onUpdate(updateHandler);
        return () => {
            apiGateway.offUpdate(updateHandler);
        };
    }, []);

    return (
        <div>
            <h1>HCI Vision</h1>
            <div>
                <button onClick={start} disabled={tracking}>Start tracking</button>
                <button onClick={stop} disabled={!tracking}>Stop tracking</button>
            </div>
            <div>
                <p>Clicks: {summary.clicks}</p>
                <p>Gazes: {summary.gazes}</p>
            </div>
            {!tracking && <Link to={`/sessions`}>View all sessions</Link>}
        </div>
    );
}
