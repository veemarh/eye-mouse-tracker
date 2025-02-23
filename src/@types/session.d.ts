import {ClickData, GazeData, MouseData} from './coordinates';

interface SessionData {
    id: string;
    gazeData: GazeData[];
    clickData: ClickData[];
    mouseData: MouseData[];
    startedAt: Date;
}
