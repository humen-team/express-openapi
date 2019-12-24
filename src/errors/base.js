import HttpStatus, { INTERNAL_SERVER_ERROR } from 'http-status-codes';

/* Define a generic error used to encode an HTTP response.
 *
 * The default action for most application errors in an API-focused
 * application will be to forward the error back to the API consumer
 * in the API response. An error of type `HttpError`, one of its
 * subclasses, or a duck-typed equivalent provides sufficient detail
 * to describe such an error.
 *
 * Includes:
 *  - `status`:  the HTTP status code to return, defaults to 500
 *  - `message`: the human-readable message string to return to the API consumer
 *  - `code`:    an optional application error/status code to enable the API consumer
 *               to map specific error messages back to localized end-user messages
 */
export default class HttpError extends Error {
    constructor(options) {
        const {
            code = undefined,
            status = INTERNAL_SERVER_ERROR,
            message,
        } = options;

        super(message || HttpStatus.getStatusText(status));
        this.code = code;
        this.status = status;
    }
}
