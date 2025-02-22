export interface GazeData {
    x: number;
    y: number;
    timestamp: number;
}

export interface MouseData {
    x: number;
    y: number;
    timestamp: number;
}

export interface ClickData {
    click: MouseData;
    gaze: GazeData | null;
}
