import { FORBIDDEN } from 'http-status-codes';
import { merge } from 'lodash';

import HttpError from './base';

export default class Forbidden extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: FORBIDDEN }));
    }
}
