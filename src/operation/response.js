import { NO_CONTENT } from 'http-status-codes';
import { mapValues } from 'lodash';

import { JSON_MIMETYPE, OPENAPI_2_0, OPENAPI_3_0_0 } from '../constants';
import FileType from '../resource/file';
import pickVersion from '../versions';

/* Represents an OpenAPI Response.
 */
export default class Response {
    constructor({ contentType, description, headers, name, ref, file }) {
        this.contentType = contentType;
        this.description = description;
        this.headers = headers;
        this.name = name;
        this.ref = ref;
        this.file = file;
    }

    build(openapiVersion) {
        return pickVersion(this, 'build', openapiVersion)();
    }

    build20(openapiVersion = OPENAPI_2_0) {
        return {
            [this.name]: {
                description: this.description,
                schema: this.buildSchema(openapiVersion),
            },
        };
    }

    build300(openapiVersion = OPENAPI_3_0_0) {
        return {
            [this.name]: {
                description: this.description,
                content: this.contentType
                    ? {
                        [this.contentType]: {
                            schema: this.buildSchema(openapiVersion),
                        },
                    }
                    : undefined,
                headers: this.headers && Object.keys(this.headers).length
                    ? mapValues(this.headers, (type) => ({ schema: { type } }))
                    : undefined,
            },
        };
    }

    buildSchema(openapiVersion) {
        if (this.contentType === JSON_MIMETYPE) {
            if (this.ref) {
                return {
                    $ref: this.ref.build(openapiVersion),
                };
            }
        } else if (this.file) {
            return this.file.build(openapiVersion);
        }

        return undefined;
    }

    /* Create a response for an Operation.
     */
    static forOperation({ hasResponseBody, output, headers, produces, statusCode }) {
        if (hasResponseBody) {
            return new Response({
                contentType: produces || JSON_MIMETYPE,
                description: `${output.id} as JSON`,
                headers,
                name: statusCode,
                ref: output.toRef(),
            });
        }

        return new Response({
            description: 'Empty response',
            headers,
            name: NO_CONTENT,
        });
    }

    /* Create a response for an error.
     */
    static forError(error) {
        return new Response({
            contentType: JSON_MIMETYPE,
            description: 'An error occurred',
            name: 'default',
            ref: error ? error.toRef() : undefined,
        });
    }

    /* Create a response for a file.
     */
    static forFile({ headers, resourceName, produces, statusCode }) {
        return new Response({
            contentType: produces,
            description: `${resourceName} file content`,
            headers,
            name: statusCode,
            file: new FileType(),
        });
    }
}
