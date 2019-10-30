import { get } from 'lodash';

import { OPENAPI_2_0, OPENAPI_3_0_0 } from './constants';

export default function pickVersion(self, name, openapiVersion) {
    let suffix;
    switch (openapiVersion) {
        case OPENAPI_2_0:
            suffix = '20';
            break;
        case OPENAPI_3_0_0:
            suffix = '300';
            break;
        default:
            throw new Error(`OpenAPI ${openapiVersion} is not supported`);
    }

    const funcName = `${name}${suffix}`;
    const func = get(self, funcName);
    return func.bind(self);
}
