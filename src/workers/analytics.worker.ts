import {linearRegression, pearsonCorrelation, syncVelocityPairs} from '../utils';

interface WorkerMessage {
    type: 'pearsonCorrelation' | 'linearRegression' | 'syncVelocityPairs' | 'si' | 'dr';
    payload: any;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const {type, payload} = e.data;
    try {
        let result;
        switch (type) {
            case 'pearsonCorrelation': {
                result = pearsonCorrelation(payload.x, payload.y);
                break;
            }
            case 'linearRegression': {
                result = linearRegression(payload.x, payload.y);
                break;
            }
            case 'syncVelocityPairs': {
                result = syncVelocityPairs(payload.gazeData, payload.mouseData, payload.toleranceMs);
                break;
            }
            case 'si': {
                result = 0;
                break;
            }
            case 'dr': {
                result = 0;
                break;
            }
            default:
                throw new Error(`Unknown type: ${type}`);
        }

        self.postMessage({status: 'success', result});
    } catch (err: any) {
        self.postMessage({status: 'error', error: err.message});
    }
};
