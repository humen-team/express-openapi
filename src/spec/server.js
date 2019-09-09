/* A server encapsulates an API's server endpoint.
 */
import { trimStart } from 'lodash';

import { DEFAULT_PATH, DEFAULT_SCHEME } from '../constants';

export default class Server {
    constructor(options = {}) {
        const {
            host,
            port,
            path = DEFAULT_PATH,
            scheme = DEFAULT_SCHEME,
        } = options;

        this.host = host;
        this.port = port;
        this.path = path;
        this.scheme = scheme;
    }

    get url() {
        const path = trimStart(this.path, '/');

        if (!this.host) {
            return `/${path}`;
        }

        if (!this.port) {
            return `${this.scheme}://${this.host}/${path}`;
        }

        return `${this.scheme}://${this.host}:${this.port}/${path}`;
    }

    build() {
        return {
            url: this.url,
        };
    }
}
