import { camelCase, snakeCase, upperFirst } from 'lodash';

/* Define how resources will name identifiers.
 */
export default class NamingStrategy {
    constructor(options = {}) {
        const {
            idsUseCamelCase = true,
            pathsUseCamelCase = false,
        } = options;

        this.idsUseCamelCase = idsUseCamelCase;
        this.pathsUseCamelCase = pathsUseCamelCase;
    }

    /* Generate a resource's identifier name from an input name.
     *
     * Example: `foo_bar` => `fooBarId`
     */
    toIdentifierName(input) {
        if (this.idsUseCamelCase) {
            return camelCase(`${input}_id`);
        }
        return snakeCase(`${input}_id`);
    }

    /* Generate a resource's collection path from an input name.
     *
     * Example: `FooBar` => `foo_bar`
     */
    toCollectionPath(input) {
        if (this.pathsUseCamelCase) {
            return `/${camelCase(input)}`;
        }
        return `/${snakeCase(input)}`;
    }

    /* Generate a resource's collection path from an input name.
     *
     * Example: `FooBar` => `foo_bar`
     */
    toInstancePath(input, suffix) {
        if (!suffix) {
            return `${this.toCollectionPath(input)}/:${this.toIdentifierName(input)}`;
        }

        if (this.pathsUseCamelCase) {
            return `${this.toInstancePath(input)}/${camelCase(suffix)}`;
        }

        return `${this.toInstancePath(input)}/${snakeCase(suffix)}`;
    }

    /* Generate a resource's id from an input name.
     *
     * Example: `foo_bar` => `FooBar`
     */
    toResourceId(input) {
        if (this.idsUseCamelCase) {
            return upperFirst(camelCase(input));
        }

        return upperFirst(snakeCase(input));
    }

    /* Generate a list resource's id from an input name.
     *
     * Example: `foo` => `FooList`
     */
    toListResourceId(input) {
        return this.toResourceId(`${input}_list`);
    }
}
