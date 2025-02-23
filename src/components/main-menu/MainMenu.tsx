import {useState, useEffect} from 'react';
import {webGazerTrackingService} from '../../services/tracking';
import {databaseService} from '../../services/storage';
import {Link} from 'react-router-dom';

function MainMenu() {
    const [tracking, setTracking] = useState(false);
    const [summary, setSummary] = useState({clicks: 0, gazes: 0});

    const start = () => {
        databaseService.startNewSession();
        webGazerTrackingService.start();
        setTracking(true);
    };

    const stop = () => {
        webGazerTrackingService.stop();
        databaseService.endCurrentSession();
        setTracking(false);
        const session = databaseService.getCurrentSessionData();
        setSummary({
            clicks: session ? session.clickData.length : 0,
            gazes: session ? session.gazeData.length : 0,
        });
    };

    useEffect(() => {
        const updateHandler = () => {
            const session = databaseService.getCurrentSessionData();
            if (session) {
                setSummary({
                    clicks: session.clickData.length,
                    gazes: session.gazeData.length,
                });
            }
        };
        databaseService.on('update', updateHandler);
        return () => {
            databaseService.off('update', updateHandler);
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

export default MainMenu;
