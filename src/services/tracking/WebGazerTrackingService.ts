import EventEmitter from 'eventemitter3';
import {GazeData, ClickData, MouseData} from '../../@types/coordinates';
import {TrackingService} from './tracking-service.interface.ts';

class WebGazerTrackingService extends EventEmitter implements TrackingService {
    private lastGaze: GazeData | null = null;

    constructor() {
        super();
    }

    start() {
        if (!window.webgazer) {
            console.warn('WebGazer.js is not implemented!');
            return;
        }

        window.webgazer
            .setGazeListener((data) => {
                if (data) {
                    const gazeData: GazeData = {x: data.x, y: data.y, timestamp: Date.now()};
                    this.lastGaze = gazeData;
                    this.emit('gaze', gazeData);
                }
            })
            .setTracker('clmtrackr')
            .saveDataAcrossSessions(false)
            .begin();

        setTimeout(() => {
            document.addEventListener('click', this.handleClick);
            document.addEventListener('mousemove', this.handleMouseMove);
        }, 0);
    }

    stop() {
        if (!window.webgazer) return;
        window.webgazer.end();
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('mousemove', this.handleMouseMove);
    }

    private handleClick = (event: MouseEvent) => {
        const clickData: ClickData = {
            click: {x: event.clientX, y: event.clientY, timestamp: Date.now()},
            gaze: this.lastGaze
        };
        this.emit('click', clickData);
    };

    private handleMouseMove = (event: MouseEvent) => {
        const mouseData: MouseData = {x: event.clientX, y: event.clientY, timestamp: Date.now()};
        this.emit('mouse', mouseData);
    };
}

export const webGazerTrackingService = new WebGazerTrackingService();
