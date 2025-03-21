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
    si: number;
    dr: number;
}
