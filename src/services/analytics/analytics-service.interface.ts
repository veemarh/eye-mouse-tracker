import {GazeData, LinearRegressionResult, MouseData, VelocityPair} from '../../@types';

export interface MetricsService {
    calculateLinearRegression(x: number[], y: number[]): LinearRegressionResult;

    calculatePearsonCorrelation(x: number[], y: number[]): number;

    getSynchronizedVelocityPairs(gazeData: GazeData[], mouseData: MouseData[], toleranceMs: number): VelocityPair[];

    calculateSI(): number;

    calculateDR(): number;
}
