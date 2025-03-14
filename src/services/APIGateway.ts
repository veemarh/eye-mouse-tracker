import {webGazerTrackingService} from './tracking';
import {databaseService} from './storage';

class APIGateway {
    startTracking() {
        databaseService.startNewSession();
        webGazerTrackingService.start();
    }

    stopTracking() {
        webGazerTrackingService.stop();
        databaseService.endCurrentSession();
    }

    getCurrentSessionData() {
        return databaseService.getCurrentSessionData();
    }

    getSessionList() {
        return databaseService.getAllSessions();
    }

    onUpdate(callback: () => void) {
        databaseService.on('update', callback);
    }

    offUpdate(callback: () => void) {
        databaseService.off('update', callback);
    }

}

export const apiGateway = new APIGateway();
