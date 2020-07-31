import Handler from './handler';

/* Handle downloading a file.
 */
export default class DownloadHandler extends Handler {

    constructor({ produces, ...options }) {
        super(options);
        this.produces = produces;
    }

    async processOutput(output, req, res, metadata) {
        const status = this.statusCode;

        if (this.telemetry && this.telemetry.onSuccess) {
            await this.telemetry.onSuccess({ ...metadata, status }, req, res);
        }

        if (output.data && output.headers) {
            Object.keys(output.headers).forEach(
                (name) => res.set(name, output.headers[name]),
            );

            return res.status(status).send(output.data);
        }

        return res.status(status)
            .set('Content-Type', this.produces)
            .send(output);
    }
}
