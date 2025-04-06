import {SessionData} from '../../@types';

const SESSIONS_KEY = 'hci_vision_sessions';
const CURRENT_SESSION_KEY = 'hci_vision_current_session';

export const LocalStorageService = {
    saveCurrentSession(session: SessionData | null): void {
        try {
            if (session) {
                localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
            } else {
                localStorage.removeItem(CURRENT_SESSION_KEY);
            }
        } catch (error) {
            console.error('LocalStorage save error:', error);
        }
    },

    loadCurrentSession(): SessionData | null {
        try {
            const data = localStorage.getItem(CURRENT_SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('LocalStorage load error:', error);
            return null;
        }
    },

    saveSessions(sessions: SessionData[]): void {
        try {
            const sessionsMap = sessions.reduce((acc, session) => {
                acc[session.id] = session;
                return acc;
            }, {} as Record<string, SessionData>);

            localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsMap));
        } catch (error) {
            console.error('LocalStorage save sessions error:', error);
        }
    },

    loadSessions(): SessionData[] {
        try {
            const data = localStorage.getItem(SESSIONS_KEY);
            if (!data) return [];

            const sessionsMap = JSON.parse(data) as Record<string, SessionData>;
            return Object.values(sessionsMap);
        } catch (error) {
            console.error('LocalStorage load sessions error:', error);
            return [];
        }
    },

    upsertSession(session: SessionData): void {
        const sessions = this.loadSessions();
        const existing = sessions.find(s => s.id === session.id);

        if (existing) {
            Object.assign(existing, session);
        } else {
            sessions.push(session);
        }

        this.saveSessions(sessions);
    },

    deleteSession(sessionId: string): void {
        const sessions = this.loadSessions().filter(s => s.id !== sessionId);
        this.saveSessions(sessions);
    }
};
