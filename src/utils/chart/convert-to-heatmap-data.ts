import {CoordinatesData} from '../../@types';
import {HeatmapCoordinates} from '../../components/visualizations';

/**
 * Converts spatial data into heatmap-compatible format with normalized values and sizes.
 *
 * @param coordinates - Array of coordinate objects {x, y}.
 * @param values - Array of numerical values corresponding to each coordinate.
 * @param counts - Array of occurrence counts for each coordinate.
 * @returns Normalized heatmap data with:
 * - x/y: Original coordinates,
 * - value: Value normalized to 0-100 range (based on max value),
 * - radius: Size normalized to 0-100 range (based on max count).
 * @throws Error if input arrays have different lengths.
 */
export function convertToHeatmapData(coordinates: CoordinatesData[], values: number[], counts: number[]): HeatmapCoordinates[] {
    if (coordinates.length !== values.length || coordinates.length !== counts.length) {
        throw new Error('Input arrays must have equal lengths');
    }

    const maxValue = Math.max(...values);
    const maxCount = Math.max(...counts);

    const safeMaxValue = maxValue === 0 ? 1 : maxValue;
    const safeMaxCount = maxCount === 0 ? 1 : maxCount;

    return coordinates.map((coord, index) => ({
        x: coord.x,
        y: coord.y,
        value: (values[index] / safeMaxValue) * 100,
        radius: (counts[index] / safeMaxCount) * 100
    }));
}
