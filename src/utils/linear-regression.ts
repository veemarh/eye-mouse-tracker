/**
 * Interface for the results of a linear regression.
 */
interface LinearRegressionResult {
    slope: number;
    intercept: number;
    rSquared: number;
}

/**
 * Performs simple linear regression on the given arrays x and y, returning the results:
 * - slope: the slope of the regression line,
 * - intercept: the y-intercept (the point where the line crosses the y-axis),
 * - rSquared: the coefficient of determination, indicating the quality of the fit (ranging from 0 to 1).
 * @param x - An array of values for the independent variable (e.g., gaze coordinates).
 * @param y - An array of values for the dependent variable (e.g., cursor coordinates).
 * @throws Error if the arrays have different lengths or are empty.
 */
export function linearRegression(x: number[], y: number[]): LinearRegressionResult {
    if (x.length !== y.length) {
        throw new Error("Arrays must have the same length.");
    }
    const n = x.length;
    if (n === 0) {
        throw new Error("Arrays must not be empty.");
    }

    const xMean = x.reduce((sum, value) => sum + value, 0) / n;
    const yMean = y.reduce((sum, value) => sum + value, 0) / n;

    let numerator = 0;
    let sumSqX = 0;
    for (let i = 0; i < n; i++) {
        const diffX = x[i] - xMean;
        const diffY = y[i] - yMean;
        numerator += diffX * diffY;
        sumSqX += diffX * diffX;
    }

    const slope = numerator / sumSqX;
    const intercept = yMean - slope * xMean;

    let ssTot = 0;
    let ssRes = 0;
    for (let i = 0; i < n; i++) {
        const predicted = slope * x[i] + intercept;
        ssRes += (y[i] - predicted) ** 2;
        ssTot += (y[i] - yMean) ** 2;
    }

    const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    return {slope, intercept, rSquared};
}
