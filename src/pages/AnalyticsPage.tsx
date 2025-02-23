import {useParams} from 'react-router-dom';
import {databaseService} from '../services/storage';

export function AnalyticsPage() {
    const {sessionId} = useParams<{ sessionId: string }>();
    const session = databaseService.getAllSessions().find(s => s.id === sessionId);

    if (!session) {
        return <h2>Session not found</h2>;
    }
    return (
        <>
            <h1>Session analytics #{sessionId}</h1>
        </>
    )
}
