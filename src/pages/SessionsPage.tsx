import {Link} from 'react-router-dom';
import {apiGateway} from '../services/APIGateway.ts';

export function SessionsPage() {
    const sessions = apiGateway.getSessionList();
    return (
        <>
            <h1>Sessions list</h1>
            {sessions.length
                ? <ul>
                    {sessions.map((session) => (
                        <li key={`session-${session.id}`}>
                            <Link to={`/analytics/${session.id}`}>Session {session.startedAt.toLocaleString()}</Link>
                        </li>
                    ))}
                </ul>
                : <>
                    <h2>Oops, there's nothing to show here.</h2>
                    <p>Try out <Link to={'/'}>gaze tracking</Link> first and come back.</p>
                </>
            }
        </>
    )
}
