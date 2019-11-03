import NamingStrategy from '../naming';

describe('NamingStrategy', () => {
    const naming = new NamingStrategy();

    describe('toIdentifierName', () => {
        it('converts to lower camel case plus "Id"', () => {
            expect(naming.toIdentifierName('foo_bar')).toEqual('fooBarId');
        });
    });

    describe('toCollectionPath', () => {
        it('converts to snake case', () => {
            expect(naming.toCollectionPath('FooBar')).toEqual('/foo_bar');
        });
    });

    describe('toInstancePath', () => {
        it('combines collection path and identifier name', () => {
            expect(naming.toInstancePath('FooBar')).toEqual('/foo_bar/:fooBarId');
        });
        it('combines collection path, identifier name, and suffix', () => {
            expect(naming.toInstancePath('FooBar', 'ThisThat')).toEqual('/foo_bar/:fooBarId/this_that');
        });
    });

    describe('toResourceId', () => {
        it('converts to upper camel case', () => {
            expect(naming.toResourceId('foo_bar')).toEqual('FooBar');
        });
    });

    describe('toListResourceId', () => {
        it('converts to upper camel case plus "List"', () => {
            expect(naming.toListResourceId('foo_bar')).toEqual('FooBarList');
        });
    });
});
