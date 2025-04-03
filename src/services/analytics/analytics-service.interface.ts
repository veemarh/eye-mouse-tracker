import {DRHeatmapCell, GazeData, LinearRegressionResult, MouseData, SIHeatmapCell, VelocityPair} from '../../@types';

export interface MetricsService {
    calculateLinearRegression(x: number[], y: number[]): Promise<LinearRegressionResult>;

    calculatePearsonCorrelation(x: number[], y: number[]): Promise<number>;

    getSynchronizedVelocityPairs(gazeData: GazeData[], mouseData: MouseData[], toleranceMs: number): Promise<VelocityPair[]>;

    calculateSI(gazeData: GazeData[], mouseData: MouseData[], screenWidth: number, screenHeight: number, radius: number, gridSize: number): Promise<SIHeatmapCell[]>;

    calculateDR(gazeData: GazeData[], mouseData: MouseData[], screenWidth: number, screenHeight: number, gridSize: number, actionThreshold: number): Promise<DRHeatmapCell[]>;
}
