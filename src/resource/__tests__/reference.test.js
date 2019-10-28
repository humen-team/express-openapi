import Reference from '../reference';

describe('Reference', () => {
    describe('build', () => {
        it('returns valid OpenAPI 2.0', () => {
            expect(new Reference({ id: 'Foo' }).build('2.0')).toEqual('#/definitions/Foo');
        });
        it('returns valid OpenAPI 3.0.0', () => {
            expect(new Reference({ id: 'Foo' }).build('3.0.0')).toEqual('#/components/schemas/Foo');
        });
    });
});
