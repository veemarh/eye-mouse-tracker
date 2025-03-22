import {GazeData, LinearRegressionResult, MouseData, VelocityPair} from '../../@types';
import {MetricsService} from './analytics-service.interface.ts';
import {runWorker} from '../web-worker/runWorker.ts';

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

    async calculateSI(): Promise<number> {
        return runWorker<number>('si', {});
    }

    async calculateDR(): Promise<number> {
        return runWorker<number>('dr', {});
    }
}

export const analyticsService = new AnalyticsService();
