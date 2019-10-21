import HttpStatus, { INTERNAL_SERVER_ERROR } from 'http-status-codes';

export default class HttpError extends Error {
    constructor(options) {
        const {
            status = INTERNAL_SERVER_ERROR,
            message,
        } = options;

        super(message || HttpStatus.getStatusText(status));
        this.status = status;
    }
}
