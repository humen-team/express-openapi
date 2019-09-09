import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, DEFAULT_VERSION } from '../constants';

/* Encapsulates API Spec Info.
 */
export default class Info {
    constructor(options = {}) {
        const {
            description = DEFAULT_DESCRIPTION,
            title = DEFAULT_TITLE,
            version = DEFAULT_VERSION,
        } = options;

        this.description = description;
        this.title = title;
        this.version = version;
    }

    build() {
        return {
            description: this.description,
            version: this.version,
            title: this.title,
        };
    }
}
