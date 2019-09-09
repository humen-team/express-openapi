/* Define how resources collections will paginate.
 */
export default class DefaultPagingStrategy {
    constructor() {
        this.hasCount = true;
        this.hasOffsetLimit = true;
    }
}
