import Operation from './operation';
import Parameter from './parameter';

/* An `InstanceOperation` encapsulates a REST-oriented route that operates
 * on a single resource of a specific type.
 *
 * That is, it operates on a single instance of `foo` via the path `/foo/:fooId`.
 */
export default class InstanceOperation extends Operation {
    constructor({ resourceName, ...more }) {
        const identifierName = `${resourceName}Id`;
        super({
            path: `/${resourceName}/:${identifierName}`,
            tags: [
                resourceName,
            ],
            ...more,
        });
        this.resourceName = resourceName;
        this.identifierName = identifierName;
    }

    listPathParameters() {
        return [
            Parameter.forPath(this),
        ];
    }
}
