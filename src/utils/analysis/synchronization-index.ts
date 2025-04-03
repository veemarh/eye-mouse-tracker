import {GazeData, MouseData, SIHeatmapCell} from '../../@types';

/**
 * Computes the Synchronization Index (SI) for a grid covering the screen.
 * SI is defined as the percentage of samples (or time) in which the cursor
 * is within a given radius R from the gaze fixation point.
 *
 * @param gazeData - Array of gaze data samples.
 * @param mouseData - Array of mouse data samples.
 * @param options - Configuration object including screen dimensions, radius and grid cell size.
 * @returns An array of SIHeatmapCell objects representing each grid cell with data.
 * @throws Error if gazeData and mouseData arrays have different lengths.
 */
export function synchronizationIndex(
    gazeData: GazeData[],
    mouseData: MouseData[],
    options: {
        screenWidth: number;
        screenHeight: number;
        radius: number;
        gridSize: number;
    }
): SIHeatmapCell[] {
    const {radius, gridSize, screenWidth, screenHeight} = options;

    if (gazeData.length !== mouseData.length) {
        throw new Error('Gaze and Mouse data arrays must have the same length');
    }

    // Инициализация сетки
    const cols = Math.ceil(screenWidth / gridSize);
    const rows = Math.ceil(screenHeight / gridSize);
    const grid: { total: number; matches: number }[][] = Array.from({length: rows}, () =>
        Array.from({length: cols}, () => ({total: 0, matches: 0}))
    );

    // Расчет совпадений для каждой точки
    for (let i = 0; i < gazeData.length; i++) {
        const g = gazeData[i];
        const m = mouseData[i];

        // Определение ячейки для текущей точки взгляда
        const col = Math.floor(g.x / gridSize);
        const row = Math.floor(g.y / gridSize);

        // Проверка границ сетки
        if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

        // Расчет расстояния между точками
        const distance = Math.hypot(g.x - m.x, g.y - m.y);
        const isMatch = distance <= radius ? 1 : 0;

        // Обновление счетчиков ячейки
        grid[row][col].total++;
        grid[row][col].matches += isMatch;
    }

    // Преобразование сетки в выходной формат
    return grid.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => ({
            x: colIndex * gridSize + gridSize / 2,
            y: rowIndex * gridSize + gridSize / 2,
            si: cell.total > 0 ? (cell.matches / cell.total) * 100 : 0,
            count: cell.total
        }))
    ).filter(cell => cell.count > 0); // Фильтрация пустых ячеек
}
