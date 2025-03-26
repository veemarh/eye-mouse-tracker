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
            si: [],
            dr: 0,
        };

        const promises: Promise<any>[] = [];

        for (const metric of metrics) {
            switch (metric) {
                case 'pearson-x':
                    promises.push(
                        this.analytics.calculatePearsonCorrelation(
                            session.gazeData.map(g => g.x),
                            session.mouseData.map(m => m.x)
                        ).then(result => {
                            results.pearsonX = result;
                        })
                    );
                    break;
                case 'pearson-y':
                    promises.push(
                        this.analytics.calculatePearsonCorrelation(
                            session.gazeData.map(g => g.y),
                            session.mouseData.map(m => m.y)
                        ).then(result => {
                            results.pearsonY = result;
                        })
                    );
                    break;
                case 'linear-x':
                    promises.push(
                        this.analytics.calculateLinearRegression(
                            session.gazeData.map(g => g.x),
                            session.mouseData.map(m => m.x)
                        ).then(result => {
                            results.linearX = result;
                        })
                    );
                    break;
                case 'linear-y':
                    promises.push(
                        this.analytics.calculateLinearRegression(
                            session.gazeData.map(g => g.y),
                            session.mouseData.map(m => m.y)
                        ).then(result => {
                            results.linearY = result;
                        })
                    );
                    break;
                case 'velocity-correlation':
                    promises.push(
                        this.analytics.getSynchronizedVelocityPairs(
                            session.gazeData, session.mouseData
                        ).then(result => {
                            results.velocityCorrelation = result;
                        })
                    );
                    break;
                case 'si':
                    promises.push(
                        this.analytics.calculateSI(
                            session.gazeData, session.mouseData, document.documentElement.clientWidth, document.documentElement.clientHeight
                        ).then(result => {
                            results.si = result;
                        })
                    );
                    break;
                case 'dr':
                    promises.push(
                        this.analytics.calculateDR().then(result => {
                            results.dr = result;
                        })
                    );
                    break;
                default:
                    throw new Error(`Unknown metric type: ${metric}`);
            }
        }
        try {
            await Promise.all(promises);
        } catch {
            throw new Error('Error when calculating using ?worker');
        }
        return results;
    }
}

export const apiGateway = new APIGateway();
