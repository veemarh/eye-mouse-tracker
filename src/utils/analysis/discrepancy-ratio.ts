import {DRHeatmapCell, GazeData, MouseData} from '../../@types';

/**
 * Computes the Discrepancy Ratio (DR) for building a heatmap.
 * DR is defined as the ratio of the number of fixations without subsequent actions
 * to the total number of fixations, expressed as a percentage.
 *
 * For each fixation (starting from the second sample), an action is considered to have occurred
 * if the Euclidean distance between the current and previous mouse positions is greater than or equal to the specified threshold.
 *
 * @param gazeData - Array of gaze data samples.
 * @param mouseData - Array of mouse data samples.
 * @param options - Options object containing screen dimensions, grid cell size, and action threshold (in pixels).
 * @returns An array of DRHeatmapCell objects for each grid cell that contains data.
 * @throws Error if gazeData and mouseData arrays have different lengths.
 */
export function discrepancyRatio(
    gazeData: GazeData[],
    mouseData: MouseData[],
    options: {
        screenWidth: number;
        screenHeight: number;
        gridSize: number;
        actionThreshold: number;
    }
): DRHeatmapCell[] {
    const {screenWidth, screenHeight, gridSize, actionThreshold} = options;

    if (gazeData.length !== mouseData.length) {
        throw new Error('Gaze and Mouse data arrays must have the same length');
    }

    const cols = Math.ceil(screenWidth / gridSize);
    const rows = Math.ceil(screenHeight / gridSize);
    const grid: { total: number; withoutAction: number }[][] = Array.from({length: rows}, () =>
        Array.from({length: cols}, () => ({total: 0, withoutAction: 0}))
    );

    for (let i = 1; i < gazeData.length; i++) {
        const g = gazeData[i];
        const mCurrent = mouseData[i];
        const mPrev = mouseData[i - 1];

        const col = Math.floor(g.x / gridSize);
        const row = Math.floor(g.y / gridSize);
        if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

        grid[row][col].total++;

        const dist = Math.hypot(mCurrent.x - mPrev.x, mCurrent.y - mPrev.y);
        if (dist < actionThreshold) {
            grid[row][col].withoutAction++;
        }
    }

    const cells: DRHeatmapCell[] = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            if (cell.total > 0) {
                cells.push({
                    x: col * gridSize + gridSize / 2,
                    y: row * gridSize + gridSize / 2,
                    dr: (cell.withoutAction / cell.total) * 100,
                    count: cell.total,
                });
            }
        }
    }
    return cells;
}
