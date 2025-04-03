import {DRHeatmapCell, GazeData, LinearRegressionResult, MouseData, SIHeatmapCell, VelocityPair} from '../../@types';
import {MetricsService} from './analytics-service.interface.ts';
import {runWorker} from '../web-worker';

export class AnalyticsService implements MetricsService {
    async calculateLinearRegression(x: number[], y: number[]): Promise<LinearRegressionResult> {
        return runWorker<LinearRegressionResult>('linearRegression', {x, y});
    }

    async calculatePearsonCorrelation(x: number[], y: number[]): Promise<number> {
        return runWorker<number>('pearsonCorrelation', {x, y});
    }

    async getSynchronizedVelocityPairs(
        gazeData: GazeData[],
        mouseData: MouseData[],
        toleranceMs: number = 50
    ): Promise<VelocityPair[]> {
        return runWorker<VelocityPair[]>('syncVelocityPairs', {gazeData, mouseData, toleranceMs});
    }

    async calculateSI(
        gazeData: GazeData[],
        mouseData: MouseData[],
        screenWidth: number,
        screenHeight: number,
        radius: number = 50,
        gridSize: number = 100
    ): Promise<SIHeatmapCell[]> {
        return runWorker<SIHeatmapCell[]>('si', {gazeData, mouseData, screenWidth, screenHeight, radius, gridSize});
    }

    async calculateDR(
        gazeData: GazeData[],
        mouseData: MouseData[],
        screenWidth: number,
        screenHeight: number,
        gridSize: number = 100,
        actionThreshold: number = 5,
    ): Promise<DRHeatmapCell[]> {
        return runWorker<DRHeatmapCell[]>('dr', {gazeData, mouseData, screenWidth, screenHeight, gridSize, actionThreshold});
    }
}

export const analyticsService = new AnalyticsService();
