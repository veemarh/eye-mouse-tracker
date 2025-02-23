import EventEmitter from 'eventemitter3';
import {StorageService} from './storage-service.interface.ts';
import {ClickData, GazeData, MouseData, SessionData} from '../../@types';
import {webGazerTrackingService} from '../tracking';
import {v4 as uuidv4} from 'uuid';

class DatabaseService extends EventEmitter implements StorageService {
    private currentSession: SessionData | null = null;
    private sessions: SessionData[] = [];

    constructor() {
        super();
        webGazerTrackingService.on('gaze', this.storeGaze);
        webGazerTrackingService.on('click', this.storeClick);
        webGazerTrackingService.on('mouse', this.storeMouse);
    }

    startNewSession() {
        this.currentSession = {
            id: uuidv4(),
            gazeData: [],
            clickData: [],
            mouseData: [],
            startedAt: new Date(),
        };
        this.emit('update');
    }

    endCurrentSession() {
        if (this.currentSession) {
            this.sessions.push(this.currentSession);
            this.currentSession = null;
            this.emit('update');
        }
    }

    private storeGaze = (data: GazeData) => {
        if (this.currentSession) {
            this.currentSession.gazeData.push(data);
            this.emit('update');
        }
    };

    private storeClick = (data: ClickData) => {
        if (this.currentSession) {
            this.currentSession.clickData.push(data);
            this.emit('update');
        }
    };

    private storeMouse = (data: MouseData) => {
        if (this.currentSession) {
            this.currentSession.mouseData.push(data);
            this.emit('update');
        }
    };

    getCurrentSessionData() {
        return this.currentSession;
    }

    getAllSessions() {
        return this.sessions;
    }
}

export const databaseService = new DatabaseService();
