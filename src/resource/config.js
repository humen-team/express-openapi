import DefaultNamingStrategy from './naming';
import DefaultPagingStrategy from './paging';

/* Resource configuration enables overriding naming and paging strategies.
 */
export default class ResourceConfig {
    constructor(options = {}) {
        const {
            namingStrategy = new DefaultNamingStrategy(),
            pagingStrategy = new DefaultPagingStrategy(),
        } = options;

        this.namingStrategy = namingStrategy;
        this.pagingStrategy = pagingStrategy;
    }
}
