import { CREATED } from 'http-status-codes';

import CollectionOperation from './collection';

/* A REST-oriented Create operation.
 *
 * That is, `post` a representation of a resource to be created to the collection path
 * and return a newly resource resource as an instance path.
 */
export default class Create extends CollectionOperation {
    constructor(options) {
        super({
            method: 'POST',
            statusCode: CREATED,
            ...options,
        });
    }
}
