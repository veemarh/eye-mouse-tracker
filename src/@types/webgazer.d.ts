interface WebGazer {
    setRegression(regression: string): this;

    setGazeListener(listener: (data: { x: number; y: number } | null, elapsedTime: number) => void): this;

    clearGazeListener(): this;

    setTracker(tracker: string): this;

    saveDataAcrossSessions(save: boolean): this;

    isReady?(): boolean;

    begin(): Promise<void> | this;

    end(): void;
}


declare global {
    interface Window {
        webgazer: WebGazer;
    }
}

export {};
