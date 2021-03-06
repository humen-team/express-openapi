import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { isPlainObject, isUndefined, mapValues, omitBy } from 'lodash';

import { InternalServerError } from '../errors';

/* Recursively omit undefined.
 */
function deepOmitUndefined(object) {
    if (Array.isArray(object)) {
        return object.map(
            (item) => deepOmitUndefined(item),
        );
    }

    if (isPlainObject(object)) {
        return omitBy(
            mapValues(
                object,
                (value) => deepOmitUndefined(value),
            ),
            isUndefined,
        );
    }

    return object;
}

/* Encapsulates executation of a route.
 */
export default class Handler {
    constructor({
        error,
        errorHandler,
        hasRequestBody,
        hasResponseBody,
        identifierName,
        input,
        operationId,
        output,
        resourceName,
        route,
        statusCode,
        telemetry,
        validateIdentifier,
    }) {
        this.error = error;
        this.errorHandler = errorHandler;
        this.hasRequestBody = hasRequestBody;
        this.hasResponseBody = hasResponseBody;
        this.identifierName = identifierName;
        this.input = input;
        this.operationId = operationId;
        this.output = output;
        this.resourceName = resourceName;
        this.route = route;
        this.statusCode = statusCode;
        this.telemetry = telemetry;
        this.validateIdentifier = validateIdentifier;
    }

    /* Define the request handling function.
     */
    async handle(req, res) {
        const metadata = {
            resourceName: this.resourceName,
            operationId: this.operationId,
        };

        if (this.telemetry && this.telemetry.onHandle) {
            await this.telemetry.onHandle(metadata, req, res);
        }

        try {
            const input = await this.processInput(req, res);
            const output = await this.call(input, req, res);
            const result = await this.processOutput(output, req, res, metadata);
            return result;
        } catch (error) {
            const errorToUse = this.errorHandler(error);
            const result = await this.processError(errorToUse, req, res, metadata);
            return result;
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
    async processOutput(output, req, res, metadata) {
        const status = this.statusCode;

        if (this.telemetry && this.telemetry.onSuccess) {
            await this.telemetry.onSuccess({ ...metadata, status }, req, res);
        }

        if (!this.output || !this.hasResponseBody) {
            return res.status(status).send();
        }

        const resource = this.processOutputData(output);
        return res.status(status).send(resource);
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
    async processError(error, req, res, metadata) {
        const status = this.processErrorStatus(error);

        if (this.telemetry && this.telemetry.onError) {
            await this.telemetry.onError({ ...metadata, status }, req, res, error);
        }

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
