import { NO_CONTENT } from 'http-status-codes';

import CollectionOperation from './collection';
import { ExtendedHandler } from '../handler';

/* A REST-oriented Count operation.
 *
 * That is, `head` a collection of resources from the collection path to get its count.
 */
export default class Count extends CollectionOperation {
    constructor(options = {}) {
        super({
            method: 'HEAD',
            statusCode: NO_CONTENT,
            ...options,
        });
        this.headers = {
            'X-Total-Count': 'integer',
        };
    }

    static createHandler(operation) {
        return new ExtendedHandler(operation);
    }
}
