import {GazeData, LinearRegressionResult, MouseData, VelocityPair} from '../../@types';

export interface MetricsService {
    calculateLinearRegression(x: number[], y: number[]): Promise<LinearRegressionResult>;

    calculatePearsonCorrelation(x: number[], y: number[]): Promise<number>;

    getSynchronizedVelocityPairs(gazeData: GazeData[], mouseData: MouseData[], toleranceMs: number): Promise<VelocityPair[]>;

    calculateSI(): Promise<number>;

    calculateDR(): Promise<number>;
}
