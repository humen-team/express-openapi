import { CREATED } from 'http-status-codes';

import InstanceOperation from './instance';

/* A REST-oriented Create operation for a subordinate resource.
 */
export default class CreateFor extends InstanceOperation {
    constructor(options) {
        super({
            method: 'POST',
            statusCode: CREATED,
            ...options,
        });
    }
}
