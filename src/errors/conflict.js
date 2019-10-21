import { CONFLICT } from 'http-status-codes';
import { merge } from 'lodash';

import HttpError from './base';

export default class Conflict extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: CONFLICT }));
    }
}
