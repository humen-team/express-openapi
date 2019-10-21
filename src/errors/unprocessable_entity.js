import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { merge } from 'lodash';

import HttpError from './base';

export default class UnprocessableEntity extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: UNPROCESSABLE_ENTITY }));
    }
}
