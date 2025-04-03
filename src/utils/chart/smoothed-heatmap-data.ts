import {CoordinatesData} from '../../@types';

/**
 * Grid-based spatial aggregator for coordinate data visualization.
 *
 * Organizes input coordinates into a 2D grid matrix and calculates density statistics
 * for heatmap visualization. For each grid cell, computes:
 * - total number of coordinate points within the cell,
 * - central position of the cell for visualization reference.
 *
 * @param data - Array of coordinate samples.
 * @param options - Configuration parameters:
 * - screenWidth: Viewport width in pixels,
 * - screenHeight: Viewport height in pixels,
 * - gridSize: Cell dimension in pixels for spatial quantization.
 * @returns An array of grid cells with metadata for visualization containing.
 */
export function smoothedHeatmapData(
    data: CoordinatesData[],
    options: {
        screenWidth: number;
        screenHeight: number;
        gridSize: number;
    }
) {
    const {screenWidth, screenHeight, gridSize} = options;

    const cols = Math.ceil(screenWidth / gridSize);
    const rows = Math.ceil(screenHeight / gridSize);
    const grid: { total: number; withoutAction: number }[][] = Array.from({length: rows}, () =>
        Array.from({length: cols}, () => ({total: 0, withoutAction: 0}))
    );

    for (let i = 1; i < data.length; i++) {
        const d = data[i];

        const col = Math.floor(d.x / gridSize);
        const row = Math.floor(d.y / gridSize);
        if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

        grid[row][col].total++;
    }

    const cells = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            if (cell.total > 0) {
                cells.push({
                    x: col * gridSize + gridSize / 2,
                    y: row * gridSize + gridSize / 2,
                    count: cell.total,
                });
            }
        }
    }
    return cells;
}
