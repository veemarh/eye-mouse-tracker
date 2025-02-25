import EventEmitter from 'eventemitter3';
import {GazeData, ClickData, MouseData} from '../../@types';
import {TrackingService} from './tracking-service.interface.ts';

class WebGazerTrackingService extends EventEmitter implements TrackingService {
    private lastGaze: GazeData | null = null;
    private lastMouse: MouseData = {x: 0, y: 0, timestamp: Date.now()};

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

                    this.captureMouseOnce().then((mouseData: MouseData) => {
                        this.emit('gaze', gazeData);
                        this.emit('mouse', mouseData);
                    });
                }
            })
            .setTracker('clmtrackr')
            .saveDataAcrossSessions(false)
            .begin();

        setTimeout(() => {
            document.addEventListener('click', this.handleClick);
        }, 0);
    }

    stop() {
        if (!window.webgazer) return;
        window.webgazer.end();
        document.removeEventListener('click', this.handleClick);
    }

    private handleClick = (event: MouseEvent) => {
        const clickData: ClickData = {
            click: {x: event.clientX, y: event.clientY, timestamp: Date.now()},
            gaze: this.lastGaze
        };
        this.emit('click', clickData);
    };

    /**
     * Захватывает одно событие движения мыши, используя одноразовый обработчик.
     * Если событие не происходит в течение 10 мс, возвращает последнее известное положение.
     */
    private captureMouseOnce(): Promise<MouseData> {
        return new Promise((resolve) => {
            let resolved = false;
            const handler = (event: MouseEvent) => {
                if (!resolved) {
                    resolved = true;
                    document.removeEventListener('mousemove', handler);
                    const mouseData: MouseData = {x: event.clientX, y: event.clientY, timestamp: Date.now()};
                    this.lastMouse = mouseData;
                    resolve(mouseData);
                }
            };

            document.addEventListener('mousemove', handler, {once: true});

            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    document.removeEventListener('mousemove', handler);
                    resolve(this.lastMouse);
                }
            }, 10);
        });
    }
}

export const webGazerTrackingService = new WebGazerTrackingService();
