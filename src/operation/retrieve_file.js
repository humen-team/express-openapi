import { BINARY_MIMETYPE } from '../constants';

import InstanceOperation from './instance';
import Response from './response';
import { DownloadHandler } from '../handler';

/* A REST-oriented file download operation.
 *
 * That is, behave like the `RetrieveOperation` except that the output
 * resource is a file.
 */
export default class RetrieveFileOperation extends InstanceOperation {
    constructor({ produces, ...options }) {
        super({
            method: 'get',
            produces: produces || BINARY_MIMETYPE,
            ...options,
        });
    }

    static createHandler(operation) {
        return new DownloadHandler(operation);
    }

    get hasResponseBody() { // eslint-disable-line class-methods-use-this
        return true;
    }

    listResponses() {
        return [
            Response.forFile(this),
        ];
    }
}
