import EventEmitter from 'eventemitter3';
import {StorageService} from './storage-service.interface.ts';
import {ClickData, GazeData, MouseData} from '../../@types/coordinates';
import {webGazerTrackingService} from '../tracking';

class DatabaseService extends EventEmitter implements StorageService {
    private gazeData: GazeData[] = [];
    private clickData: ClickData[] = [];
    private mouseData: MouseData[] = [];

    constructor() {
        super();
        webGazerTrackingService.on('gaze', this.storeGaze);
        webGazerTrackingService.on('click', this.storeClick);
        webGazerTrackingService.on('mouse', this.storeMouse);
    }

    private storeGaze = (data: GazeData) => {
        this.gazeData.push(data);
        this.emit('update');
    };

    private storeClick = (data: ClickData) => {
        this.clickData.push(data);
        this.emit('update');
    };

    private storeMouse = (data: MouseData) => {
        this.mouseData.push(data);
        this.emit('update');
    };

    getReportData() {
        return {clickData: this.clickData, gazeData: this.gazeData, mouseData: this.mouseData};
    }
}

export const databaseService = new DatabaseService();
