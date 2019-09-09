import Handler from './handler';

/* Handle downloading a file.
 */
export default class DownloadHandler extends Handler {
    constructor({ produces, ...options }) {
        super(options);
        this.contentType = produces;
    }

    async processOutput(output, req, res) {
        return res.status(this.statusCode)
            .set('Content-Type', this.contentType)
            .send(output);
    }
}
