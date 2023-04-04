export class CorsWorker {

    constructor(url) {
        const objectURL = URL.createObjectURL(
            new Blob([`importScripts(${JSON.stringify(url.toString())});`], {
                type: 'application/javascript'
            })
        );
        this.worker = new Worker(objectURL);
        URL.revokeObjectURL(objectURL);
    }

    getWorker() {
        return this.worker;
    }
}