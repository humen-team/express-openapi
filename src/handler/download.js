import Handler from './handler';

/* Handle downloading a file.
 */
export default class DownloadHandler extends Handler {

    constructor({ produces, ...options }) {
        super(options);
        this.produces = produces;
    }

    async processOutput(output, req, res) {
        if (output.data && output.headers) {
            Object.keys(output.headers).forEach(
                (name) => res.set(name, output.headers[name]),
            );

            return res.status(this.statusCode).send(output.data);
        }

        return res.status(this.statusCode)
            .set('Content-Type', this.produces)
            .send(output);
    }
}
