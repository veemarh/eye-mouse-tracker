import {GazeData, MouseData, VelocityPair} from '../@types';

/**
 * Calculates velocities (in pixels per second) for an array of data points.
 * @param data - Array of objects with x, y, and timestamp properties.
 * @returns An array of velocity values.
 */
export function calculateVelocities(data: Array<{ x: number; y: number; timestamp: number }>): number[] {
    return data.map((curr, index) => {
        if (index === 0) return 0;
        const prev = data[index - 1];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dt = (curr.timestamp - prev.timestamp) / 1000;
        return dt > 0 ? Math.max(0, Math.sqrt(dx * dx + dy * dy) / dt) : 0;
    });
}

/**
 * Synchronizes velocity samples from gaze and mouse data based on a time tolerance.
 * @param gazeData - Array of gaze data points.
 * @param mouseData - Array of mouse data points.
 * @param toleranceMs - Acceptable time difference (in ms) for synchronization (default 50ms).
 * @returns An array of synchronized velocity pairs.
 */
export function syncVelocityPairs(gazeData: GazeData[], mouseData: MouseData[], toleranceMs: number = 50): VelocityPair[] {
    const gazeSpeeds = calculateVelocities(gazeData);
    const cursorSpeeds = calculateVelocities(mouseData);

    const pairs: VelocityPair[] = [];
    let gazeIndex = 0;
    let cursorIndex = 0;

    while (gazeIndex < gazeSpeeds.length && cursorIndex < cursorSpeeds.length) {
        const gazeTime = gazeData[gazeIndex].timestamp;
        const cursorTime = mouseData[cursorIndex].timestamp;

        if (Math.abs(gazeTime - cursorTime) < toleranceMs) {
            pairs.push({
                gazeSpeed: gazeSpeeds[gazeIndex],
                cursorSpeed: cursorSpeeds[cursorIndex],
                timestamp: (gazeTime + cursorTime) / 2,
            });
            gazeIndex++;
            cursorIndex++;
        } else if (gazeTime < cursorTime) {
            gazeIndex++;
        } else {
            cursorIndex++;
        }
    }

    return pairs;
}
