import Reference from '../reference';

describe('Reference', () => {
    describe('build', () => {
        it('returns valid OpenAPI 2.0', () => {
            expect(new Reference('Foo').build('2.0')).toEqual({
                $ref: '#/definitions/Foo',
            });
        });
        it('returns valid OpenAPI 3.0.0', () => {
            expect(new Reference('Foo').build('3.0.0')).toEqual({
                $ref: '#/components/schemas/Foo',
            });
        });
    });
});
