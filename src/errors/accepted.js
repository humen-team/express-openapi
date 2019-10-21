import { ACCEPTED } from 'http-status-codes';
import { merge } from 'lodash';

import HttpError from './base';

export default class Accepted extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: ACCEPTED }));
    }
}
