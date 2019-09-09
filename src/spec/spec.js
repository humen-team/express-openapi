import { concat, merge } from 'lodash';

import { DEFAULT_OPENAPI_VERSION } from '../constants';
import buildVersion from '../versions';
import Info from './info';
import Server from './server';

function normalizePath(path) {
    const pattern = new RegExp(':([^/]+)', 'g');
    return path.replace(pattern, '{$1}');
}

/* A Spec encapsulates an API's info, server, and operations.
 */
export default class Spec {
    constructor(options = {}) {
        const { info, jwt, operations, server } = options;
        this.info = info || new Info();
        this.server = server || new Server();
        this.operations = operations || [];
        this.jwt = jwt;
    }

    build(openapiVersion = DEFAULT_OPENAPI_VERSION) {
        return buildVersion(this, openapiVersion);
    }

    build20(openapiVersion) {
        return {
            swagger: openapiVersion,
            info: this.info.build(openapiVersion),
            basePath: this.server.path,
            schemes: [
                this.server.scheme,
            ],
            definitions: this.buildDefinitions(openapiVersion),
            paths: this.buildPaths(openapiVersion),
        };
    }

    build300(openapiVersion) {
        const spec = {
            openapi: openapiVersion,
            info: this.info.build(openapiVersion),
            servers: [
                this.server.build(openapiVersion),
            ],
            components: {
                schemas: this.buildDefinitions(openapiVersion),
            },
            paths: this.buildPaths(openapiVersion),
        };

        if (this.jwt) {
            spec.components.securitySchemes = {
                bearerAuth: {
                    bearerFormat: 'JWT',
                    scheme: 'bearer',
                    type: 'http',
                },
            };
            spec.security = [{
                bearerAuth: [],
            }];
        }

        return spec;
    }

    buildDefinitions(openapiVersion) {
        return merge(
            {},
            ...concat(
                this.operations.filter(
                    ({ input, method }) => !!input && method !== 'get',
                ).map(
                    ({ input }) => ({
                        [input.id]: input.build(openapiVersion),
                    }),
                ),
            ),
            ...concat(
                // NB: we don't currently enumerate subordinate resources (e.g. for lists)
                // when operating on parent resources; we probably should
                this.operations.filter(
                    ({ output }) => !!output,
                ).map(
                    ({ output }) => ({
                        [output.id]: output.build(openapiVersion),
                    }),
                ),
            ),
            ...concat(
                this.operations.filter(
                    ({ error }) => !!error,
                ).map(
                    ({ error }) => ({
                        [error.id]: error.build(openapiVersion),
                    }),
                ),
            ),
        );
    }

    buildPaths(openapiVersion) {
        return merge(
            {},
            ...this.operations.map(
                (operation) => ({
                    [normalizePath(operation.path)]: {
                        [operation.method]: operation.build(openapiVersion),
                    },
                }),
            ),
        );
    }
}
