import { NOT_FOUND } from 'http-status-codes';
import { merge } from 'lodash';

import HttpError from './base';

export default class NotFound extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: NOT_FOUND }));
    }
}
