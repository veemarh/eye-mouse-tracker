/**
 * Computes the Pearson correlation coefficient between two arrays of numbers.
 * @param x - An array of values for the first variable.
 * @param y - An array of values for the second variable.
 * @returns The correlation coefficient in the range of -1 to 1.
 * @throws Error if the arrays have different lengths or are empty.
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length) {
        throw new Error("Arrays must have the same length.");
    }

    const n = x.length;
    if (n === 0) {
        throw new Error("Arrays should not be empty.");
    }

    const xMean = x.reduce((sum, value) => sum + value, 0) / n;
    const yMean = y.reduce((sum, value) => sum + value, 0) / n;

    let numerator = 0;
    let sumSqX = 0;
    let sumSqY = 0;

    for (let i = 0; i < n; i++) {
        const diffX = x[i] - xMean;
        const diffY = y[i] - yMean;
        numerator += diffX * diffY;
        sumSqX += diffX * diffX;
        sumSqY += diffY * diffY;
    }

    const denominator = Math.sqrt(sumSqX * sumSqY);
    if (denominator === 0) {
        return 0;
    }

    return numerator / denominator;
}
