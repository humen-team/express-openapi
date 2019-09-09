import InstanceOperation from './instance';

/* A REST-oriented Update operation.
 *
 * That is, `patch` a (possibly partial) representation of a resource into an existing
 * resource's instance path.
 */
export default class Update extends InstanceOperation {
    constructor(options) {
        super({
            method: 'patch',
            ...options,
        });
    }
}
