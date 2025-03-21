import {pearsonCorrelation, linearRegression, syncVelocityPairs} from '../../utils';
import {GazeData, MouseData, VelocityPair} from '../../@types';
import {MetricsService} from './analytics-service.interface.ts';

class AnalyticsService implements MetricsService {
    calculateLinearRegression(x: number[], y: number[]) {
        return linearRegression(x, y);
    }

    calculatePearsonCorrelation(x: number[], y: number[]): number {
        return pearsonCorrelation(x, y);
    }

    getSynchronizedVelocityPairs(gazeData: GazeData[], mouseData: MouseData[], toleranceMs: number = 50): VelocityPair[] {
        return syncVelocityPairs(gazeData, mouseData, toleranceMs);
    }

    calculateSI(): number {
        return 0;
    }

    calculateDR(): number {
        return 0;
    }
}

export const analyticsService = new AnalyticsService();
