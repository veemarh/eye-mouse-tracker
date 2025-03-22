export function runWorker<T>(type: string, payload: any): Promise<T> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL('../../workers/analytics.worker.ts', import.meta.url),
            {type: 'module'}
        );
        worker.onmessage = (e: MessageEvent<{ status: 'success' | 'error'; result?: T; error?: string }>) => {
            if (e.data.status === 'success') {
                let r = e.data.result!;
                resolve(r);
            } else {
                reject(new Error(e.data.error));
            }
            worker.terminate();
        };
        worker.onerror = (err) => {
            reject(err);
            worker.terminate();
        };
        worker.postMessage({type, payload});
    });
}
