/* eslint-disable max-classes-per-file */
import HttpStatus from 'http-status-codes';
import { merge } from 'lodash';

export default class HttpError extends Error {
    constructor(options) {
        const {
            status = HttpStatus.INTERNAL_SERVER_ERROR,
            message,
        } = options;

        super(message || HttpStatus.getStatusText(status));
        this.status = status;
    }
}

export class Conflict extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: HttpStatus.CONFLICT }));
    }
}

export class Forbidden extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: HttpStatus.FORBIDDEN }));
    }
}

export class InternalServerError extends HttpError {
}

export class NotFound extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: HttpStatus.NOT_FOUND }));
    }
}

export class Unauthorized extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: HttpStatus.UNAUTHORIZED }));
    }
}

export class UnprocessableEntity extends HttpError {
    constructor(options = {}) {
        super(merge(options, { status: HttpStatus.UNPROCESSABLE_ENTITY }));
    }
}
