export interface CoordinatesData {
    x: number;
    y: number;
}

export interface GazeData implements CoordinatesData {
    x: number;
    y: number;
    timestamp: number;
}

export interface MouseData implements CoordinatesData {
    x: number;
    y: number;
    timestamp: number;
}

export interface ClickData {
    click: MouseData;
    gaze: GazeData | null;
}
