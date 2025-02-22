import {SessionData} from '../../@types';

export interface StorageService {
    startNewSession(): void;

    endCurrentSession(): void;

    getCurrentSessionData(): SessionData | null;

    getAllSessions(): SessionData[];
}
