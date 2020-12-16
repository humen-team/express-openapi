import { NO_CONTENT } from 'http-status-codes';

import CollectionOperation from './collection';

/* A REST-oriented Delete collection operation.
 *
 * That is, `delete` resource(s) through their collection path.
 */
export default class DeleteMany extends CollectionOperation {
    constructor(options) {
        super({
            method: 'DELETE',
            statusCode: NO_CONTENT,
            ...options,
        });
    }
}
