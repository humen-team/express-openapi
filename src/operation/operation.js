import { NO_CONTENT, OK } from 'http-status-codes';
import { concat } from 'lodash';

import { DEFAULT_CONSUMES, DEFAULT_PRODUCES, OPENAPI_2_0 } from '../constants';
import buildVersion from '../versions';
import Parameter from './parameter';
import Response from './response';
import { JSONSchemaResource } from '../resource';
import { Handler } from '../handler';

/* An `Operation` encapsulates an HTTP operation, along with its inputs and outputs.
 */
export default class Operation {
    constructor(options = {}) {
        const {
            consumes,
            description,
            error,
            input,
            method,
            middleware,
            operationId,
            output,
            path,
            produces,
            route,
            statusCode,
            tags,
        } = options;
        // all of these are defaultable or nullable
        this.consumes = consumes;
        this.description = description;
        this.error = error || this.constructor.defaultErrorResource;
        this.input = input;
        this.operationId = operationId || this.constructor.defaultOperationId;
        this.output = output;
        this.middleware = middleware || [];
        this.produces = produces;
        this.statusCode = statusCode || OK;
        this.tags = tags;

        if (!method) {
            throw new Error(`Operation ${this.operationId} must specify its 'method'`);
        }
        if (!path) {
            throw new Error(`Operation ${this.operationId} must specify its 'path'`);
        }
        if (!route) {
            throw new Error(`Operation ${this.operationId} must specify its 'route'`);
        }

        // all of these are mandatory
        this.method = method;
        this.path = path;
        this.route = route;
    }

    /* Register this operation with express.
     */
    register(app) {
        const handler = this.constructor.createHandler(this);
        app[this.method.toLowerCase()](this.path, ...this.middleware, handler.handle.bind(handler));
    }

    /* Define the default operation id.
     */
    static get defaultOperationId() {
        return this.name.replace('Operation', '').toLowerCase();
    }

    static get defaultErrorResource() {
        return new JSONSchemaResource({
            id: 'Error',
            properties: {
                message: {
                    type: 'string',
                },
                status: {
                    type: 'integer',
                },
            },
        });
    }

    static createHandler(operation) {
        return new Handler(operation);
    }

    /* Does this operation expect a request body?
     */
    get hasRequestBody() {
        return this.input && this.method !== 'GET' && this.method !== 'HEAD';
    }

    /* Does this operation expect a response body?
     */
    get hasResponseBody() {
        return this.statusCode !== NO_CONTENT && !!this.output;
    }

    /* Build an OpenAPI definition for this operation.
     */
    build(openapiVersion) {
        return buildVersion(this, openapiVersion);
    }

    build20(openapiVersion) {
        return {
            consumes: this.hasRequestBody ? [this.consumes || DEFAULT_CONSUMES] : undefined,
            description: this.description,
            operationId: this.operationId,
            parameters: this.buildParameters(openapiVersion),
            produces: this.hasResponseBody ? [this.produces || DEFAULT_PRODUCES] : undefined,
            responses: this.buildResponses(openapiVersion),
            tags: this.tags,
        };
    }

    build300(openapiVersion) {
        return {
            description: this.description,
            operationId: this.operationId,
            parameters: this.buildParameters(openapiVersion),
            requestBody: this.hasRequestBody
                ? {
                    required: true,
                    content: {
                        [this.consumes || DEFAULT_PRODUCES]: {
                            schema: {
                                $ref: this.input.toRef().build(openapiVersion),
                            },
                        },
                    },
                }
                : undefined,
            responses: this.buildResponses(openapiVersion),
            tags: this.tags,
        };
    }

    buildParameters(openapiVersion) {
        return this.listParameters(openapiVersion).map(
            (parameter) => parameter.build(openapiVersion),
        );
    }

    buildResponses(openapiVersion) {
        return Object.assign(
            ...this.listErrorResponses(openapiVersion).map(
                (response) => response.build(openapiVersion),
            ),
            ...this.listResponses(openapiVersion).map(
                (response) => response.build(openapiVersion),
            ),
        );
    }

    listParameters(openapiVersion) {
        return concat(
            openapiVersion === OPENAPI_2_0 ? this.listBodyParameters() : [],
            this.listQueryParameters(),
            this.listPathParameters(),
            // NB: we don't currently support header parameters to operations
        );
    }

    listBodyParameters() {
        return this.hasRequestBody ? [Parameter.forBody(this)] : [];
    }

    listPathParameters() { // eslint-disable-line class-methods-use-this
        return [];
    }

    listQueryParameters() {
        if (this.hasRequestBody || !this.input) {
            return [];
        }

        return Object.keys(this.input.properties).map(
            (name) => Parameter.forQuery({
                input: this.input,
                name,
            }),
        );
    }

    listErrorResponses() {
        return [
            Response.forError(this.error),
        ];
    }

    listResponses() {
        return [
            Response.forOperation(this),
        ];
    }
}
