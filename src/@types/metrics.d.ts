import {VelocityPair} from './velocity';

/**
 * Interface for the results of a linear regression.
 */
export interface LinearRegressionResult {
    slope: number;
    intercept: number;
    rSquared: number;
}

/**
 * Interface for the metrics result.
 */
export interface MetricsResult {
    pearsonX: number;
    pearsonY: number;
    linearX: LinearRegressionResult;
    linearY: LinearRegressionResult;
    velocityCorrelation: VelocityPair[];
    si: SIHeatmapCell[];
    dr: DRHeatmapCell[];
}

/**
 * Interface for the results of a synchronization index.
 */
export interface SIHeatmapCell {
    x: number;
    y: number;
    si: number;
    count: number;
}

/**
 * Interface for the results of a discrepancy ratio.
 */
export interface DRHeatmapCell {
    x: number;
    y: number;
    dr: number;
    count: number;
}
