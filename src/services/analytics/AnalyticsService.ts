import {GazeData, LinearRegressionResult, MouseData, SIHeatmapCell, VelocityPair} from '../../@types';
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

    async calculateDR(): Promise<number> {
        return runWorker<number>('dr', {});
    }
}

export const analyticsService = new AnalyticsService();
