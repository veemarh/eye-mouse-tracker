import {webGazerTrackingService} from '../tracking';
import {databaseService} from '../storage';
import {analyticsService, MetricType} from '../analytics';
import {MetricsResult} from '../../@types';

class APIGateway {
    constructor(
        private analytics = analyticsService,
        private tracking = webGazerTrackingService,
        private storage = databaseService
    ) {
    }

    startTracking() {
        this.storage.startNewSession();
        this.tracking.start();
    }

    stopTracking() {
        this.tracking.stop();
        this.storage.endCurrentSession();
    }

    getCurrentSessionData() {
        return this.storage.getCurrentSessionData();
    }

    getSession(sessionId: string) {
        const session = this.storage.getAllSessions().find(s => s.id === sessionId);
        if (!session) {
            throw new Error(`Session with id ${sessionId} not found.`);
        }

        return session;
    }

    getSessionList() {
        return this.storage.getAllSessions();
    }

    onUpdate(callback: () => void) {
        this.storage.on('update', callback);
    }

    offUpdate(callback: () => void) {
        this.storage.off('update', callback);
    }

    async getMetrics(sessionId: string, metrics: MetricType[]): Promise<MetricsResult> {
        const session = this.getSession(sessionId);

        const results: MetricsResult = {
            pearsonX: 0,
            pearsonY: 0,
            linearX: {slope: 0, intercept: 0, rSquared: 0},
            linearY: {slope: 0, intercept: 0, rSquared: 0},
            velocityCorrelation: [],
            si: 0,
            dr: 0,
        };

        await Promise.resolve();

        for (const metric of metrics) {
            switch (metric) {
                case 'pearson-x':
                    results.pearsonX = this.analytics.calculatePearsonCorrelation(
                        session.gazeData.map(g => g.x),
                        session.mouseData.map(m => m.x)
                    );
                    break;
                case 'pearson-y':
                    results.pearsonY = this.analytics.calculatePearsonCorrelation(
                        session.gazeData.map(g => g.y),
                        session.mouseData.map(m => m.y)
                    );
                    break;
                case 'linear-x':
                    results.linearX = this.analytics.calculateLinearRegression(
                        session.gazeData.map(g => g.x),
                        session.mouseData.map(m => m.x)
                    );
                    break;
                case 'linear-y':
                    results.linearY = this.analytics.calculateLinearRegression(
                        session.gazeData.map(g => g.y),
                        session.mouseData.map(m => m.y)
                    );
                    break;
                case 'velocity-correlation':
                    results.velocityCorrelation = this.analytics.getSynchronizedVelocityPairs(
                        session.gazeData, session.mouseData
                    );
                    break;
                case 'si':
                    results.si = this.analytics.calculateSI();
                    break;
                case 'dr':
                    results.dr = this.analytics.calculateDR();
                    break;
            }
        }

        return results;
    }
}

export const apiGateway = new APIGateway();
