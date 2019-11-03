/* Define how resources collections will paginate.
 */
export default class PagingStrategy {
    constructor(options = {}) {
        const {
            hasCount = true,
            hasOffsetLimit = true,
        } = options;

        this.hasCount = hasCount;
        this.hasOffsetLimit = hasOffsetLimit;
    }
}
