import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { isUndefined, mapValues, omitBy } from 'lodash';

import { InternalServerError } from '../errors';

/* Recursively omit undefined.
 */
function deepOmitUndefined(object) {
    if (Array.isArray(object)) {
        return object.map(
            (item) => deepOmitUndefined(item),
        );
    }

    return omitBy(
        mapValues(
            object,
            (value) => (
                typeof value === 'object'
                    ? deepOmitUndefined(value)
                    : value
            ),
        ),
        isUndefined,
    );
}


/* Encapsulates executation of a route.
 */
export default class Handler {
    constructor({
        error,
        hasRequestBody,
        hasResponseBody,
        identifierName,
        input,
        output,
        route,
        statusCode,
    }) {
        this.error = error;
        this.hasRequestBody = hasRequestBody;
        this.hasResponseBody = hasResponseBody;
        this.identifierName = identifierName;
        this.input = input;
        this.output = output;
        this.route = route;
        this.statusCode = statusCode;
    }

    /* Define the request handling function.
     */
    async handle(req, res) {
        try {
            const input = await this.processInput(req, res);
            const output = await this.call(input, req, res);
            return this.processOutput(output, req, res);
        } catch (error) {
            return this.processError(error, req, res);
        }
    }

    /* Process and validate request intput.
     */
    async processInput(req) {
        if (!this.input) {
            return null;
        }

        const input = this.hasRequestBody ? req.body : req.query;
        return this.processInputData(input);
    }

    processInputData(input) {
        const convertedInput = this.input.castInput(input);
        return this.input.validate(convertedInput);
    }

    /* Process, validate, and send response output.
     */
    async processOutput(output, req, res) {
        if (!this.output || !this.hasResponseBody) {
            return res.status(this.statusCode).send();
        }

        const resource = await this.processOutputData(output);
        return res.status(this.statusCode).send(resource);
    }

    processOutputData(output) {
        const convertedOutput = deepOmitUndefined(this.output.castOutput(output));

        try {
            return this.output.validate(convertedOutput);
        } catch (error) {
            // a validation failure on output is not the requester's fault
            throw new InternalServerError({
                message: error.message,
            });
        }
    }

    /* Process, validate, and send response errors.
     */
    async processError(error, req, res) {
        const status = this.processErrorStatus(error);
        const resource = this.processErrorData(error);
        return res.status(status).send(resource);
    }

    processErrorStatus(error) { // eslint-disable-line class-methods-use-this
        return error.status || INTERNAL_SERVER_ERROR;
    }

    processErrorData(error) {
        const convertedError = deepOmitUndefined(
            this.error.castOutput({
                message: error.message || 'Error',
                ...error,
            }),
        );
        return this.error.validate(convertedError);
    }

    /* Invoke a route function.
     *
     * Establishes a calling convention to a user-supplied function. There are two flavors
     * to this calling convention at the moment, depending on whether the operation defines
     * an `identifierName` for extracting a `resourceId` from its path parameters:
     *
     *  (input, req, res) => output
     *
     * And:
     *
     *  (resourceId, input, req, res) => output
     *
     * Note that these calling conventions are designed to allow user-functions to ignore
     * the `req` and `res` parameters if not needed.
     */
    async call(input, req, res) {
        if (this.identifierName) {
            const resourceId = req.params[this.identifierName];
            return this.route(resourceId, input, req, res);
        }

        return this.route(input, req, res);
    }
}
