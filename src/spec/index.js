import { concat, flatten } from 'lodash';

import Info from './info';
import Server from './server';
import Spec from './spec';

function buildSpec({ info, operations, server, ...options }) {
    return new Spec({
        info,
        operations: flatten(concat(
            operations.map(
                (operation) => operation.operations || operation,
            ),
        )),
        server,
        ...options,
    });
}

function serveSpec({ openapiVersion, ...options }) {
    const spec = buildSpec(options);
    return spec.serve(openapiVersion);
}

export {
    Info,
    Server,
    Spec,
    buildSpec,
    serveSpec,
};
