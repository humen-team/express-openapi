import InstanceOperation from './instance';

/* A REST-oriented Retrieve operation.
 *
 * That is, `get` a resource's representation through its instance path.
 */
export default class RetrieveOperation extends InstanceOperation {
    constructor(options) {
        super({
            method: 'get',
            ...options,
        });
    }
}
