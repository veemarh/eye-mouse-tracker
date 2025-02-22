import {ClickData, GazeData, MouseData} from '../../@types/coordinates';

export interface StorageService {
    getReportData(): { gazeData: GazeData[], mouseData: MouseData[], clickData: ClickData[] };
}
