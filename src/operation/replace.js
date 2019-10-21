import InstanceOperation from './instance';

/* A REST-oriented Replace operation.
 *
 * That is, `put` a representation of a resource into an existing resource's instance path.
 */
export default class ReplaceOperation extends InstanceOperation {
    constructor(options) {
        super({
            method: 'PUT',
            ...options,
        });
    }
}
