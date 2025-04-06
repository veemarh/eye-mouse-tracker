import {useState, useEffect, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {apiGateway} from '../services/api';
import styles from '../assets/css/MainPage.module.css';

export function MainPage() {
    const [tracking, setTracking] = useState(false);
    const [summary, setSummary] = useState({clicks: 0, gazes: 0});
    const [url, setUrl] = useState('');
    const [submittedUrl, setSubmittedUrl] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmittedUrl(url);
    };

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
        <>
            <div className={`${styles.toolbar} ${tracking && styles.hidden}`}>
                <h3>HCI Vision</h3>
                <form onSubmit={handleSubmit} className={styles.urlForm}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL to load"
                        className={styles.urlInput}
                    />
                    <button type="submit" className={styles.urlButton}>Load Page</button>
                </form>
                <button onClick={start} disabled={tracking}>Start tracking</button>
                <div><Link to={`/sessions`}>View all sessions</Link></div>
            </div>
            <button className={`${styles.stopTracking} ${!tracking && styles.hidden}`} onClick={stop}
                    disabled={!tracking}>Stop tracking ({summary.gazes})
            </button>
            <div className={styles.iframeWrapper}>
                {submittedUrl && (
                    <iframe
                        title="External Page"
                        src={`http://localhost:3001/proxy?url=${encodeURIComponent(submittedUrl)}`}
                        className={styles.iframe}
                    />
                )}
            </div>
        </>
    );
}
