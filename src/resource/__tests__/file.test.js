import File from '../file';

describe('File', () => {
    describe('build', () => {
        it('returns valid OpenAPI 2.0', () => {
            expect(new File('Foo').build('2.0')).toEqual({
                type: 'file',
            });
        });
        it('returns valid OpenAPI 3.0.0', () => {
            expect(new File('Foo').build('3.0.0')).toEqual({
                type: 'string',
                format: 'binary',
            });
        });
    });
});
