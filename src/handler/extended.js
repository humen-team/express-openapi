import Handler from './handler';

/* Extends handler calling convention to support headers.
 */
export default class ExtendedHandler extends Handler {

    async processOutput(input, req, res, metadata) {
        const { data, headers = {} } = input;

        Object.keys(headers).forEach(
            (name) => res.set(name, headers[name]),
        );

        return super.processOutput(data, req, res, metadata);
    }
}
