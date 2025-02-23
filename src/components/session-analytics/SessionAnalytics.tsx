import {useParams} from 'react-router-dom';
import {databaseService} from '../../services/storage';

function SessionAnalytics() {
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

export default SessionAnalytics;
