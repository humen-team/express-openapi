import { NO_CONTENT } from 'http-status-codes';

import InstanceOperation from './instance';

/* A REST-oriented Delete operation.
 *
 * That is, `delete` a resource through its instance path.
 */
export default class Delete extends InstanceOperation {
    constructor(options) {
        super({
            method: 'delete',
            statusCode: NO_CONTENT,
            ...options,
        });
    }
}
