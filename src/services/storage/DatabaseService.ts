import EventEmitter from 'eventemitter3';
import {StorageService} from './storage-service.interface.ts';
import {ClickData, GazeData, MouseData, SessionData} from '../../@types';
import {webGazerTrackingService} from '../tracking';
import {v4 as uuidv4} from 'uuid';
import {LocalStorageService} from './localstorage';

class DatabaseService extends EventEmitter implements StorageService {
    private currentSession: SessionData | null = null;

    constructor() {
        super();
        this.loadInitialState();
        webGazerTrackingService.on('gaze', this.storeGaze);
        webGazerTrackingService.on('click', this.storeClick);
        webGazerTrackingService.on('mouse', this.storeMouse);
    }

    private loadInitialState() {
        this.currentSession = LocalStorageService.loadCurrentSession();
    }

    startNewSession() {
        const originalWidth = document.documentElement.clientWidth;
        const originalHeight = document.documentElement.clientHeight;
        this.currentSession = {
            id: uuidv4(),
            gazeData: [],
            clickData: [],
            mouseData: [],
            startedAt: new Date(),
            originalWidth,
            originalHeight,
        };
        this.persist();
    }

    endCurrentSession() {
        if (this.currentSession) {
            LocalStorageService.upsertSession(this.currentSession);
            this.currentSession = null;
            this.persist();
        }
    }

    private persist() {
        LocalStorageService.saveCurrentSession(this.currentSession);
        this.emit('update');
    }

    private storeGaze = (data: GazeData) => {
        if (this.currentSession) {
            this.currentSession.gazeData.push(data);
            this.persist();
        }
    };

    private storeClick = (data: ClickData) => {
        if (this.currentSession) {
            this.currentSession.clickData.push(data);
            this.persist();
        }
    };

    private storeMouse = (data: MouseData) => {
        if (this.currentSession) {
            this.currentSession.mouseData.push(data);
            this.persist();
        }
    };

    getCurrentSessionData() {
        return this.currentSession;
    }

    getAllSessions() {
        return LocalStorageService.loadSessions();
    }
}

export const databaseService = new DatabaseService();
