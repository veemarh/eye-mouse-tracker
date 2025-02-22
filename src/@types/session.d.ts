import {ClickData, GazeData, MouseData} from './coordinates';

interface SessionData {
    gazeData: GazeData[];
    clickData: ClickData[];
    mouseData: MouseData[];
    startedAt: Date;
}
