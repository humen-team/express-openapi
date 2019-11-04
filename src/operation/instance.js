import NamingStrategy from '../naming';
import Operation from './operation';
import Parameter from './parameter';

/* An `InstanceOperation` encapsulates a REST-oriented route that operates
 * on a single resource of a specific type.
 *
 * That is, it operates on a single instance of `foo` via the path `/foo/:fooId`.
 */
export default class InstanceOperation extends Operation {
    constructor({ resourceName, suffix, tags, ...more }) {
        const namingStrategy = more.namingStrategy || new NamingStrategy();
        super({
            namingStrategy,
            path: namingStrategy.toInstancePath(resourceName, suffix),
            tags: tags || [resourceName],
            ...more,
        });
        this.resourceName = resourceName;
        this.identifierName = namingStrategy.toIdentifierName(resourceName);
    }

    listPathParameters() {
        return [
            Parameter.forPath(this),
        ];
    }
}
