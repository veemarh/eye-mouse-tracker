import {useState, useEffect, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {apiGateway} from '../services/api';

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
            <div style={{
                position: 'fixed',
                top: '1em',
                right: '2em',
                zIndex: 10,
                borderRadius: '1em',
                padding: '1em',
                border: '1px solid gainsboro',
                backgroundColor: 'white',
                textAlign: 'center'
            }}>
                <h3>HCI Vision</h3>
                <form onSubmit={handleSubmit} style={{marginBottom: '1em'}}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL to load"
                        style={{width: '200px', padding: '0.5em', fontSize: '1em'}}
                    />
                    <button type="submit" style={{marginLeft: '1em', padding: '0.5em 1em'}}>Load Page</button>
                </form>
                <div>
                    <button onClick={start} disabled={tracking}>Start tracking</button>
                    <button onClick={stop} disabled={!tracking}>Stop tracking</button>
                </div>
                <p>Gazes: {summary.gazes}</p>
                {!tracking && <Link to={`/sessions`}>View all sessions</Link>}
            </div>
            <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100vw', height: '100vh'}}>
                {submittedUrl && (
                    <iframe
                        title="External Page"
                        src={`http://localhost:3001/proxy?url=${encodeURIComponent(submittedUrl)}`}
                        style={{width: '100vw', height: '100vh', border: 'none'}}
                    />
                )}
            </div>
        </>
    );
}
