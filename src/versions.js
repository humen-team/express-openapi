import { OPENAPI_2_0, OPENAPI_3_0_0 } from './constants';

export default function buildVersion(self, openapiVersion) {
    if (openapiVersion === OPENAPI_2_0) {
        return self.build20(openapiVersion);
    }
    if (openapiVersion === OPENAPI_3_0_0) {
        return self.build300(openapiVersion);
    }
    throw new Error(`OpenAPI ${openapiVersion} is not supported`);
}
