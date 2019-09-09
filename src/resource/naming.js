import { camelCase, upperFirst } from 'lodash';

/* Define how resources will name identifiers.
 */
export default class DefaultNamingStrategy {

    /* Generate a name from a source name.
     *
     * Example: `foo_bar` => `FooBar`
     */
    toName(value) { // eslint-disable-line class-methods-use-this
        return upperFirst(camelCase(value));
    }

    /* Generate a name for a list of values given a source name.
     *
     * Example: `foo` => `FooList`
     */
    toListName(value) { // eslint-disable-line class-methods-use-this
        return `${value}List`;
    }
}
