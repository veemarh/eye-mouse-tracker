import {useState, useEffect} from 'react';
import {webGazerTrackingService} from '../../services/tracking';
import {databaseService} from '../../services/storage';

function MainWindow() {
    const [tracking, setTracking] = useState(false);
    const [summary, setSummary] = useState({clicks: 0, gazes: 0});

    const start = () => {
        webGazerTrackingService.start();
        setTracking(true);
    };

    const stop = () => {
        webGazerTrackingService.stop();
        setTracking(false);
        const report = databaseService.getReportData();
        setSummary({
            clicks: report.clickData.length,
            gazes: report.gazeData.length
        });
    };

    useEffect(() => {
        const updateHandler = () => {
            const report = databaseService.getReportData();
            setSummary({
                clicks: report.clickData.length,
                gazes: report.gazeData.length,
            });
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
        </div>
    );
}

export default MainWindow;
