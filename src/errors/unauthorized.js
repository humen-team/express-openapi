import { UNAUTHORIZED } from 'http-status-codes';
import { merge } from 'lodash';

import HttpError from './base';

export default class Unauthorized extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: UNAUTHORIZED }));
    }
}
