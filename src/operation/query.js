import Operation from './operation';

/* A generic Query operation.
 *
 * It defines a generic (e.g. non-RESTful), read operation via the `get` method.
 */
export default class Query extends Operation {
    constructor(options) {
        super({
            method: 'GET',
            ...options,
        });
    }
}
