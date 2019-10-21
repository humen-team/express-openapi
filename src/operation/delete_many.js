import { NO_CONTENT } from 'http-status-codes';

import CollectionOperation from './collection';

/* A REST-oriented Delete collection operation.
 *
 * That is, `delete` a resource through its colletion path.
 */
export default class Delete extends CollectionOperation {
    constructor(options) {
        super({
            method: 'DELETE',
            statusCode: NO_CONTENT,
            ...options,
        });
    }
}
