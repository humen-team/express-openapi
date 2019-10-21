import Operation from './operation';

/* A generic Command operation.
 *
 * It defines a generic (e.g. non-RESTful), write operation via the `post` method.
 */
export default class Command extends Operation {
    constructor(options) {
        super({
            method: 'POST',
            ...options,
        });
    }
}
