import NamingStrategy from '../naming';
import PagingStrategy from '../paging';

/* Resource configuration enables overriding naming and paging strategies.
 */
export default class ResourceConfig {
    constructor(options = {}) {
        const {
            namingStrategy = new NamingStrategy(),
            pagingStrategy = new PagingStrategy(),
        } = options;

        this.namingStrategy = namingStrategy;
        this.pagingStrategy = pagingStrategy;
    }
}
